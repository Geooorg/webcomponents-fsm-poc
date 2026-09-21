import { LitElement, html, css, unsafeCSS, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import L from 'leaflet';
import leafletCss from 'leaflet/dist/leaflet.css?inline';
import type { Shape } from '../types';

const CENTER: L.LatLngTuple = [53.5511, 9.9937];

@customElement('app-map')
export class AppMap extends LitElement {
  static styles = [
    unsafeCSS(leafletCss),
    css`
      :host { display: block; }
      #map { width: 100%; height: 100%; border-radius: var(--radius); box-shadow: var(--shadow); }
    `,
  ];

  @property() shape: Shape | null = null;
  @query('#map') private mapEl!: HTMLElement;

  private map?: L.Map;
  private layer: L.Layer | null = null;

  render() {
    return html`<div id="map"></div>`;
  }

  firstUpdated() {
    this.map = L.map(this.mapEl).setView(CENTER, 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap-Mitwirkende',
    }).addTo(this.map);
    this.draw();
  }

  updated(changed: PropertyValues) {
    if (changed.has('shape')) this.draw();
  }

  private draw() {
    if (!this.map) return;
    this.layer?.remove();
    const [lat, lng] = CENTER;
    const d = 0.01;
    const shapes: Record<Shape, () => L.Layer> = {
      Rechteck: () => L.rectangle([[lat - d, lng - d * 1.5], [lat + d, lng + d * 1.5]]),
      Kreis: () => L.circle(CENTER, { radius: 1000 }),
      Polygon: () => L.polygon([[lat + d, lng], [lat - d, lng + d * 1.5], [lat - d, lng - d * 1.5]]),
    };
    this.layer = this.shape ? shapes[this.shape]().addTo(this.map) : null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-map': AppMap;
  }
}
