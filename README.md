# Web Components Karte

Kleines Vite + TypeScript-Projekt: eine Karte (Leaflet) mit Menü und Info-Feld, alles als native Web Components (Custom Elements mit Shadow DOM), ohne UI-Framework.

## Start

```bash
npm install
npm run dev      # Dev-Server
npm run build    # Typecheck (tsc) + Produktions-Build
```

## Komponenten

| Element | Datei | Aufgabe |
|---|---|---|
| `<app-menu>` | `src/components/app-menu.ts` | Drei Ereignis-Buttons (Toggle) und Form-Auswahl per Radio-Buttons (Rechteck, Kreis, Polygon). Beides ist abwählbar: erneuter Klick hebt die Auswahl auf. Sendet bei jeder Änderung das Event `selection-change`. |
| `<app-map>` | `src/components/app-map.ts` | Zeigt eine Leaflet-Karte (OpenStreetMap, Berlin). Die Property `shape` steuert, welche Form eingezeichnet wird; `null` entfernt sie. Das Leaflet-CSS wird ins Shadow DOM eingebettet. |
| `<app-info>` | `src/components/app-info.ts` | Schreibgeschütztes Textfeld mit dem aktuellen Ereignis und der Form. Properties `event` und `shape`. |

`src/types.ts` enthält die gemeinsamen Typen (`Shape`, `Selection`) und typisiert das Event `selection-change`.

## Datenfluss

```
<app-menu> --selection-change {event, shape}--> main.ts --> <app-info>.event / .shape
                                                        \-> <app-map>.shape
```

Die Komponenten kennen sich nicht gegenseitig. `src/main.ts` verbindet sie: Events nach oben, Properties nach unten.

## Lit?

Bewusst nicht eingesetzt. Bei drei kleinen Komponenten ist der Boilerplate überschaubar. [Lit](https://lit.dev) (~5 kB) würde sich lohnen, sobald es mehr Komponenten oder mehr Zustand gibt:

- deklaratives Rendering (`html`-Templates) statt `innerHTML` und manuellem `querySelector`/Update; nur geänderte Teile werden aktualisiert
- reaktive Properties (`@property`, `@state`), die automatisch ein Re-Render auslösen (heute z. B. `#render()` von Hand in `app-info`)
- `static styles = css\`...\`` mit Shadow-DOM-Scoping und Sharing
- Event-Bindung im Template (`@click=${...}`), Decorators oder Attribut-Konvertierung
- gute TypeScript-Unterstützung

Für `app-menu` und `app-info` würde der Code deutlich kürzer. `app-map` bliebe wegen Leaflet imperativ.
