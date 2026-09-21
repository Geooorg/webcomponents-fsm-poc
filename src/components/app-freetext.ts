import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-freetext')
export class AppFreetext extends LitElement {
  static styles = css`
    :host { display: block; padding: 12px; box-sizing: border-box; background: #f4f4f4; }
    label { display: block; margin-bottom: 4px; font-size: 0.9rem; }
    textarea { width: 100%; height: 100px; box-sizing: border-box; resize: none; }
  `;

  @property() text = '';

  render() {
    return html`
      <label for="freetext">Freitext</label>
      <textarea id="freetext" .value=${this.text} @input=${this.onInput}></textarea>
    `;
  }

  private onInput(e: Event) {
    this.text = (e.target as HTMLTextAreaElement).value;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-freetext': AppFreetext;
  }
}
