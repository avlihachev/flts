import sys
from typing import Any

from claude_agent_sdk import tool


def _log(msg: str) -> None:
    print(msg, file=sys.stderr, flush=True)

from fli.models import (
    Airport,
    Airline,
    DateSearchFilters,
    FlightSearchFilters,
    FlightSegment,
    MaxStops,
    PassengerInfo,
    PriceLimit,
    SeatType,
    SortBy,
    TripType,
)
from fli.search import SearchDates, SearchFlights


_SEAT_MAP = {
    "economy": SeatType.ECONOMY,
    "premium_economy": SeatType.PREMIUM_ECONOMY,
    "business": SeatType.BUSINESS,
    "first": SeatType.FIRST,
}

_STOPS_MAP = {
    "any": MaxStops.ANY,
    "nonstop": MaxStops.NON_STOP,
    "1": MaxStops.ONE_STOP_OR_FEWER,
    "2": MaxStops.TWO_OR_FEWER_STOPS,
}

_TRIP_MAP = {
    "one_way": TripType.ONE_WAY,
    "round_trip": TripType.ROUND_TRIP,
}


def _resolve_airport(code: str) -> Airport:
    return Airport[code.upper()]


def _resolve_airlines(codes: list[str]) -> list[Airline]:
    return [Airline[c.upper()] for c in codes]


def _build_segments(
    origin: str, destination: str, date: str, return_date: str | None = None
) -> list[FlightSegment]:
    segments = [
        FlightSegment(
            departure_airport=[[_resolve_airport(origin), 0]],
            arrival_airport=[[_resolve_airport(destination), 0]],
            travel_date=date,
        )
    ]
    if return_date:
        segments.append(
            FlightSegment(
                departure_airport=[[_resolve_airport(destination), 0]],
                arrival_airport=[[_resolve_airport(origin), 0]],
                travel_date=return_date,
            )
        )
    return segments


def _format_flight_result(result) -> dict:
    return {
        "price": result.price,
        "currency": result.currency,
        "duration_min": result.duration,
        "stops": result.stops,
        "legs": [
            {
                "airline": leg.airline.name,
                "flight_number": leg.flight_number,
                "from": leg.departure_airport.name,
                "to": leg.arrival_airport.name,
                "departure": leg.departure_datetime.isoformat(),
                "arrival": leg.arrival_datetime.isoformat(),
                "duration_min": leg.duration,
            }
            for leg in result.legs
        ],
    }


@tool(
    "search_flights",
    "Search flights for a specific route and date. Returns detailed flight options with prices, airlines, times, and stops.",
    {
        "type": "object",
        "properties": {
            "origin": {"type": "string", "description": "Origin airport IATA code (e.g. HEL, JFK)"},
            "destination": {"type": "string", "description": "Destination airport IATA code"},
            "date": {"type": "string", "description": "Travel date YYYY-MM-DD"},
            "return_date": {"type": "string", "description": "Return date YYYY-MM-DD (for round_trip)"},
            "trip_type": {"type": "string", "enum": ["one_way", "round_trip"], "default": "one_way"},
            "seat_type": {"type": "string", "enum": ["economy", "premium_economy", "business", "first"], "default": "economy"},
            "max_stops": {"type": "string", "enum": ["any", "nonstop", "1", "2"], "default": "any"},
            "airlines": {"type": "array", "items": {"type": "string"}, "description": "Filter by airline IATA codes"},
            "max_price": {"type": "number", "description": "Maximum price"},
            "top_n": {"type": "integer", "default": 5, "description": "Number of results to return"},
        },
        "required": ["origin", "destination", "date"],
    },
)
async def search_flights_tool(args: dict[str, Any]) -> dict[str, Any]:
    route = f"{args['origin']}→{args['destination']}"
    ret = f" / return {args['return_date']}" if args.get("return_date") else ""
    _log(f"🔍 search_flights: {route} {args['date']}{ret}")
    try:
        trip_type = _TRIP_MAP.get(args.get("trip_type", "one_way"), TripType.ONE_WAY)
        segments = _build_segments(
            args["origin"], args["destination"], args["date"],
            args.get("return_date"),
        )

        filters = FlightSearchFilters(
            trip_type=trip_type,
            passenger_info=PassengerInfo(adults=1),
            flight_segments=segments,
            seat_type=_SEAT_MAP.get(args.get("seat_type", "economy"), SeatType.ECONOMY),
            stops=_STOPS_MAP.get(args.get("max_stops", "any"), MaxStops.ANY),
            sort_by=SortBy.CHEAPEST,
        )

        if args.get("airlines"):
            filters.airlines = _resolve_airlines(args["airlines"])
        if args.get("max_price"):
            filters.price_limit = PriceLimit(max_price=int(args["max_price"]))

        search = SearchFlights()
        results = search.search(filters, top_n=args.get("top_n", 5))

        if not results:
            _log(f"  ✗ search_flights: {route} — no results")
            return {"content": [{"type": "text", "text": "No flights found for this route and date."}]}

        formatted = []
        for r in results:
            if isinstance(r, tuple):
                formatted.append([_format_flight_result(leg) for leg in r])
            else:
                formatted.append(_format_flight_result(r))

        prices = [f["price"] if isinstance(f, dict) else f[0]["price"] for f in formatted]
        _log(f"  ✓ search_flights: {route} — {len(formatted)} results, {min(prices):.0f}–{max(prices):.0f}")

        import json
        return {"content": [{"type": "text", "text": json.dumps(formatted, ensure_ascii=False, indent=2)}]}

    except KeyError as e:
        _log(f"  ✗ search_flights: {route} — unknown code: {e}")
        return {"content": [{"type": "text", "text": f"Unknown airport or airline code: {e}"}], "is_error": True}
    except Exception as e:
        _log(f"  ✗ search_flights: {route} — error: {e}")
        return {"content": [{"type": "text", "text": f"Search error: {e}"}], "is_error": True}


