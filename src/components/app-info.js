class AppInfo extends HTMLElement {
  #event = null;
  #shape = null;
  #output;

  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>
        :host { display: block; padding: 12px; box-sizing: border-box; background: #f4f4f4; }
        textarea { width: 100%; height: 100%; min-height: 120px; box-sizing: border-box; resize: none; }
      </style>
      <textarea readonly></textarea>
    `;
    this.#output = root.querySelector('textarea');
    this.#render();
  }

  set event(value) { this.#event = value; this.#render(); }
  set shape(value) { this.#shape = value; this.#render(); }

  #render() {
    if (!this.#output) return;
    this.#output.value =
      `Ereignis: ${this.#event ?? 'keines gewählt'}\nForm: ${this.#shape ?? 'keine gewählt'}`;
  }
}

customElements.define('app-info', AppInfo);
