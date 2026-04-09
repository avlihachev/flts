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
      background: var(--bg-base);
    }

    header {
      padding: 14px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid var(--border);
      background: var(--bg-primary);
      backdrop-filter: blur(12px);
      position: relative;
      z-index: 10;
    }

    .logo-icon {
      width: 28px;
      height: 28px;
      color: var(--amber);
    }

    .logo-text {
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text-secondary);
    }

    .logo-text span {
      color: var(--text-primary);
    }

    .new-chat-btn {
      margin-left: auto;
      background: none;
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-family: var(--font-body);
      font-size: 13px;
      padding: 6px 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .new-chat-btn:hover {
      border-color: var(--amber-dim);
      color: var(--text-primary);
    }

    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 24px 24px 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      color: var(--text-muted);
    }

    .empty-icon {
      width: 48px;
      height: 48px;
      color: var(--bg-tertiary);
    }

    .empty-text {
      font-size: 14px;
      max-width: 320px;
      text-align: center;
      line-height: 1.6;
    }

    .input-area {
      padding: 16px 24px 20px;
      background: var(--bg-primary);
      border-top: 1px solid var(--border);
    }

    .input-row {
      display: flex;
      gap: 10px;
      align-items: center;
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      padding: 4px 4px 4px 16px;
      transition: border-color 0.2s;
    }

    .input-row:focus-within {
      border-color: var(--amber-dim);
      box-shadow: var(--shadow-glow);
    }

    input {
      flex: 1;
      background: none;
      border: none;
      color: var(--text-primary);
      font-family: var(--font-body);
      font-size: 14px;
      font-weight: 400;
      outline: none;
      padding: 10px 0;
    }

    input::placeholder {
      color: var(--text-muted);
    }

    .send-btn {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      background: var(--amber);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .send-btn:hover { background: var(--amber-dim); transform: scale(1.05); }
    .send-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }
    .send-btn svg { width: 18px; height: 18px; color: var(--bg-base); }

    .loading-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      color: var(--text-muted);
      font-size: 13px;
    }

    .loading-dot {
      width: 4px; height: 4px;
      border-radius: 50%;
      background: var(--amber-dim);
      animation: pulse 1.4s infinite;
    }
    .loading-dot:nth-child(2) { animation-delay: 0.2s; }
    .loading-dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes pulse {
      0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
      40% { opacity: 1; transform: scale(1.2); }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .msg-enter {
      animation: fadeInUp 0.3s ease-out;
    }
  `;

  private handleNewChat() {
    this.chatId = undefined;
    this.messages = [];
    this.loading = false;
  }

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
    const planeIcon = html`<svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`;
    const sendIcon = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
    const emptyIcon = html`<svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`;

    return html`
      <header>
        ${planeIcon}
        <div class="logo-text"><span>flts</span> / flight search</div>
        ${this.messages.length > 0
          ? html`<button class="new-chat-btn" @click=${this.handleNewChat}>New chat</button>`
          : ""}
      </header>

      <div class="messages">
        ${this.messages.length === 0
          ? html`
            <div class="empty-state">
              ${emptyIcon}
              <div class="empty-text">
                Search for cheap flights by typing a query below.
                Try: "Cheap flights from Helsinki to Bangkok in June"
              </div>
            </div>`
          : this.messages.map(
              (m) => html`
                <div class="msg-enter">
                  ${m.logs.length
                    ? html`<tool-log .lines=${m.logs}></tool-log>`
                    : ""}
                  <message-bubble
                    role=${m.role}
                    .content=${m.content}
                  ></message-bubble>
                </div>
              `
            )}
        ${this.loading
          ? html`<div class="loading-indicator">
              <div class="loading-dot"></div>
              <div class="loading-dot"></div>
              <div class="loading-dot"></div>
            </div>`
          : ""}
      </div>

      <div class="input-area">
        <div class="input-row">
          <input
            .value=${this.inputValue}
            @input=${(e: Event) => (this.inputValue = (e.target as HTMLInputElement).value)}
            @keydown=${this.handleKeyDown}
            placeholder="Where do you want to fly?"
            ?disabled=${this.loading}
          />
          <button class="send-btn" @click=${this.handleSubmit} ?disabled=${this.loading}>
            ${sendIcon}
          </button>
        </div>
      </div>
    `;
  }
}
