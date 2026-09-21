import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { Shape } from '../types';

const EVENTS = ['Ereignis 1', 'Ereignis 2', 'Ereignis 3'];
const SHAPES: Shape[] = ['Rechteck', 'Kreis', 'Polygon'];

@customElement('app-menu')
export class AppMenu extends LitElement {
  static styles = css`
    :host { display: block; padding: 12px; box-sizing: border-box; background: #f4f4f4; }
    button { display: block; width: 100%; margin-bottom: 8px; padding: 8px; cursor: pointer; }
    button[aria-pressed="true"] { background: #2563eb; color: #fff; }
    fieldset { margin-top: 16px; border: 1px solid #ccc; }
    label { display: block; padding: 2px 0; cursor: pointer; }
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
