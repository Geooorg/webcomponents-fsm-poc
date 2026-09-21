import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-info')
export class AppInfo extends LitElement {
  static styles = css`
    :host([hidden]) { display: none; }
    :host { display: block; padding: 12px; box-sizing: border-box; background: #f4f4f4; }
    textarea { width: 100%; height: 100%; min-height: 120px; box-sizing: border-box; resize: none; }
  `;

  @property() text = '';

  render() {
    return html`<textarea .value=${this.text} @input=${this.onInput}></textarea>`;
  }

  private onInput(e: Event) {
    this.text = (e.target as HTMLTextAreaElement).value;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-info': AppInfo;
  }
}
