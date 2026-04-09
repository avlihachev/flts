import asyncio
import json
import os
import time
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv

from fli.models import (
    DateSearchFilters,
    FlightSegment,
    Airport,
    MaxStops,
    PassengerInfo,
    SeatType,
    TripType,
)
from fli.search import SearchDates

from flts.db.models import (
    get_connection,
    list_watches,
    log_price,
    update_watch_checked,
)

JOURNAL_PATH = Path.home() / ".flts" / "journal.jsonl"


def _check_watch(watch: dict) -> list[dict]:
    """Run a date search for a watch, return results below threshold."""
    try:
        origin = Airport[watch["origin"]]
        destination = Airport[watch["destination"]]
    except KeyError:
        print(f"  Unknown airport code in watch #{watch['id']}")
        return []

    trip_type = TripType.ROUND_TRIP if watch["trip_type"] == "round_trip" else TripType.ONE_WAY
    segments = [
        FlightSegment(
            departure_airport=[[origin, 0]],
            arrival_airport=[[destination, 0]],
            travel_date=watch["from_date"],
        )
    ]
    if trip_type == TripType.ROUND_TRIP:
        segments.append(
            FlightSegment(
                departure_airport=[[destination, 0]],
                arrival_airport=[[origin, 0]],
                travel_date=watch["to_date"],
            )
        )

    kwargs = {
        "trip_type": trip_type,
        "passenger_info": PassengerInfo(adults=1),
        "flight_segments": segments,
        "seat_type": SeatType.ECONOMY,
        "stops": MaxStops.ANY,
        "from_date": watch["from_date"],
        "to_date": watch["to_date"],
    }
    if trip_type == TripType.ROUND_TRIP and watch.get("duration_days"):
        kwargs["duration"] = watch["duration_days"]

    try:
        filters = DateSearchFilters(**kwargs)
        search = SearchDates()
        results = search.search(filters)
    except Exception as e:
        print(f"  Search error for watch #{watch['id']}: {e}")
        return []

    if not results:
        return []

    hits = []
    for dp in results:
        if dp.price <= watch["max_price"]:
            dates = [d.isoformat() if hasattr(d, "isoformat") else str(d) for d in dp.date]
            hits.append({
                "date": dates[0] if len(dates) == 1 else dates,
                "price": dp.price,
                "currency": dp.currency or watch["currency"],
            })

    return sorted(hits, key=lambda x: x["price"])


async def _send_telegram_alert(watch: dict, hits: list[dict]):
    """Send Telegram notification about price drops."""
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")
    if not token or not chat_id:
        print("  Telegram not configured, skipping notification")
        return

    try:
        from telegram import Bot
        bot = Bot(token=token)

        route = f"{watch['origin']} → {watch['destination']}"
        lines = [f"*{route}* — найдены дешёвые билеты!\n"]
        for h in hits[:5]:
            date_str = h["date"] if isinstance(h["date"], str) else " / ".join(h["date"])
            lines.append(f"  {date_str}: {h['price']:.0f} {h['currency']}")
        lines.append(f"\nПорог: {watch['max_price']:.0f} {watch['currency']}")

        await bot.send_message(
            chat_id=chat_id,
            text="\n".join(lines),
            parse_mode="Markdown",
        )
        print(f"  Telegram alert sent for watch #{watch['id']}")
    except Exception as e:
        print(f"  Telegram error: {e}")


def _log_to_journal(watch: dict, hits: list[dict]):
    """Append monitor results to journal."""
    JOURNAL_PATH.parent.mkdir(parents=True, exist_ok=True)
    entry = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "type": "monitor_alert" if hits else "monitor_check",
        "route": f"{watch['origin']}-{watch['destination']}",
        "results_summary": f"{len(hits)} hits below {watch['max_price']} {watch['currency']}" if hits else "no hits",
    }
    if hits:
        entry["best_price"] = hits[0]["price"]
        entry["best_date"] = hits[0]["date"]

    with open(JOURNAL_PATH, "a") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")


def _is_due(watch: dict) -> bool:
    """Check if a watch is due for checking."""
    if not watch["last_checked"]:
        return True
    last = datetime.fromisoformat(watch["last_checked"])
    elapsed = (datetime.now(timezone.utc) - last).total_seconds() / 3600
    return elapsed >= watch["check_interval_hours"]


def run_monitor():
    """Main monitoring loop."""
    load_dotenv()
    print("flts monitor started")
    print("Press Ctrl+C to stop\n")

    while True:
        conn = get_connection()
        active_watches = list_watches(conn)

        if not active_watches:
            print("No active watches. Sleeping 60s...")
            conn.close()
            time.sleep(60)
            continue

        for watch in active_watches:
            if not _is_due(watch):
                continue

            route = f"{watch['origin']}→{watch['destination']}"
            print(f"Checking watch #{watch['id']} {route}...")

            hits = _check_watch(watch)

            best_price = hits[0]["price"] if hits else None
            update_watch_checked(conn, watch["id"], last_price=best_price)

            # log all found prices
            if hits:
                for h in hits[:10]:
                    date_val = h["date"] if isinstance(h["date"], str) else h["date"][0]
                    log_price(
                        conn,
                        watch["origin"],
                        watch["destination"],
                        date_val,
                        h["price"],
                        h.get("currency", "EUR"),
                        source="monitor",
                    )

                print(f"  {len(hits)} flights below {watch['max_price']} {watch['currency']}, best: {hits[0]['price']}")
                asyncio.run(_send_telegram_alert(watch, hits))
            else:
                print(f"  No flights below threshold")

            _log_to_journal(watch, hits)

        conn.close()

        # find next check time
        min_interval = min(w["check_interval_hours"] for w in active_watches)
        sleep_seconds = max(60, min_interval * 3600 // 2)
        print(f"\nSleeping {sleep_seconds}s until next check...\n")
        time.sleep(sleep_seconds)
