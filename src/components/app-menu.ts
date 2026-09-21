import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { Shape } from '../types';

const EVENTS = ['Ereignis 1', 'Ereignis 2', 'Ereignis 3'];
const SHAPES: Shape[] = ['Rechteck', 'Kreis', 'Polygon'];

@customElement('app-menu')
export class AppMenu extends LitElement {
  static styles = css`
    :host { display: block; padding: 12px; box-sizing: border-box; }
    button {
      display: block; width: 100%; margin-bottom: 8px; padding: 10px 12px;
      font: inherit; font-weight: 500; color: var(--text);
      background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
      box-shadow: var(--shadow); cursor: pointer; transition: background .15s, border-color .15s, color .15s;
    }
    button:hover { border-color: var(--accent); }
    button[aria-pressed="true"] { background: var(--accent); border-color: var(--accent); color: #fff; }
    button:focus-visible, input:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    fieldset {
      margin: 16px 0 0; padding: 8px 12px 10px; background: var(--surface);
      border: 1px solid var(--border); border-radius: var(--radius);
    }
    legend { padding: 0 6px; color: var(--muted); font-size: .85rem; }
    label { display: block; padding: 4px 0; cursor: pointer; }
    input[type="radio"] { accent-color: var(--accent); }
  `;

  @state() private event: string | null = null;
  @state() private shape: Shape | null = null;

  render() {
    return html`
      ${EVENTS.map((name) => html`
        <button type="button" aria-pressed=${this.event === name} @click=${() => this.toggleEvent(name)}>
          ${name}
        </button>`)}
      <fieldset>
        <legend>Form</legend>
        ${SHAPES.map((name) => html`
          <label>
            <input type="radio" name="shape" .checked=${this.shape === name} @click=${() => this.toggleShape(name)}>
            ${name}
          </label>`)}
      </fieldset>
    `;
  }

  /** Setzt die Auswahl zurück, ohne ein Event zu senden. */
  reset() {
    this.event = null;
    this.shape = null;
  }

  private toggleEvent(name: string) {
    this.event = this.event === name ? null : name;
    this.emit();
  }

  // Radio-Buttons lassen sich nativ nicht abwählen: erneuter Klick auf die gewählte Form hebt sie auf.
  private toggleShape(name: Shape) {
    this.shape = this.shape === name ? null : name;
    this.emit();
  }

  private emit() {
    this.dispatchEvent(new CustomEvent('selection-change', {
      detail: { event: this.event, shape: this.shape },
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-menu': AppMenu;
  }
}
