import type { Shape } from '../types';

export class AppInfo extends HTMLElement {
  #event: string | null = null;
  #shape: Shape | null = null;
  #output!: HTMLTextAreaElement;

  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>
        :host { display: block; padding: 12px; box-sizing: border-box; background: #f4f4f4; }
        textarea { width: 100%; height: 100%; min-height: 120px; box-sizing: border-box; resize: none; }
      </style>
      <textarea readonly></textarea>
    `;
    this.#output = root.querySelector('textarea')!;
    this.#render();
  }

  set event(value: string | null) { this.#event = value; this.#render(); }
  set shape(value: Shape | null) { this.#shape = value; this.#render(); }

  #render() {
    if (!this.#output) return;
    this.#output.value =
      `Ereignis: ${this.#event ?? 'keines gewählt'}\nForm: ${this.#shape ?? 'keine gewählt'}`;
  }
}

customElements.define('app-info', AppInfo);

declare global {
  interface HTMLElementTagNameMap {
    'app-info': AppInfo;
  }
}
