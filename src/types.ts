export type Shape = 'Rechteck' | 'Kreis' | 'Polygon';

export interface Selection {
  event: string | null;
  shape: Shape | null;
}

declare global {
  interface HTMLElementEventMap {
    'selection-change': CustomEvent<Selection>;
  }
}
