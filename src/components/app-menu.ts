import type { Shape } from '../types';

const EVENTS = ['Ereignis 1', 'Ereignis 2', 'Ereignis 3'];
const SHAPES: Shape[] = ['Rechteck', 'Kreis', 'Polygon'];

export class AppMenu extends HTMLElement {
  #event: string | null = null;
  #shape: Shape | null = null;

  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>
        :host { display: block; padding: 12px; box-sizing: border-box; background: #f4f4f4; }
        button { display: block; width: 100%; margin-bottom: 8px; padding: 8px; cursor: pointer; }
        button[aria-pressed="true"] { background: #2563eb; color: #fff; }
        fieldset { margin-top: 16px; border: 1px solid #ccc; }
        label { display: block; padding: 2px 0; cursor: pointer; }
      </style>
      ${EVENTS.map((n) => `<button type="button" aria-pressed="false" data-event="${n}">${n}</button>`).join('')}
      <fieldset>
        <legend>Form</legend>
        ${SHAPES.map((n) => `<label><input type="radio" name="shape" value="${n}"> ${n}</label>`).join('')}
      </fieldset>
    `;

    root.querySelectorAll<HTMLButtonElement>('button').forEach((btn) =>
      btn.addEventListener('click', () => {
        this.#event = this.#event === btn.dataset.event ? null : btn.dataset.event!;
        root.querySelectorAll<HTMLButtonElement>('button').forEach((b) =>
          b.setAttribute('aria-pressed', String(b.dataset.event === this.#event)));
        this.#emit();
      }));

    // Radio-Buttons lassen sich nativ nicht abwählen: erneuter Klick auf die gewählte Form hebt sie auf.
    root.querySelectorAll<HTMLInputElement>('input[type="radio"]').forEach((radio) =>
      radio.addEventListener('click', () => {
        if (this.#shape === radio.value) {
          radio.checked = false;
          this.#shape = null;
        } else {
          this.#shape = radio.value as Shape;
        }
        this.#emit();
      }));
  }

  #emit() {
    this.dispatchEvent(new CustomEvent('selection-change', {
      detail: { event: this.#event, shape: this.#shape },
    }));
  }
}

customElements.define('app-menu', AppMenu);

declare global {
  interface HTMLElementTagNameMap {
    'app-menu': AppMenu;
  }
}
