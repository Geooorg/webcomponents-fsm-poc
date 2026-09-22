import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/** Nicht editierbares Textfeld, das den aktuellen FSM-Zustand anzeigt. */
@customElement('app-status')
export class AppStatus extends LitElement {
  static styles = css`
    /* Über dem Spinner-Overlay (z-index 1000), damit der Zustand auch beim Laden/Senden lesbar bleibt. */
    :host { display: block; position: relative; z-index: 1001; padding: 0 12px 12px; box-sizing: border-box; }
    label { display: block; margin-bottom: 4px; color: var(--muted); font-size: .85rem; }
    input {
      width: 100%; box-sizing: border-box; padding: 10px 12px; font: inherit; color: var(--muted);
      background: var(--border); border: 1px solid var(--border); border-radius: var(--radius);
      cursor: not-allowed;
    }
    input:focus { outline: none; }
  `;

  @property() value = '';

  render() {
    return html`
      <label for="state">Zustand</label>
      <input id="state" type="text" readonly .value=${this.value}>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-status': AppStatus;
  }
}
