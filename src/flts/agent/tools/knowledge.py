import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from claude_agent_sdk import tool


def _log(msg: str) -> None:
    print(msg, file=sys.stderr, flush=True)

TEMPLATE_DIR = Path(__file__).parent.parent.parent / "data"
FLTS_DIR = Path.home() / ".flts"
SKILL_PATH = FLTS_DIR / "skill.md"
JOURNAL_PATH = FLTS_DIR / "journal.jsonl"


def _ensure_skill():
    """copy template skill on first run if user has no skill file yet"""
    FLTS_DIR.mkdir(parents=True, exist_ok=True)
    if not SKILL_PATH.exists():
        template = TEMPLATE_DIR / "skill.md.example"
        if template.exists():
            SKILL_PATH.write_text(template.read_text())


@tool(
    "read_skill",
    "Read the flight search skill file containing search strategies and user preferences. Call this at the start of each session to understand how to search and what the user prefers.",
    {"type": "object", "properties": {}},
)
async def read_skill_tool(args: dict[str, Any]) -> dict[str, Any]:
    _log("📖 read_skill")
    _ensure_skill()
    try:
        content = SKILL_PATH.read_text()
        _log(f"  ✓ read_skill: {len(content)} chars loaded")
        return {"content": [{"type": "text", "text": content}]}
    except FileNotFoundError:
        _log("  ✗ read_skill: file not found")
        return {"content": [{"type": "text", "text": "Skill file not found. Using defaults."}]}


@tool(
    "update_skill",
    "Update a section in the skill file (e.g. user preferences, known routes). Use this when you learn new preferences or discover good routes.",
    {
        "type": "object",
        "properties": {
            "section": {
                "type": "string",
                "description": "Section header to update (e.g. 'User Preferences', 'Known Good Routes')",
            },
            "content": {
                "type": "string",
                "description": "New content for the section (markdown formatted)",
            },
        },
        "required": ["section", "content"],
    },
)
async def update_skill_tool(args: dict[str, Any]) -> dict[str, Any]:
    _log(f"📝 update_skill: section '{args['section']}'")
    _ensure_skill()
    section = args["section"]
    new_content = args["content"]

    try:
        text = SKILL_PATH.read_text()
    except FileNotFoundError:
        text = "# Flight Search Skill\n"

    header_pattern = re.compile(
        rf"(## {re.escape(section)}\n)(.*?)(?=\n## |\Z)",
        re.DOTALL,
    )

    match = header_pattern.search(text)
    if match:
        text = text[:match.start(2)] + new_content + "\n" + text[match.end(2):]
    else:
        text = text.rstrip() + f"\n\n## {section}\n{new_content}\n"

    SKILL_PATH.write_text(text)
    _log(f"  ✓ update_skill: section '{section}' updated")
    return {"content": [{"type": "text", "text": f"Updated section '{section}' in skill file."}]}


@tool(
    "read_journal",
    "Read the search journal to see past searches, found prices, and recommendations. Use this to compare current prices with historical data.",
    {
        "type": "object",
        "properties": {
            "route": {
                "type": "string",
                "description": "Filter by route (e.g. 'HEL-BKK'). Optional.",
            },
            "limit": {
                "type": "integer",
                "default": 20,
                "description": "Max entries to return",
            },
        },
    },
)
async def read_journal_tool(args: dict[str, Any]) -> dict[str, Any]:
    route_info = f" route={args['route']}" if args.get("route") else ""
    _log(f"📖 read_journal{route_info}")
    if not JOURNAL_PATH.exists():
        return {"content": [{"type": "text", "text": "Journal is empty. No past searches recorded."}]}

    route_filter = args.get("route")
    limit = args.get("limit", 20)
    entries = []

    for line in JOURNAL_PATH.read_text().strip().split("\n"):
        if not line.strip():
            continue
        try:
            entry = json.loads(line)
            if route_filter and entry.get("route") != route_filter:
                continue
            entries.append(entry)
        except json.JSONDecodeError:
            continue

    entries = entries[-limit:]
    if not entries:
        msg = f"No journal entries found"
        if route_filter:
            msg += f" for route {route_filter}"
        return {"content": [{"type": "text", "text": msg}]}

    _log(f"  ✓ read_journal: {len(entries)} entries")
    return {"content": [{"type": "text", "text": json.dumps(entries, ensure_ascii=False, indent=2)}]}


@tool(
    "write_journal",
    "Record a search result or event in the journal. Call this after completing a search to build up price history and recommendations.",
    {
        "type": "object",
        "properties": {
            "route": {"type": "string", "description": "Route (e.g. 'HEL-BKK')"},
            "type": {
                "type": "string",
                "enum": ["search", "monitor_alert", "note"],
                "description": "Entry type",
            },
            "dates_searched": {"type": "string", "description": "Date range searched"},
            "results_summary": {"type": "string", "description": "Summary of found prices and options"},
            "recommendation": {"type": "string", "description": "Your recommendation based on the results"},
        },
        "required": ["route", "type"],
    },
)
async def write_journal_tool(args: dict[str, Any]) -> dict[str, Any]:
    _log(f"📝 write_journal: {args['route']} ({args['type']})")
    JOURNAL_PATH.parent.mkdir(parents=True, exist_ok=True)

    entry = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "type": args["type"],
        "route": args["route"],
    }
    if args.get("dates_searched"):
        entry["dates_searched"] = args["dates_searched"]
    if args.get("results_summary"):
        entry["results_summary"] = args["results_summary"]
    if args.get("recommendation"):
        entry["recommendation"] = args["recommendation"]

    with open(JOURNAL_PATH, "a") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")

    return {"content": [{"type": "text", "text": "Journal entry recorded."}]}
