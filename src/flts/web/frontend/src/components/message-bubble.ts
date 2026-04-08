import { LitElement, html, css } from "lit";
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
