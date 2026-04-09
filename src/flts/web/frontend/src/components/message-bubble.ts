import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { marked } from "marked";
import DOMPurify from "dompurify";

// open links in new tab, validate hrefs
const renderer = new marked.Renderer();
renderer.link = function ({ href, text }: { href: string; text: string }) {
  const safeHref = href && (href.startsWith("http://") || href.startsWith("https://"))
    ? href
    : "#";
  return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${text}</a>`;
};
marked.setOptions({ renderer });

@customElement("message-bubble")
export class MessageBubble extends LitElement {
  @property() role: "user" | "agent" = "agent";
  @property() content = "";

  static styles = css`
    :host { display: block; margin-bottom: 8px; }

    .bubble {
      padding: 14px 18px;
      font-size: 14px;
      line-height: 1.7;
      word-wrap: break-word;
      max-width: 90%;
    }

    .user {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.08));
      border: 1px solid rgba(59, 130, 246, 0.2);
      border-radius: var(--radius-lg) var(--radius-lg) var(--radius-sm) var(--radius-lg);
      margin-left: auto;
      color: var(--text-primary);
      font-weight: 400;
      max-width: 70%;
    }

    .agent {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm) var(--radius-lg) var(--radius-lg) var(--radius-lg);
    }

    /* typography */
    .agent h1, .agent h2, .agent h3 {
      font-family: var(--font-body);
      font-weight: 600;
      color: var(--text-primary);
      margin: 20px 0 8px;
      letter-spacing: -0.01em;
    }
    .agent h1 { font-size: 18px; }
    .agent h2 { font-size: 16px; border-bottom: 1px solid var(--border); padding-bottom: 6px; }
    .agent h3 { font-size: 14px; color: var(--amber); }

    .agent p { margin: 6px 0; }

    .agent strong { color: var(--amber); font-weight: 600; }

    .agent a {
      color: var(--accent);
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: border-color 0.2s;
    }
    .agent a:hover {
      border-bottom-color: var(--accent);
    }

    .agent ul, .agent ol {
      padding-left: 20px;
      margin: 6px 0;
    }
    .agent li { margin: 3px 0; }
    .agent li::marker { color: var(--text-muted); }

    /* tables */
    .agent table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin: 12px 0;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .agent thead {
      background: var(--bg-elevated);
    }

    .agent th {
      padding: 10px 12px;
      text-align: left;
      color: var(--text-secondary);
      font-weight: 500;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      border-bottom: 1px solid var(--border-light);
    }

    .agent td {
      padding: 8px 12px;
      border-bottom: 1px solid var(--border);
      color: var(--text-primary);
    }

    .agent tbody tr {
      transition: background 0.15s;
    }

    .agent tbody tr:hover {
      background: var(--amber-glow);
    }

    .agent tbody tr:last-child td {
      border-bottom: none;
    }

    /* code */
    .agent code {
      font-family: var(--font-mono);
      font-size: 12px;
      background: var(--bg-tertiary);
      padding: 2px 6px;
      border-radius: 4px;
    }

    .agent pre {
      background: var(--bg-tertiary);
      padding: 12px;
      border-radius: var(--radius-md);
      overflow-x: auto;
      margin: 8px 0;
    }
    .agent pre code {
      background: none;
      padding: 0;
    }

    .agent hr {
      border: none;
      border-top: 1px solid var(--border);
      margin: 16px 0;
    }

    .agent blockquote {
      border-left: 3px solid var(--amber-dim);
      padding-left: 12px;
      color: var(--text-secondary);
      margin: 8px 0;
    }
  `;

  render() {
    const rendered =
      this.role === "agent"
        ? unsafeHTML(DOMPurify.sanitize(marked.parse(this.content) as string))
        : this.content;
    return html`<div class="bubble ${this.role}">${rendered}</div>`;
  }
}
