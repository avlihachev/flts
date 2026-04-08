import json
import sys
from typing import Any

from claude_agent_sdk import tool


def _log(msg: str) -> None:
    print(msg, file=sys.stderr, flush=True)

from flts.db.models import get_connection, get_price_history as db_get_price_history


@tool(
    "get_price_history",
    "Query stored price history for a route. Shows how prices have changed over time. Useful for determining if current price is a good deal.",
    {
        "type": "object",
        "properties": {
            "origin": {"type": "string", "description": "Origin airport IATA code"},
            "destination": {"type": "string", "description": "Destination airport IATA code"},
            "travel_date": {"type": "string", "description": "Specific travel date YYYY-MM-DD (optional)"},
            "days_back": {"type": "integer", "default": 30, "description": "How many days of history to show"},
        },
        "required": ["origin", "destination"],
    },
)
async def get_price_history_tool(args: dict[str, Any]) -> dict[str, Any]:
    _log(f"📊 get_price_history: {args['origin']}→{args['destination']}")
    conn = get_connection()
    history = db_get_price_history(
        conn,
        origin=args["origin"].upper(),
        destination=args["destination"].upper(),
        travel_date=args.get("travel_date"),
        days_back=args.get("days_back", 30),
    )
    conn.close()

    if not history:
        _log(f"  ✗ get_price_history: no data")
        return {"content": [{"type": "text", "text": f"No price history for {args['origin']}→{args['destination']}."}]}

    prices = [h["price"] for h in history]
    _log(f"  ✓ get_price_history: {len(history)} entries, {min(prices):.0f}–{max(prices):.0f}")
    summary = {
        "route": f"{args['origin']}→{args['destination']}",
        "entries": len(history),
        "min_price": min(prices),
        "max_price": max(prices),
        "avg_price": round(sum(prices) / len(prices), 2),
        "latest": history[0],
        "history": history[:20],
    }

    return {"content": [{"type": "text", "text": json.dumps(summary, ensure_ascii=False, indent=2)}]}
