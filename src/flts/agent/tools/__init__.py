from claude_agent_sdk import create_sdk_mcp_server

from .airports import get_destinations_tool, resolve_airport_tool
from .history import get_price_history_tool
from .knowledge import (
    read_journal_tool,
    read_skill_tool,
    update_skill_tool,
    write_journal_tool,
)
from .search import search_dates_tool, search_flights_tool
from .telegram import send_telegram_tool
from .watches import add_watch_tool, list_watches_tool, remove_watch_tool

ALL_TOOLS = [
    search_flights_tool,
    search_dates_tool,
    resolve_airport_tool,
    get_destinations_tool,
    read_skill_tool,
    update_skill_tool,
    read_journal_tool,
    write_journal_tool,
    add_watch_tool,
    remove_watch_tool,
    list_watches_tool,
    get_price_history_tool,
    send_telegram_tool,
]


def create_flts_server():
    return create_sdk_mcp_server(
        name="flts",
        version="0.1.0",
        tools=ALL_TOOLS,
    )
