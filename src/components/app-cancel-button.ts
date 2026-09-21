import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-cancel-button')
export class AppCancelButton extends LitElement {
  static styles = css`
    :host { display: block; padding: 0 12px 12px; box-sizing: border-box; }
    button {
      width: 100%; padding: 10px 12px; font: inherit; font-weight: 500; color: var(--text);
      background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
      box-shadow: var(--shadow); cursor: pointer; transition: background .15s, border-color .15s;
    }
    button:hover:not(:disabled) { border-color: var(--accent); }
    button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    button:disabled { color: var(--muted); background: transparent; box-shadow: none; cursor: not-allowed; }
  `;

  @property({ type: Boolean }) disabled = true;

  render() {
    return html`<button type="button" ?disabled=${this.disabled} @click=${this.onClick}>Abbrechen (Esc)</button>`;
  }

  private onClick() {
    this.dispatchEvent(new CustomEvent('cancel-click'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-cancel-button': AppCancelButton;
  }
}
