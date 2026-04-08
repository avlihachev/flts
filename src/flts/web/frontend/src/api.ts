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
