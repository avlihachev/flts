import json
import sys
from pathlib import Path
from typing import Any

import yaml
from claude_agent_sdk import tool

from fli.models import Airport


def _log(msg: str) -> None:
    print(msg, file=sys.stderr, flush=True)

DATA_DIR = Path(__file__).parent.parent.parent / "data"


@tool(
    "resolve_airport",
    "Resolve a city name, country, or partial IATA code to airport IATA code(s). Use this when the user mentions a city or country name instead of an airport code.",
    {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "City name, country, or IATA code (e.g. 'Helsinki', 'Thailand', 'BKK')",
            },
        },
        "required": ["query"],
    },
)
async def resolve_airport_tool(args: dict[str, Any]) -> dict[str, Any]:
    _log(f"🔍 resolve_airport: '{args['query']}'")
    query = args["query"].strip().upper()
    matches = []

    for ap in Airport:
        code = ap.name.upper()
        name = ap.value.upper() if isinstance(ap.value, str) else ""

        if code == query:
            matches.insert(0, {"code": ap.name, "name": ap.value})
            continue

        if query in code or query in name:
            matches.append({"code": ap.name, "name": ap.value})

    if not matches:
        _log(f"  ✗ resolve_airport: no matches")
        return {"content": [{"type": "text", "text": f"No airports found for '{args['query']}'"}]}

    matches = matches[:20]
    codes = [m["code"] for m in matches[:5]]
    _log(f"  ✓ resolve_airport: {len(matches)} matches — {', '.join(codes)}")
    return {"content": [{"type": "text", "text": json.dumps(matches, ensure_ascii=False, indent=2)}]}


@tool(
    "get_destinations",
    "Get a curated list of flight destinations by category. Categories: warm_beach, europe_city, asia, nordic, budget. Returns IATA codes with names and regions.",
    {
        "type": "object",
        "properties": {
            "category": {
                "type": "string",
                "enum": ["warm_beach", "europe_city", "asia", "nordic", "budget"],
                "description": "Destination category",
            },
        },
        "required": ["category"],
    },
)
async def get_destinations_tool(args: dict[str, Any]) -> dict[str, Any]:
    _log(f"🔍 get_destinations: {args['category']}")
    yaml_path = DATA_DIR / "destinations.yaml"

    try:
        with open(yaml_path) as f:
            data = yaml.safe_load(f)
    except FileNotFoundError:
        return {"content": [{"type": "text", "text": "Destinations file not found"}], "is_error": True}

    category = args["category"]
    if category not in data:
        available = ", ".join(data.keys())
        return {"content": [{"type": "text", "text": f"Unknown category '{category}'. Available: {available}"}], "is_error": True}

    destinations = data[category]
    _log(f"  ✓ get_destinations: {len(destinations)} destinations in '{category}'")
    return {"content": [{"type": "text", "text": json.dumps(destinations, ensure_ascii=False, indent=2)}]}
