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
