import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
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
