import json
from typing import Any

from claude_agent_sdk import tool

from flts.db.models import (
    create_watch,
    get_connection,
    list_watches as db_list_watches,
    remove_watch as db_remove_watch,
)


@tool(
    "add_watch",
    "Add a route to price monitoring. The monitoring daemon will periodically check prices and send a Telegram alert when the price drops below the threshold.",
    {
        "type": "object",
        "properties": {
            "origin": {"type": "string", "description": "Origin airport IATA code"},
            "destination": {"type": "string", "description": "Destination airport IATA code"},
            "from_date": {"type": "string", "description": "Start of travel date range YYYY-MM-DD"},
            "to_date": {"type": "string", "description": "End of travel date range YYYY-MM-DD"},
            "max_price": {"type": "number", "description": "Alert when price is at or below this value"},
            "currency": {"type": "string", "default": "EUR", "description": "Currency (EUR or USD)"},
            "trip_type": {"type": "string", "enum": ["one_way", "round_trip"], "default": "one_way"},
            "duration_days": {"type": "integer", "description": "Trip duration in days (for round_trip)"},
            "check_interval_hours": {"type": "integer", "default": 6, "description": "How often to check (hours)"},
        },
        "required": ["origin", "destination", "from_date", "to_date", "max_price"],
    },
)
async def add_watch_tool(args: dict[str, Any]) -> dict[str, Any]:
    try:
        conn = get_connection()
        watch_id = create_watch(
            conn,
            origin=args["origin"].upper(),
            destination=args["destination"].upper(),
            from_date=args["from_date"],
            to_date=args["to_date"],
            max_price=args["max_price"],
            currency=args.get("currency", "EUR"),
            trip_type=args.get("trip_type", "one_way"),
            duration_days=args.get("duration_days"),
            check_interval_hours=args.get("check_interval_hours", 6),
        )
        conn.close()
        return {"content": [{"type": "text", "text": f"Watch #{watch_id} created. Monitoring {args['origin']}→{args['destination']} for prices ≤{args['max_price']} {args.get('currency', 'EUR')}."}]}
    except Exception as e:
        return {"content": [{"type": "text", "text": f"Failed to create watch: {e}"}], "is_error": True}


@tool(
    "remove_watch",
    "Remove (deactivate) a price watch by its ID.",
    {
        "type": "object",
        "properties": {
            "watch_id": {"type": "integer", "description": "Watch ID to remove"},
        },
        "required": ["watch_id"],
    },
)
async def remove_watch_tool(args: dict[str, Any]) -> dict[str, Any]:
    conn = get_connection()
    removed = db_remove_watch(conn, args["watch_id"])
    conn.close()
    if removed:
        return {"content": [{"type": "text", "text": f"Watch #{args['watch_id']} removed."}]}
    return {"content": [{"type": "text", "text": f"Watch #{args['watch_id']} not found or already inactive."}]}


@tool(
    "list_watches",
    "Show all active price watches with their routes, thresholds, and last checked prices.",
    {"type": "object", "properties": {}},
)
async def list_watches_tool(args: dict[str, Any]) -> dict[str, Any]:
    conn = get_connection()
    watches = db_list_watches(conn)
    conn.close()

    if not watches:
        return {"content": [{"type": "text", "text": "No active watches."}]}

    return {"content": [{"type": "text", "text": json.dumps(watches, ensure_ascii=False, indent=2)}]}
