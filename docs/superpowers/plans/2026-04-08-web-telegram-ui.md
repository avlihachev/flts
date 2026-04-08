# Web UI + Telegram Bot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a web chat UI with SSE streaming and a Telegram bot for search queries and monitoring alerts, both backed by FastAPI.

**Architecture:** FastAPI server serves a Lit SPA frontend and handles Telegram webhooks. Agent queries run via `claude_agent_sdk.query()` with an asyncio.Queue bridging SSE events to the browser. Separate processes: `flts serve` (web+telegram) and `flts monitor` (existing daemon).

**Tech Stack:** FastAPI, uvicorn, sse-starlette, Lit 3.x, Vite, marked, python-telegram-bot

---

## File Structure

```
src/flts/
├── web/
│   ├── __init__.py              # empty
│   ├── server.py                # FastAPI app: static files, API, SSE, telegram webhook
│   ├── agent_runner.py          # async agent query runner with Queue-based event capture
│   ├── telegram_handler.py      # telegram message/command handlers, result formatting
│   └── frontend/
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       ├── index.html
│       └── src/
│           ├── index.ts         # entry: register components
│           ├── api.ts           # SSE client, fetch helpers
│           ├── components/
│           │   ├── chat-page.ts     # main page: message list + input
│           │   ├── message-bubble.ts # user/agent message with markdown rendering
│           │   └── tool-log.ts      # collapsible tool execution log
│           └── styles/
│               └── theme.css    # dark theme variables
├── cli.py                       # modify: add 'serve' command
└── pyproject.toml               # modify: add fastapi, uvicorn, sse-starlette deps
```

---

### Task 1: Add Python dependencies

**Files:**
- Modify: `pyproject.toml`

- [ ] **Step 1: Add FastAPI deps to pyproject.toml**

Add to the `dependencies` list in `pyproject.toml`:

```toml
    "fastapi>=0.115.0",
    "uvicorn>=0.34.0",
    "sse-starlette>=2.0",
```

- [ ] **Step 2: Sync and verify**

Run: `uv sync`
Expected: resolves and installs fastapi, uvicorn, sse-starlette

- [ ] **Step 3: Verify imports**

Run: `uv run python -c "import fastapi; import uvicorn; import sse_starlette; print('OK')"`
Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add pyproject.toml uv.lock
git commit -m "Add FastAPI, uvicorn, sse-starlette dependencies"
```

---

### Task 2: Agent runner with event queue

**Files:**
- Create: `src/flts/web/__init__.py`
- Create: `src/flts/web/agent_runner.py`
- Test: `tests/test_agent_runner.py`

This module wraps `claude_agent_sdk.query()` and emits structured events to an `asyncio.Queue` — the bridge between the agent loop and SSE/Telegram consumers.

- [ ] **Step 1: Create web package**

Create empty `src/flts/web/__init__.py`.

- [ ] **Step 2: Write agent_runner.py**

```python
import asyncio
from dataclasses import dataclass, field
from typing import Any

from dotenv import load_dotenv

from claude_agent_sdk import (
    AssistantMessage,
    ClaudeAgentOptions,
    ResultMessage,
    TextBlock,
    ToolUseBlock,
    query,
)

from flts.agent.system_prompt import SYSTEM_PROMPT
from flts.agent.tools import create_flts_server


@dataclass
class AgentEvent:
    type: str  # "log", "text", "tool", "done", "error"
    data: str = ""
    metadata: dict[str, Any] = field(default_factory=dict)


