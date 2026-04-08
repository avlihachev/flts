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
