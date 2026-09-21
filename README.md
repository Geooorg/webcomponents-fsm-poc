# Web Components Karte

Kleines Vite + TypeScript-Projekt: eine Karte (Leaflet) mit Menü und Info-Feld, alles als native Web Components (Custom Elements mit Shadow DOM) auf Basis von Lit.

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
| `<app-cancel-button>` | `src/components/app-cancel-button.ts` | Button „Abbrechen (Esc)“, sendet `cancel-click`. Wird auch durch die Esc-Taste ausgelöst. |
| `<app-ok-button>` | `src/components/app-ok-button.ts` | Großer OK-Button unten links, standardmäßig `disabled`; sendet `ok-click`. |
| `<app-freetext>` | `src/components/app-freetext.ts` | Freitext-Feld unten rechts. Übernimmt bei Auswahl eines Ereignisses dessen Buttontext (z. B. „Ereignis 1“) und bleibt editierbar. |

`src/types.ts` enthält die gemeinsamen Typen (`Shape`, `Selection`) und typisiert das Event `selection-change`.

## Zustandsmaschine (Machina)

`src/fsm.ts` steuert mit [Machina](https://machina-js.org) den Ablauf:

```
Init --[Ereignis gewählt]--> EreignisGewaehlt --[Form gewählt]--> SendReady --[OK]--> Gesendet --(1 s)--> Init
```

- Nur in `SendReady` ist der OK-Button aktiv.
- Wird die Auswahl im Menü geändert, ergibt sich der Zustand aus der Auswahl (z. B. Ereignis abgewählt → `Init`).
- Bei `Gesendet` wird der Freitext per `console.log` ausgegeben; nach 1 Sekunde geht es zurück nach `Init`.
- Abbrechen (Button oder Esc) fragt „Wirklich abbrechen?“ und führt aus jedem Zustand zurück nach `Init`.
- Beim Wechsel nach `Init` werden Menü, Karte, Info und Freitext zurückgesetzt.

## Datenfluss

```
<app-menu> --selection-change {event, shape}--> main.ts --> <app-info>.event / .shape
                                                        \-> <app-map>.shape
```

Die Komponenten kennen sich nicht gegenseitig. `src/main.ts` verbindet sie: Events nach oben, Properties nach unten.

## Lit

&(https://lit.dev) gebaut (`LitElement`, Decorators `@customElement`, `@property`, `@state`). Lit liefert deklaratives Rendering mit `html`-Templates, reaktive Properties und gescopte Styles über `css`. `app-map` bleibt wegen Leaflet teils imperativ (Karte wird in `firstUpdated` erzeugt). Die Decorators benötigen `experimentalDecorators` in der `tsconfig.json`.
