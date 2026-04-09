# flts - AI Flight Search Agent

An AI-powered flight search agent that finds cheap flights through natural language queries. Powered by Claude Agent SDK and Google Flights API.

Ask it "find cheap round-trip flights from Helsinki or Stockholm to Bangkok, max 1 stop, ~30 days in early November" - it scans routes, compares dates, and presents the best options with prices, airlines, and direct links to Google Flights.

## What it does

- **Conversational search** - describe what you want in plain language, the agent figures out the rest
- **Multi-route comparison** - scans multiple origin airports and date ranges in parallel
- **Price monitoring** - set up watches on routes, get Telegram alerts when prices drop below your threshold
- **Memory** - remembers your preferences (home airport, favorite routes, budget) and past search results across sessions
- **Three interfaces** - web UI with real-time streaming, Telegram bot, CLI

## How it works

The agent has 13 tools at its disposal and decides which ones to use based on your query:

| Tool | Purpose |
|------|---------|
| `search_flights` | Search specific route + date via Google Flights |
| `search_dates` | Find cheapest dates in a range |
| `resolve_airport` | City name to IATA code |
| `get_destinations` | Curated destinations by category |
| `read_skill` / `update_skill` | Load and update search strategies + user preferences |
| `read_journal` / `write_journal` | Search history and price trends |
| `add_watch` / `remove_watch` / `list_watches` | Price monitoring management |
| `get_price_history` | Historical price data |
| `send_telegram` | Push notifications |

For a "find cheap flights anywhere warm" query, the agent:
1. Reads your preferences from the skill file
2. Gets candidate destinations by category
3. Runs date searches across 10-15 routes
4. Fetches detailed flight info for the best options
5. Logs everything to the journal for future reference
6. Presents results with Google Flights links

## Tech stack

**Agent framework**
- [Claude Agent SDK](https://github.com/anthropics/claude-agent-sdk-python) - orchestrates the agent loop, tool execution, session management
- No API key needed - uses local Claude Code OAuth authentication

**Flight data**
- [fli](https://github.com/punitarani/fli) (`pip install flights`) - reverse-engineered Google Flights API, direct access without browser automation

**Web UI**
- [FastAPI](https://fastapi.tiangolo.com/) + [SSE-Starlette](https://github.com/sysid/sse-starlette) - backend with Server-Sent Events for real-time streaming
- [Lit](https://lit.dev/) 3.x - web components for the frontend
- [Vite](https://vitejs.dev/) - build tooling
- [marked](https://marked.js.org/) - markdown rendering for agent responses (tables, links, formatting)

**Telegram**
- [python-telegram-bot](https://python-telegram-bot.org/) - webhook-based bot for queries and monitoring alerts

**Storage**
- SQLite - price watches and history
- Markdown skill file - agent strategies and user preferences
- JSONL journal - search log with price trends

**CLI**
- [Click](https://click.palletsprojects.com/) - `flts chat`, `flts serve`, `flts monitor`, `flts watches`, `flts history`

## Architecture

```
Web Browser ---HTTP/SSE---> FastAPI Server ---query()---> Claude Agent SDK
Telegram    ---webhook--->       |                         13 MCP Tools
CLI         ---stdin----->       |                              |
                                 |                    Google Flights / SQLite
                           Serves Lit SPA             Skill / Journal

Monitor daemon (separate process) ---> fli library ---> Telegram alerts
```

Two processes: `flts serve` (web + telegram + agent) and `flts monitor` (background price checker).

## Prerequisites

- Python 3.12+
- [uv](https://docs.astral.sh/uv/) package manager
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed and authenticated (the agent uses your local OAuth session — no API key needed)

## Setup

```bash
git clone https://github.com/lihachev/flts.git
cd flts
uv sync
```

For Telegram notifications (optional):

```bash
cp .env.example .env
# edit .env — add your TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID
# add TELEGRAM_WEBHOOK_SECRET if exposing the webhook publicly
```

## Running

```bash
flts chat               # interactive flight search in terminal
flts chat "cheap flights from Helsinki to Bangkok in November"  # one-shot query
flts serve              # web UI at localhost:8000
flts monitor            # background price monitoring daemon
flts watches            # list active price watches
flts history HEL BKK    # price history for a route
```

## Data storage

All user data lives in `~/.flts/`:

| File | Purpose |
|------|---------|
| `flts.db` | SQLite — price watches and history |
| `skill.md` | Agent preferences and search strategies (created on first run) |
| `journal.jsonl` | Search log with price trends |

Nothing is stored inside the project directory.

## Security notes

This is a **single-user tool** designed to run locally.

- **Web UI** has no authentication. `flts serve` binds to `127.0.0.1` by default — do not expose it to the internet without adding auth middleware
- **Telegram bot** only responds to the `TELEGRAM_CHAT_ID` configured in `.env`. Set `TELEGRAM_WEBHOOK_SECRET` if exposing the webhook endpoint publicly
- **Claude API costs** — each chat session runs a full Claude agent loop. Unauthenticated access to `/api/chat` or the Telegram bot would consume your tokens

## Disclaimer

This project uses the [fli](https://github.com/punitarani/fli) library which accesses Google Flights data through an unofficial API. This is not affiliated with or endorsed by Google. Use at your own risk and be aware of Google's Terms of Service. The flight data may be incomplete or inaccurate.
