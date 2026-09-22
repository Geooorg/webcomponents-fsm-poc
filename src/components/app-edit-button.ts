import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('app-edit-button')
export class AppEditButton extends LitElement {
  static styles = css`
    :host([hidden]) { display: none; }
    :host { display: block; padding: 0 12px 12px; box-sizing: border-box; }
    button {
      width: 100%; padding: 10px 12px; font: inherit; font-weight: 500; color: var(--text);
      background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
      box-shadow: var(--shadow); cursor: pointer; transition: background .15s, border-color .15s;
    }
    button:hover:not(:disabled) { border-color: var(--accent); }
    button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  `;

  render() {
    return html`<button type="button" @click=${this.onClick}>Bearbeiten</button>`;
  }

  private onClick() {
    this.dispatchEvent(new CustomEvent('edit-click'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-edit-button': AppEditButton;
  }
}