async def run_agent_query(
    prompt: str,
    event_queue: asyncio.Queue[AgentEvent],
    session_id: str | None = None,
) -> str | None:
    """Run an agent query, pushing events to the queue. Returns session_id."""
    load_dotenv()
    server = create_flts_server()

    def on_stderr(line: str) -> None:
        stripped = line.strip()
        if stripped:
            event_queue.put_nowait(AgentEvent(type="log", data=stripped))

    opts = ClaudeAgentOptions(
        system_prompt=SYSTEM_PROMPT,
        mcp_servers={"flts": server},
        allowed_tools=["mcp__flts__*"],
        max_turns=50,
        stderr=on_stderr,
    )
    if session_id:
        opts.resume = session_id

    result_session_id = None

    try:
        async for message in query(prompt=prompt, options=opts):
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        event_queue.put_nowait(AgentEvent(type="text", data=block.text))
                    elif isinstance(block, ToolUseBlock):
                        event_queue.put_nowait(AgentEvent(type="tool", data=block.name))
            elif isinstance(message, ResultMessage):
                result_session_id = message.session_id
                meta = {}
                if message.total_cost_usd:
                    meta["cost_usd"] = message.total_cost_usd
                meta["turns"] = message.num_turns
                if message.is_error and message.errors:
                    event_queue.put_nowait(
                        AgentEvent(type="error", data="; ".join(message.errors))
                    )
                event_queue.put_nowait(AgentEvent(type="done", metadata=meta))
    except Exception as e:
        event_queue.put_nowait(AgentEvent(type="error", data=str(e)))
        event_queue.put_nowait(AgentEvent(type="done"))

    return result_session_id
```

- [ ] **Step 3: Verify import**

Run: `uv run python -c "from flts.web.agent_runner import run_agent_query, AgentEvent; print('OK')"`
Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add src/flts/web/
git commit -m "Add agent runner with asyncio.Queue event bridge"
```

---

### Task 3: FastAPI server with SSE streaming

**Files:**
- Create: `src/flts/web/server.py`

- [ ] **Step 1: Write server.py**

```python
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
```

- [ ] **Step 2: Verify import**

Run: `uv run python -c "from flts.web.server import app; print(f'{len(app.routes)} routes OK')"`
Expected: prints route count and OK

- [ ] **Step 3: Commit**

```bash
git add src/flts/web/server.py
git commit -m "Add FastAPI server with SSE streaming and API endpoints"
```

---

### Task 4: Telegram webhook handler

**Files:**
- Create: `src/flts/web/telegram_handler.py`
- Modify: `src/flts/web/server.py`

- [ ] **Step 1: Write telegram_handler.py**

```python
import asyncio
import os
import re

from telegram import Bot, Update
from telegram.ext import Application

from flts.db.models import get_connection, list_watches, remove_watch
from flts.web.agent_runner import AgentEvent, run_agent_query


def _format_compact(events: list[AgentEvent]) -> str:
    """Extract text events and return a compact Telegram-friendly message."""
    texts = [e.data for e in events if e.type == "text" and e.data.strip()]
    full = "\n".join(texts)

    # strip markdown tables — they don't render in Telegram
    lines = []
    for line in full.split("\n"):
        if line.strip().startswith("|") and "|" in line[1:]:
            continue
        if line.strip().startswith("|-") or line.strip().startswith("| -"):
            continue
        lines.append(line)

    result = "\n".join(lines).strip()
    # collapse multiple blank lines
    result = re.sub(r"\n{3,}", "\n\n", result)
    # trim to 4000 chars (Telegram limit is 4096)
    if len(result) > 4000:
        result = result[:4000] + "\n..."
    return result


async def handle_telegram_message(update_data: dict) -> None:
    """Process an incoming Telegram webhook update."""
    token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    if not token:
        return

    update = Update.de_json(update_data, Bot(token))
    if not update or not update.message or not update.message.text:
        return

    text = update.message.text.strip()
    chat_id = update.message.chat_id
    bot = Bot(token)

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

    await run_agent_query(text, queue)

    while True:
        event = await queue.get()
        collected.append(event)
        if event.type == "done":
            break

    result = _format_compact(collected)
    if not result:
        result = "Не удалось получить результат."

    await bot.send_message(chat_id, result)
```

- [ ] **Step 2: Add webhook route to server.py**

Add these imports at the top of `server.py`:

