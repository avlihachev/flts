import asyncio

from dotenv import load_dotenv

from claude_agent_sdk import (
    AssistantMessage,
    ClaudeAgentOptions,
    ResultMessage,
    TextBlock,
    ToolUseBlock,
    query,
)

from .system_prompt import SYSTEM_PROMPT
from .tools import create_flts_server


async def chat_session(initial_prompt: str | None = None):
    load_dotenv()

    server = create_flts_server()

    options = ClaudeAgentOptions(
        system_prompt=SYSTEM_PROMPT,
        mcp_servers={"flts": server},
        allowed_tools=["mcp__flts__*"],
        max_turns=50,
    )

    if initial_prompt:
        await _run_query(initial_prompt, options)
    else:
        await _interactive_loop(options)


async def _run_query(prompt: str, options: ClaudeAgentOptions):
    async for message in query(prompt=prompt, options=options):
        _print_message(message)


async def _interactive_loop(options: ClaudeAgentOptions):
    print("flts — поиск дешёвых авиабилетов")
    print("Введи запрос или 'exit' для выхода\n")

    session_id = None

    while True:
        try:
            user_input = input(">>> ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nДо свидания!")
            break

        if not user_input:
            continue
        if user_input.lower() in ("exit", "quit", "выход"):
            print("До свидания!")
            break

        opts = ClaudeAgentOptions(
            system_prompt=SYSTEM_PROMPT,
            mcp_servers={"flts": options.mcp_servers["flts"]},
            allowed_tools=["mcp__flts__*"],
            max_turns=50,
        )
        if session_id:
            opts.resume = session_id

        async for message in query(prompt=user_input, options=opts):
            if isinstance(message, ResultMessage):
                session_id = message.session_id
            _print_message(message)

        print()


def _print_message(message):
    if isinstance(message, AssistantMessage):
        for block in message.content:
            if isinstance(block, TextBlock):
                print(block.text)
            elif isinstance(block, ToolUseBlock):
                print(f"  [tool] {block.name}")
    elif isinstance(message, ResultMessage):
        if message.is_error and message.errors:
            for err in message.errors:
                print(f"Error: {err}")


def main(prompt: str | None = None):
    asyncio.run(chat_session(prompt))


if __name__ == "__main__":
    main()
