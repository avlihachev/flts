# Web UI + Telegram Bot — Design Spec

## Context

The flight search agent (flts) works well via CLI but has two UX problems: (1) markdown tables don't render in terminals or Telegram, (2) there's no way to interact with the agent from a phone. Adding a web UI solves rendering, and a Telegram bot enables mobile access and monitoring alerts.

## Overview

Two new interfaces for the existing agent: a web chat UI with SSE streaming and a Telegram bot that accepts search queries and sends monitoring alerts. Both connect to the same FastAPI backend which calls the Claude Agent SDK.

## Architecture

**Two separate processes:**
- `flts serve` — FastAPI server (web UI + Telegram webhook + agent)
- `flts monitor` — price monitoring daemon (existing, unchanged)

```
Web Browser ──HTTP/SSE──→ FastAPI Server ──query()──→ Claude Agent SDK + 13 Tools
Telegram    ──webhook───→     ↑                              ↓
CLI (existing) ─────────→     │               Google Flights / SQLite / Skill / Journal
                              │
                         Serves static frontend (Lit SPA)
```

Monitor daemon runs independently, sends Telegram alerts directly via python-telegram-bot.

## Web UI

### Backend (FastAPI)

New file: `src/flts/web/server.py`

**Endpoints:**
- `GET /` — serves the Lit SPA (static files from `web/frontend/dist/`)
- `POST /api/chat` — submit a query, returns `session_id`
- `GET /api/chat/stream/{session_id}` — SSE stream of agent progress and response
- `GET /api/watches` — list active watches
- `DELETE /api/watches/{id}` — remove a watch
- `GET /api/history/{origin}/{destination}` — price history

**SSE event types:**
- `event: log` — tool execution log line (e.g. "🔍 search_dates: HEL→BKK...")
- `event: text` — Claude text response chunk
- `event: tool` — tool name being called
- `event: done` — query completed, includes cost/turns metadata

**Agent integration:** The server imports `create_flts_server()` and calls `claude_agent_sdk.query()` with a `stderr` callback that captures tool logs and pushes them to the SSE stream via asyncio.Queue.

### Frontend (Lit)

New directory: `src/flts/web/frontend/`

**Tech:** Lit 3.x web components, Vite build, dark theme.

**Components:**
- `chat-page` — main page with message list and input
- `message-bubble` — user message (right-aligned) or agent response (left-aligned, renders markdown to HTML)
- `tool-log` — collapsible monospace block showing tool execution progress
- `search-input` — text input with submit button

**Markdown rendering:** Use a lightweight library (marked or markdown-it) to convert agent's markdown response to HTML. Tables, bold, lists, code blocks.

**SSE client:** EventSource connects to `/api/chat/stream/{session_id}`. On `log` events — append to tool-log block. On `text` events — append to message bubble. On `done` — finalize.

## Telegram Bot

New file: `src/flts/web/telegram_handler.py`

**Mode:** Webhook (FastAPI route `/api/telegram/webhook`)

**Capabilities:**
- Text messages → run agent query → send compact text result (no tables, plain text summary)
- `/watches` command → list active price watches
- `/stop N` command → remove watch #N
- Monitoring alerts from daemon arrive as before (direct send via python-telegram-bot)

**Result formatting for Telegram:** Agent's full markdown response is too verbose for Telegram. The handler extracts key data and formats a compact message:
```
✈️ ARN → BKK, ~30 дней
🥇 20 апр → 20 мая: €672/чел (Qatar, Доха 2ч)
🥈 4 мая → 3 июн: €675/чел (Emirates, Дубай)
🥉 11 мая → 10 июн: €672/чел (Qatar, Доха 2ч)
💰 За двоих: от €1 344
```

**Bot registration:** Telegram bot token from `.env`, webhook URL set on startup via `bot.set_webhook()`. For local development, use ngrok or similar.

## Project Structure Changes

```
src/flts/
├── web/
│   ├── __init__.py
│   ├── server.py            # FastAPI app, SSE streaming, API endpoints
│   ├── telegram_handler.py  # Telegram webhook handler, message formatting
│   └── frontend/
│       ├── package.json     # Lit, Vite, marked
│       ├── vite.config.ts
│       ├── index.html
│       └── src/
│           ├── index.ts
│           ├── components/
│           │   ├── chat-page.ts
│           │   ├── message-bubble.ts
│           │   ├── tool-log.ts
│           │   └── search-input.ts
│           └── styles/
│               └── theme.css
├── cli.py                   # add 'serve' command
└── ... (existing)
```

## New Dependencies

**Python:** `fastapi`, `uvicorn`, `sse-starlette`
**Frontend:** `lit`, `vite`, `marked` (or `markdown-it`)

## CLI Changes

Add `flts serve` command:
```bash
flts serve              # start web server on localhost:8000
flts serve --port 3000  # custom port
```

## Verification Plan

1. `flts serve` starts, opens http://localhost:8000 — shows chat UI
2. Type a query in web UI — see tool logs streaming in real-time, then rendered table
3. Send a message to Telegram bot — receive compact text result
4. `/watches` in Telegram — lists active watches
5. Monitor daemon sends alert — appears in Telegram as before
6. Multi-turn conversation in web UI — session persists