```python
from fastapi import Request
from flts.web.telegram_handler import handle_telegram_message
```

Add this route before the static files mount:

```python
@app.post("/api/telegram/webhook")
async def telegram_webhook(request: Request):
    data = await request.json()
    asyncio.create_task(handle_telegram_message(data))
    return {"ok": True}
```

- [ ] **Step 3: Verify import**

Run: `uv run python -c "from flts.web.telegram_handler import handle_telegram_message; print('OK')"`
Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add src/flts/web/telegram_handler.py src/flts/web/server.py
git commit -m "Add Telegram webhook handler with compact result formatting"
```

---

### Task 5: CLI serve command

**Files:**
- Modify: `src/flts/cli.py`

- [ ] **Step 1: Add serve command to cli.py**

Add after the existing `monitor` command:

```python
@cli.command()
@click.option("--port", default=8000, help="Port to listen on")
@click.option("--host", default="127.0.0.1", help="Host to bind to")
def serve(port, host):
    """Start web server (web UI + Telegram webhook)"""
    import uvicorn
    from flts.web.server import app
    uvicorn.run(app, host=host, port=port)
```

- [ ] **Step 2: Verify**

Run: `uv run flts --help`
Expected: `serve` appears in the command list

- [ ] **Step 3: Commit**

```bash
git add src/flts/cli.py
git commit -m "Add 'flts serve' CLI command"
```

---

### Task 6: Frontend scaffold

**Files:**
- Create: `src/flts/web/frontend/package.json`
- Create: `src/flts/web/frontend/tsconfig.json`
- Create: `src/flts/web/frontend/vite.config.ts`
- Create: `src/flts/web/frontend/index.html`
- Create: `src/flts/web/frontend/src/index.ts`
- Create: `src/flts/web/frontend/src/styles/theme.css`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "flts-frontend",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "lit": "^3.2.0",
    "marked": "^15.0.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "vite": "^6.0.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "declaration": false,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create vite.config.ts**

```typescript
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
  },
});
```

- [ ] **Step 4: Create index.html**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>flts — flight search</title>
  <link rel="stylesheet" href="/src/styles/theme.css">
  <script type="module" src="/src/index.ts"></script>
</head>
<body>
  <chat-page></chat-page>
</body>
</html>
```

- [ ] **Step 5: Create theme.css**

```css
:root {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --accent: #2563eb;
  --accent-hover: #1d4ed8;
  --success: #22c55e;
  --warning: #f59e0b;
  --font-mono: 'SF Mono', 'Cascadia Code', 'Fira Code', monospace;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  height: 100vh;
  overflow: hidden;
}
```

- [ ] **Step 6: Create index.ts**

```typescript
import "./components/chat-page.js";
import "./components/message-bubble.js";
import "./components/tool-log.js";
```

- [ ] **Step 7: Install deps and verify build scaffold**

Run:
```bash
cd src/flts/web/frontend && npm install && cd -
```
Expected: `node_modules` created, no errors

- [ ] **Step 8: Commit**

```bash
git add src/flts/web/frontend/
git commit -m "Scaffold Lit frontend with Vite and dark theme"
```

---

### Task 7: Frontend api.ts (SSE client)

**Files:**
- Create: `src/flts/web/frontend/src/api.ts`

- [ ] **Step 1: Write api.ts**

```typescript
export interface ChatEvent {
  type: "log" | "text" | "tool" | "done" | "error";
  data: string;
}

export async function startChat(prompt: string, chatId?: string): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, chat_id: chatId }),
  });
  const json = await res.json();
  return json.chat_id;
}

export function streamChat(
  chatId: string,
  onEvent: (event: ChatEvent) => void,
): EventSource {
  const source = new EventSource(`/api/chat/stream/${chatId}`);

  for (const type of ["log", "text", "tool", "done", "error"] as const) {
    source.addEventListener(type, (e: MessageEvent) => {
      onEvent({ type, data: e.data });
      if (type === "done") {
        source.close();
      }
    });
  }

  source.onerror = () => {
    onEvent({ type: "error", data: "Connection lost" });
    source.close();
  };

  return source;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/flts/web/frontend/src/api.ts
git commit -m "Add SSE client for chat streaming"
```

