import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/** Vollflächiger Overlay mit Spinner; blockiert Mausklicks, solange er aktiv ist. */
@customElement('app-spinner')
export class AppSpinner extends LitElement {
  static styles = css`
    :host { display: none; position: fixed; inset: 0; z-index: 1000; background: rgba(255, 255, 255, 0.6); }
    :host([active]) { display: flex; align-items: center; justify-content: center; }
    .spinner {
      width: 56px; height: 56px; box-sizing: border-box;
      border: 6px solid #cbd5e1; border-top-color: #2563eb; border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `;

  @property({ type: Boolean, reflect: true }) active = false;

  render() {
    return html`<div class="spinner" role="status" aria-label="Bitte warten"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-spinner': AppSpinner;
  }
}
