import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("tool-log")
export class ToolLog extends LitElement {
  @property({ type: Array }) lines: string[] = [];
  @state() private collapsed = true;

  static styles = css`
    :host { display: block; margin: 6px 0; }

    .log-wrapper {
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      overflow: hidden;
      background: var(--bg-primary);
    }

    .log-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      cursor: pointer;
      user-select: none;
      transition: background 0.15s;
    }
    .log-header:hover {
      background: var(--bg-secondary);
    }

    .log-icon {
      width: 14px;
      height: 14px;
      color: var(--amber-dim);
      flex-shrink: 0;
    }

    .log-label {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-muted);
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .log-count {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-muted);
      margin-left: auto;
    }

    .chevron {
      width: 12px;
      height: 12px;
      color: var(--text-muted);
      transition: transform 0.2s;
      flex-shrink: 0;
    }
    .chevron.open { transform: rotate(90deg); }

    .log-body {
      padding: 0 12px 10px;
      max-height: 180px;
      overflow-y: auto;
    }

    .line {
      font-family: var(--font-mono);
      font-size: 11.5px;
      line-height: 1.7;
      white-space: pre-wrap;
      color: var(--text-secondary);
    }

    .line.search { color: var(--amber-dim); }
    .line.success { color: var(--success); }
    .line.write { color: var(--text-muted); }
  `;

  private classify(line: string): string {
    if (line.includes("✓")) return "success";
    if (line.includes("search_") || line.includes("resolve_")) return "search";
    if (line.includes("write_") || line.includes("update_")) return "write";
    return "";
  }

  render() {
    const gearIcon = html`<svg class="log-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;
    const chevron = html`<svg class="chevron ${this.collapsed ? '' : 'open'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`;

    return html`
      <div class="log-wrapper">
        <div class="log-header" @click=${() => (this.collapsed = !this.collapsed)}>
          ${gearIcon}
          <span class="log-label">agent activity</span>
          <span class="log-count">${this.lines.length} ops</span>
          ${chevron}
        </div>
        ${!this.collapsed
          ? html`<div class="log-body">
              ${this.lines.map(
                (l) => html`<div class="line ${this.classify(l)}">${l}</div>`
              )}
            </div>`
          : ""}
      </div>
    `;
  }
}
