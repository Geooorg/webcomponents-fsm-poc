import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-ok-button')
export class AppOkButton extends LitElement {
  static styles = css`
    :host { display: block; padding: 12px; box-sizing: border-box; }
    button {
      width: 100%; padding: 22px 20px; font: inherit; font-size: 1.5rem; font-weight: bold; color: #fff;
      background: var(--accent); border: none; border-radius: var(--radius);
      box-shadow: var(--shadow); cursor: pointer; transition: background .15s;
    }
    button:hover:not(:disabled) { background: var(--accent-hover); }
    button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    button:disabled { color: var(--muted); background: var(--border); box-shadow: none; cursor: not-allowed; }
  `;

  @property({ type: Boolean }) disabled = true;

  render() {
    return html`<button type="button" ?disabled=${this.disabled} @click=${this.onClick}>OK</button>`;
  }

  private onClick() {
    this.dispatchEvent(new CustomEvent('ok-click'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-ok-button': AppOkButton;
  }
}
