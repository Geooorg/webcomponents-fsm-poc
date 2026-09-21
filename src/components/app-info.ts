import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-info')
export class AppInfo extends LitElement {
  static styles = css`
    :host([hidden]) { display: none; }
    :host { display: block; padding: 12px; box-sizing: border-box; }
    textarea {
      width: 100%; height: 100%; min-height: 120px; box-sizing: border-box; resize: none; padding: 10px 12px;
      font: inherit; color: var(--text); background: var(--surface);
      border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow);
    }
    textarea:focus-visible { outline: 2px solid var(--accent); outline-offset: 0; }
  `;

  @property() text = '';

  render() {
    return html`<textarea .value=${this.text} @input=${this.onInput}></textarea>`;
  }

  private onInput(e: Event) {
    this.text = (e.target as HTMLTextAreaElement).value;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-info': AppInfo;
  }
}
