import asyncio
import json
import uuid
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

from flts.db.models import (
    get_connection,
    get_price_history,
    list_watches,
    remove_watch,
)
from flts.web.agent_runner import AgentEvent, run_agent_query

load_dotenv()

app = FastAPI(title="flts")

FRONTEND_DIR = Path(__file__).parent / "frontend" / "dist"

# in-memory session store
_sessions: dict[str, str | None] = {}  # chat_id -> agent session_id
_queues: dict[str, asyncio.Queue[AgentEvent]] = {}


class ChatRequest(BaseModel):
    prompt: str
    chat_id: str | None = None


@app.post("/api/chat")
async def chat(req: ChatRequest):
    chat_id = req.chat_id or str(uuid.uuid4())
    queue: asyncio.Queue[AgentEvent] = asyncio.Queue()
    _queues[chat_id] = queue

    agent_session = _sessions.get(chat_id)

    async def _run():
        sid = await run_agent_query(req.prompt, queue, session_id=agent_session)
        _sessions[chat_id] = sid

    asyncio.create_task(_run())
    return {"chat_id": chat_id}


@app.get("/api/chat/stream/{chat_id}")
async def chat_stream(chat_id: str):
    queue = _queues.get(chat_id)
    if not queue:
        return HTMLResponse("Unknown chat_id", status_code=404)

    async def event_generator():
        while True:
            event = await queue.get()
            payload = {"data": event.data}
            if event.metadata:
                payload["data"] = json.dumps(
                    {"text": event.data, **event.metadata}, ensure_ascii=False
                )
            yield {"event": event.type, **payload}
            if event.type == "done":
                _queues.pop(chat_id, None)
                break

    return EventSourceResponse(event_generator())


@app.get("/api/watches")
async def api_watches():
    conn = get_connection()
    result = list_watches(conn)
    conn.close()
    return result


@app.delete("/api/watches/{watch_id}")
async def api_remove_watch(watch_id: int):
    conn = get_connection()
    removed = remove_watch(conn, watch_id)
    conn.close()
    return {"removed": removed}


@app.get("/api/history/{origin}/{destination}")
async def api_history(origin: str, destination: str, days: int = 30):
    conn = get_connection()
    result = get_price_history(conn, origin.upper(), destination.upper(), days_back=days)
    conn.close()
    return result


# serve frontend (must be last)
if FRONTEND_DIR.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")
