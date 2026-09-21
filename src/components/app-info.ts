import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Shape } from '../types';

@customElement('app-info')
export class AppInfo extends LitElement {
  static styles = css`
    :host { display: block; padding: 12px; box-sizing: border-box; background: #f4f4f4; }
    textarea { width: 100%; height: 100%; min-height: 120px; box-sizing: border-box; resize: none; }
  `;

  @property() event: string | null = null;
  @property() shape: Shape | null = null;

  render() {
    const text = `Ereignis: ${this.event ?? 'keines gewählt'}\nForm: ${this.shape ?? 'keine gewählt'}`;
    return html`<textarea readonly .value=${text}></textarea>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-info': AppInfo;
  }
}