---

### Task 8: Frontend components

**Files:**
- Create: `src/flts/web/frontend/src/components/tool-log.ts`
- Create: `src/flts/web/frontend/src/components/message-bubble.ts`
- Create: `src/flts/web/frontend/src/components/chat-page.ts`

- [ ] **Step 1: Write tool-log.ts**

```typescript
import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("tool-log")
export class ToolLog extends LitElement {
  @property({ type: Array }) lines: string[] = [];
  @state() private collapsed = false;

  static styles = css`
    :host { display: block; }
    .log {
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--text-secondary);
      background: var(--bg-secondary);
      border-left: 3px solid var(--warning);
      border-radius: 8px;
      padding: 8px 12px;
      margin: 8px 0;
      max-height: 200px;
      overflow-y: auto;
      cursor: pointer;
    }
    .log.collapsed { max-height: 24px; overflow: hidden; }
    .line { line-height: 1.6; white-space: pre-wrap; }
    .line.success { color: var(--success); }
  `;

  render() {
    return html`
      <div class="log ${this.collapsed ? "collapsed" : ""}"
           @click=${() => (this.collapsed = !this.collapsed)}>
        ${this.lines.map(
          (l) => html`<div class="line ${l.includes("✓") ? "success" : ""}">${l}</div>`
        )}
      </div>
    `;
  }
}
```

- [ ] **Step 2: Write message-bubble.ts**

```typescript
import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { marked } from "marked";

@customElement("message-bubble")
export class MessageBubble extends LitElement {
  @property() role: "user" | "agent" = "agent";
  @property() content = "";

  static styles = css`
    :host { display: block; margin-bottom: 16px; }
    .bubble {
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.6;
      max-width: 85%;
      word-wrap: break-word;
    }
    .user {
      background: #1e3a5f;
      margin-left: auto;
      border-radius: 12px 12px 0 12px;
    }
    .agent {
      background: var(--bg-secondary);
      border-radius: 12px 12px 12px 0;
    }
    .agent table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 8px 0; }
    .agent th, .agent td { padding: 6px 8px; text-align: left; border-bottom: 1px solid var(--bg-tertiary); }
    .agent th { color: var(--text-secondary); font-weight: 600; }
    .agent strong { color: var(--success); }
    .agent ul, .agent ol { padding-left: 20px; }
    .agent p { margin: 6px 0; }
    .agent h2, .agent h3 { margin: 12px 0 6px; }
  `;

  render() {
    const rendered =
      this.role === "agent" ? unsafeHTML(marked.parse(this.content) as string) : this.content;
    return html`<div class="bubble ${this.role}">${rendered}</div>`;
  }
}
```

- [ ] **Step 3: Write chat-page.ts**

