import asyncio
import os
import re

from telegram import Bot, Update
from telegram.request import HTTPXRequest

from flts.db.models import get_connection, list_watches, remove_watch
from flts.web.agent_runner import AgentEvent, run_agent_query

_chat_sessions: dict[int, str] = {}  # telegram chat_id -> agent session_id


def _make_bot(token: str) -> Bot:
    return Bot(token, request=HTTPXRequest(read_timeout=60, write_timeout=60, connect_timeout=30))


def _md_to_html(text: str) -> str:
    """Convert agent markdown to Telegram HTML."""
    from html import escape

    # extract markdown links before escaping
    link_re = re.compile(r"\[([^\]]+)\]\((https?://[^\)]+)\)")
    parts = []
    last = 0
    for m in link_re.finditer(text):
        parts.append(escape(text[last:m.start()]))
        parts.append(f'<a href="{escape(m.group(2))}">{escape(m.group(1))}</a>')
        last = m.end()
    parts.append(escape(text[last:]))
    result = "".join(parts)

    # bold: *text* or **text** → <b>text</b>
    result = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", result)
    result = re.sub(r"\*(.+?)\*", r"<b>\1</b>", result)
    return result


def _format_compact(events: list[AgentEvent]) -> str:
    """Extract text events and return a compact Telegram HTML message."""
    texts = [e.data for e in events if e.type == "text" and e.data.strip()]
    full = "\n".join(texts)

    # strip markdown tables — they don't render in Telegram
    lines = []
    for line in full.split("\n"):
        if line.strip().startswith("|") and "|" in line[1:]:
            continue
        if line.strip().startswith("|-") or line.strip().startswith("| -"):
            continue
        # strip markdown headers
        line = re.sub(r"^#{1,3}\s+", "", line)
        lines.append(line)

    result = "\n".join(lines).strip()
    # collapse multiple blank lines
    result = re.sub(r"\n{3,}", "\n\n", result)
    # convert to HTML
    result = _md_to_html(result)
    # trim to 4000 chars (Telegram limit is 4096)
    if len(result) > 4000:
        result = result[:4000] + "\n..."
    return result


async def handle_telegram_message(update_data: dict) -> None:
    """Process an incoming Telegram webhook update."""
    token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    if not token:
        return

    update = Update.de_json(update_data, _make_bot(token))
    if not update or not update.message or not update.message.text:
        return

    text = update.message.text.strip()
    chat_id = update.message.chat_id
    bot = _make_bot(token)

    # only allow the configured chat
    allowed = os.environ.get("TELEGRAM_CHAT_ID", "")
    if allowed and str(chat_id) != allowed:
        return

    # handle commands
    if text == "/watches":
        conn = get_connection()
        active = list_watches(conn)
        conn.close()
        if not active:
            await bot.send_message(chat_id, "No active watches.")
            return
        lines = []
        for w in active:
            price_info = f" (last: {w['last_price']})" if w["last_price"] else ""
            lines.append(
                f"#{w['id']} {w['origin']}→{w['destination']} "
                f"≤{w['max_price']} {w['currency']}{price_info}"
            )
        await bot.send_message(chat_id, "\n".join(lines))
        return

    if text == "/new":
        _chat_sessions.pop(chat_id, None)
        await bot.send_message(chat_id, "Начинаю новую беседу.")
        return

    if text.startswith("/stop"):
        parts = text.split()
        if len(parts) == 2 and parts[1].isdigit():
            conn = get_connection()
            removed = remove_watch(conn, int(parts[1]))
            conn.close()
            msg = f"Watch #{parts[1]} removed." if removed else f"Watch #{parts[1]} not found."
            await bot.send_message(chat_id, msg)
        else:
            await bot.send_message(chat_id, "Usage: /stop <watch_id>")
        return

    # run agent search
    await bot.send_message(chat_id, "🔍 Ищу...")

    queue: asyncio.Queue[AgentEvent] = asyncio.Queue()
    collected: list[AgentEvent] = []

    session_id = _chat_sessions.get(chat_id)
    new_session_id = await run_agent_query(text, queue, session_id=session_id)
    if new_session_id:
        _chat_sessions[chat_id] = new_session_id

    while True:
        event = await queue.get()
        collected.append(event)
        if event.type == "done":
            break

    result = _format_compact(collected)
    if not result:
        result = "Не удалось получить результат."

    await bot.send_message(chat_id, result, parse_mode="HTML")
