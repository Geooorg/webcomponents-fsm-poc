import L from 'leaflet';
import type { Shape } from '../types';
import leafletCss from 'leaflet/dist/leaflet.css?inline';

const CENTER: L.LatLngTuple = [52.52, 13.405];

export class AppMap extends HTMLElement {
  #map?: L.Map;
  #layer: L.Layer | null = null;
  #shape: Shape | null = null;

  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${leafletCss}
        :host { display: block; }
        #map { width: 100%; height: 100%; }
      </style>
      <div id="map"></div>
    `;
    this.#map = L.map(root.querySelector<HTMLElement>('#map')!).setView(CENTER, 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap-Mitwirkende',
    }).addTo(this.#map);
    this.#draw();
  }

  set shape(value: Shape | null) { this.#shape = value; this.#draw(); }

  #draw() {
    if (!this.#map) return;
    this.#layer?.remove();
    const [lat, lng] = CENTER;
    const d = 0.01;
    const shapes: Record<Shape, () => L.Layer> = {
      Rechteck: () => L.rectangle([[lat - d, lng - d * 1.5], [lat + d, lng + d * 1.5]]),
      Kreis: () => L.circle(CENTER, { radius: 1000 }),
      Polygon: () => L.polygon([[lat + d, lng], [lat - d, lng + d * 1.5], [lat - d, lng - d * 1.5]]),
    };
    this.#layer = this.#shape ? shapes[this.#shape]().addTo(this.#map) : null;
  }
}

customElements.define('app-map', AppMap);

declare global {
  interface HTMLElementTagNameMap {
    'app-map': AppMap;
  }
}
