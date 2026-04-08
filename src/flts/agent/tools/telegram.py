import os
import sys
from typing import Any

from claude_agent_sdk import tool


def _log(msg: str) -> None:
    print(msg, file=sys.stderr, flush=True)


@tool(
    "send_telegram",
    "Send a message to the user's Telegram. Use for sharing search results or important findings directly to their phone.",
    {
        "type": "object",
        "properties": {
            "message": {
                "type": "string",
                "description": "Message text (supports Markdown formatting)",
            },
        },
        "required": ["message"],
    },
)
async def send_telegram_tool(args: dict[str, Any]) -> dict[str, Any]:
    _log(f"📨 send_telegram: {len(args['message'])} chars")
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")

    if not token or not chat_id:
        return {
            "content": [{"type": "text", "text": "Telegram not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env"}],
            "is_error": True,
        }

    try:
        from telegram import Bot

        bot = Bot(token=token)
        await bot.send_message(
            chat_id=chat_id,
            text=args["message"],
            parse_mode="Markdown",
        )
        return {"content": [{"type": "text", "text": "Message sent to Telegram."}]}
    except Exception as e:
        return {"content": [{"type": "text", "text": f"Telegram error: {e}"}], "is_error": True}