```typescript
import { LitElement, html, css } from "lit";
import { customElement, state, query as litQuery } from "lit/decorators.js";
import { startChat, streamChat, ChatEvent } from "../api.js";

interface Message {
  role: "user" | "agent";
  content: string;
  logs: string[];
}

@customElement("chat-page")
export class ChatPage extends LitElement {
  @state() private messages: Message[] = [];
  @state() private loading = false;
  @state() private inputValue = "";
  private chatId: string | undefined;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: var(--bg-primary);
    }
    header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--bg-tertiary);
      font-size: 18px;
      font-weight: 600;
    }
    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }
    .input-area {
      border-top: 1px solid var(--bg-tertiary);
      padding: 12px 16px;
      display: flex;
      gap: 8px;
      background: var(--bg-secondary);
    }
    input {
      flex: 1;
      background: var(--bg-primary);
      border: 1px solid var(--bg-tertiary);
      color: var(--text-primary);
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
    }
    input:focus { border-color: var(--accent); }
    button {
      background: var(--accent);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 16px;
    }
    button:hover { background: var(--accent-hover); }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
  `;

  private async handleSubmit() {
    const prompt = this.inputValue.trim();
    if (!prompt || this.loading) return;

    this.inputValue = "";
    this.loading = true;

    this.messages = [...this.messages, { role: "user", content: prompt, logs: [] }];
    this.messages = [...this.messages, { role: "agent", content: "", logs: [] }];
    const agentIdx = this.messages.length - 1;

    this.chatId = await startChat(prompt, this.chatId);

    streamChat(this.chatId, (event: ChatEvent) => {
      const msgs = [...this.messages];
      const agent = { ...msgs[agentIdx] };

      if (event.type === "log") {
        agent.logs = [...agent.logs, event.data];
      } else if (event.type === "text") {
        agent.content += event.data + "\n";
      } else if (event.type === "done") {
        this.loading = false;
      } else if (event.type === "error") {
        agent.content += `\n**Error:** ${event.data}`;
        this.loading = false;
      }

      msgs[agentIdx] = agent;
      this.messages = msgs;
      this.scrollToBottom();
    });
  }

  private scrollToBottom() {
    requestAnimationFrame(() => {
      const el = this.shadowRoot?.querySelector(".messages");
      if (el) el.scrollTop = el.scrollHeight;
    });
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this.handleSubmit();
    }
  }

  render() {
    return html`
      <header>✈️ flts — flight search</header>
      <div class="messages">
        ${this.messages.map(
          (m) => html`
            ${m.logs.length
              ? html`<tool-log .lines=${m.logs}></tool-log>`
              : ""}
            <message-bubble
              role=${m.role}
              .content=${m.content}
            ></message-bubble>
          `
        )}
      </div>
      <div class="input-area">
        <input
          .value=${this.inputValue}
          @input=${(e: Event) => (this.inputValue = (e.target as HTMLInputElement).value)}
          @keydown=${this.handleKeyDown}
          placeholder="Введи запрос..."
          ?disabled=${this.loading}
        />
        <button @click=${this.handleSubmit} ?disabled=${this.loading}>→</button>
      </div>
    `;
  }
}
```

- [ ] **Step 4: Update index.ts to import all components**

Already done in Task 6 Step 6.

- [ ] **Step 5: Build frontend**

Run:
```bash
cd src/flts/web/frontend && npm run build && cd -
```
Expected: `dist/` directory created with `index.html` and bundled JS

- [ ] **Step 6: Commit**

```bash
git add src/flts/web/frontend/src/
git commit -m "Add Lit frontend components: chat, message bubbles, tool log"
```

---

### Task 9: Build frontend and integration test

**Files:**
- Modify: `src/flts/web/frontend/` (build output)

- [ ] **Step 1: Build frontend for production**

Run:
```bash
cd src/flts/web/frontend && npm run build && cd -
```

- [ ] **Step 2: Start server and verify web UI loads**

Run: `uv run flts serve --port 8000 &`

Then open http://localhost:8000 in browser. Expected: dark-themed chat UI with input field.

- [ ] **Step 3: Test a search query in web UI**

Type "Найди рейсы HEL→BKK в июне" in the input. Expected:
- Tool logs appear in real-time (collapsible block)
- Agent's markdown response renders as formatted HTML with tables

- [ ] **Step 4: Test Telegram webhook** (if bot configured)

Send a message to the Telegram bot. Expected: compact text result.

- [ ] **Step 5: Stop server and commit**

```bash
kill %1
git add src/flts/web/frontend/dist/
git commit -m "Build frontend and verify end-to-end integration"
```

---

### Task 10: Add frontend to .gitignore and document

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add node_modules to .gitignore**

Add to `.gitignore`:
```
node_modules/
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "Add node_modules to gitignore"
```
