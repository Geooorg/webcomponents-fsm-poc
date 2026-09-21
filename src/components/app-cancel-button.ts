import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-cancel-button')
export class AppCancelButton extends LitElement {
  static styles = css`
    :host { display: block; padding: 0 12px 12px; box-sizing: border-box; background: #f4f4f4; }
    button { width: 100%; padding: 8px; cursor: pointer; }
    button:disabled { cursor: not-allowed; }
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
