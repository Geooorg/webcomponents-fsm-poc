import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-ok-button')
export class AppOkButton extends LitElement {
  static styles = css`
    :host { display: block; padding: 12px; box-sizing: border-box; background: #f4f4f4; }
    button { width: 100%; padding: 20px; font-size: 1.5rem; font-weight: bold; cursor: pointer; }
    button:disabled { cursor: not-allowed; }
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