@tool(
    "search_dates",
    "Find the cheapest dates to fly a specific route within a date range. Great for finding the best time to travel.",
    {
        "type": "object",
        "properties": {
            "origin": {"type": "string", "description": "Origin airport IATA code"},
            "destination": {"type": "string", "description": "Destination airport IATA code"},
            "from_date": {"type": "string", "description": "Start of date range YYYY-MM-DD"},
            "to_date": {"type": "string", "description": "End of date range YYYY-MM-DD"},
            "trip_type": {"type": "string", "enum": ["one_way", "round_trip"], "default": "one_way"},
            "duration_days": {"type": "integer", "description": "Trip duration in days (required for round_trip)"},
            "seat_type": {"type": "string", "enum": ["economy", "premium_economy", "business", "first"], "default": "economy"},
            "max_stops": {"type": "string", "enum": ["any", "nonstop", "1", "2"], "default": "any"},
            "max_price": {"type": "number", "description": "Maximum price filter"},
        },
        "required": ["origin", "destination", "from_date", "to_date"],
    },
)
async def search_dates_tool(args: dict[str, Any]) -> dict[str, Any]:
    route = f"{args['origin']}→{args['destination']}"
    dur = f", {args['duration_days']}d" if args.get("duration_days") else ""
    _log(f"🔍 search_dates: {route} {args['from_date']}..{args['to_date']} ({args.get('trip_type', 'one_way')}{dur})")
    try:
        trip_type = _TRIP_MAP.get(args.get("trip_type", "one_way"), TripType.ONE_WAY)
        segments = _build_segments(
            args["origin"], args["destination"], args["from_date"],
            args["to_date"] if trip_type == TripType.ROUND_TRIP else None,
        )

        kwargs: dict[str, Any] = {
            "trip_type": trip_type,
            "passenger_info": PassengerInfo(adults=1),
            "flight_segments": segments,
            "seat_type": _SEAT_MAP.get(args.get("seat_type", "economy"), SeatType.ECONOMY),
            "stops": _STOPS_MAP.get(args.get("max_stops", "any"), MaxStops.ANY),
            "from_date": args["from_date"],
            "to_date": args["to_date"],
        }
        if trip_type == TripType.ROUND_TRIP and args.get("duration_days"):
            kwargs["duration"] = args["duration_days"]
        if args.get("max_price"):
            kwargs["price_limit"] = PriceLimit(max_price=int(args["max_price"]))

        filters = DateSearchFilters(**kwargs)
        search = SearchDates()
        results = search.search(filters)

        if not results:
            _log(f"  ✗ search_dates: {route} — no results")
            return {"content": [{"type": "text", "text": "No prices found for this route and date range."}]}

        formatted = []
        for dp in sorted(results, key=lambda x: x.price):
            dates = [d.isoformat() if hasattr(d, "isoformat") else str(d) for d in dp.date]
            formatted.append({
                "date": dates[0] if len(dates) == 1 else dates,
                "price": dp.price,
                "currency": dp.currency,
            })

        prices = [f["price"] for f in formatted]
        _log(f"  ✓ search_dates: {route} — {len(formatted)} dates, min {min(prices):.0f}, max {max(prices):.0f}")

        import json
        return {"content": [{"type": "text", "text": json.dumps(formatted, ensure_ascii=False, indent=2)}]}

    except KeyError as e:
        _log(f"  ✗ search_dates: {route} — unknown code: {e}")
        return {"content": [{"type": "text", "text": f"Unknown airport code: {e}"}], "is_error": True}
    except Exception as e:
        _log(f"  ✗ search_dates: {route} — error: {e}")
        return {"content": [{"type": "text", "text": f"Date search error: {e}"}], "is_error": True}
