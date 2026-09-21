# Web Components Karte

Kleines Vite + TypeScript-Projekt: eine Karte (Leaflet) mit Menü, Info-Feld und Statusanzeige, alles als native Web Components (Custom Elements mit Shadow DOM) auf Basis von Lit.

## Start

```bash
npm install
npm run dev      # Dev-Server
npm run build    # Typecheck (tsc) + Produktions-Build
```

Für die Vorschau im Claude-Browser-Pane liegt `.claude/launch.json` (Dev-Server auf Port 5173) bei.

## Build und Deployment

```bash
npm run build      # Typecheck + minifizierter Build nach dist/
npm run package    # Build + Archiv release/webcomponents-karte.tar.gz
```

Der Build ist eine reine statische Seite (`index.html` + `assets/`) ohne Server-Code. `vite.config.ts` setzt `base: './'`, alle Pfade sind also relativ. Die Seite läuft deshalb im Wurzelverzeichnis wie in einem Unterverzeichnis eines beliebigen HTML-Servers (nginx, Apache, S3 usw.).

Deployment:

1. `npm run package` ausführen.
2. Archiv auf den Server kopieren und in das Zielverzeichnis entpacken, z. B. `tar -xzf webcomponents-karte.tar.gz -C /var/www/html/karte`. Alternativ den Inhalt von `dist/` direkt hochladen.
3. Optional: auf dem Server gzip/brotli für `.js`/`.css` aktivieren.

Lokal testen: `npm run preview` oder `npx serve dist`. Die Karte lädt die Kacheln von `tile.openstreetmap.org`, der Client braucht also Internetzugang.

## Komponenten

| Element | Datei | Aufgabe |
|---|---|---|
| `<app-menu>` | `src/components/app-menu.ts` | Drei Ereignis-Buttons (Toggle) und Form-Auswahl per Radio-Buttons (Rechteck, Kreis, Polygon). Beides ist abwählbar: erneuter Klick hebt die Auswahl auf. Formen sind nur wählbar, wenn ein Ereignis gewählt ist (Property `shapesDisabled`); wird das Ereignis abgewählt, wird auch die Form zurückgesetzt. Sendet bei jeder Änderung das Event `selection-change`. |
| `<app-map>` | `src/components/app-map.ts` | Zeigt eine Leaflet-Karte (OpenStreetMap, Hamburg). Die Property `shape` steuert, welche Form eingezeichnet wird; `null` entfernt sie. Das Leaflet-CSS wird ins Shadow DOM eingebettet. |
| `<app-info>` | `src/components/app-info.ts` | Editierbares Textfeld rechts, initial leer. Zeigt bei Auswahl „Ereignis: … / Form: …“, der Text darf überschrieben werden. Property `text`. Wird über `hidden` ein-/ausgeblendet (siehe `<app-edit-button>`). |
| `<app-edit-button>` | `src/components/app-edit-button.ts` | Button „Bearbeiten“ unten rechts, nur im Zustand `SendReady` sichtbar; sendet `edit-click`. `main.ts` blendet damit das Textfeld ein bzw. aus. |
| `<app-cancel-button>` | `src/components/app-cancel-button.ts` | Button „Abbrechen (Esc)“, sendet `cancel-click`. Wird auch durch die Esc-Taste ausgelöst. |
| `<app-status>` | `src/components/app-status.ts` | Nicht editierbares, ausgegrautes Textfeld unter dem Abbrechen-Button; zeigt den aktuellen FSM-Zustand (Property `value`). Liegt über dem Spinner-Overlay und bleibt dadurch lesbar. |
| `<app-ok-button>` | `src/components/app-ok-button.ts` | Großer OK-Button unten links, standardmäßig `disabled`; sendet `ok-click`. |
| `<app-spinner>` | `src/components/app-spinner.ts` | Vollflächiger, leicht verwischter Overlay mit Spinner (Property `active`) in `Bootstrapping` und `Sending`; blockiert Mausklicks. |

`src/types.ts` enthält die gemeinsamen Typen (`Shape`, `Selection`) und typisiert das Event `selection-change`.

## Zustandsmaschine (Machina)

`src/fsm.ts` steuert mit [Machina](https://machina-js.org) den Ablauf:

```
Bootstrapping --(0,5 s)--> ShowMap --[Ereignis gewählt]--> EventSelected --[Form gewählt]--> SendReady --[OK]--> Sending --(1 s)--> ShowMap
```

- `Bootstrapping` ist der Startzustand und simuliert die Abfrage von Hintergrunddiensten (0,5 s, Spinner).
- Formen sind erst ab `EventSelected` wählbar; sonst sind die Radio-Buttons deaktiviert.
- Nur in `SendReady` ist der OK-Button aktiv und der Button „Bearbeiten“ sichtbar. Das Textfeld rechts ist dort zunächst ausgeblendet und lässt sich mit „Bearbeiten“ ein- und ausblenden; beim Verlassen von `SendReady` wird es wieder ausgeblendet.
- Das Feld „Zustand“ zeigt in jedem Zustand den aktuellen Namen.
- Wird die Auswahl im Menü geändert, ergibt sich der Zustand aus der Auswahl (z. B. Ereignis abgewählt → `ShowMap`).
- Bei `Sending` wird der Text des Textfelds per `console.log` ausgegeben und ein Spinner angezeigt; nach 1 Sekunde geht es zurück nach `ShowMap`.
- Abbrechen (Button oder Esc) fragt „Wirklich abbrechen?“ und führt ab `EventSelected` zurück nach `ShowMap`. Esc wird auf `keyup` ausgewertet (siehe Kommentar in `main.ts`).
- Beim Wechsel nach `ShowMap` werden Menü, Karte und Textfeld zurückgesetzt.

## Datenfluss

```
<app-menu> --selection-change {event, shape}--> main.ts --> <app-info>.text
                                                        \-> <app-map>.shape
Buttons (OK, Abbrechen, Bearbeiten) --ok-click / cancel-click / edit-click--> main.ts
main.ts <--transitioned-- FSM --> render() setzt disabled/hidden/value der Komponenten
```

Die Komponenten kennen sich nicht gegenseitig. `src/main.ts` verbindet sie: Events nach oben, Properties nach unten. Nach jedem Zustandswechsel setzt `render()` in `main.ts` aus dem FSM-Zustand `disabled`/`hidden`-Flags der Komponenten, `<app-status>.value` und `<app-menu>.shapesDisabled`. Ausführlich: [FSM.md](FSM.md).

## Gestaltung

Farben, Radius und Schatten sind als CSS-Variablen in `index.html` (`:root`) definiert und wirken durch die Shadow DOMs hindurch. Die Karte endet unten auf Höhe der Oberkante des OK-Buttons (`margin-bottom: 84px` in `index.html` = 12 px Padding + 72 px Buttonhöhe); ändert sich das Padding oder die Schrift des OK-Buttons, muss der Wert angepasst werden.

## Lit

Die Komponenten sind mit [Lit](https://lit.dev) gebaut (`LitElement`, Decorators `@customElement`, `@property`, `@state`). Lit liefert deklaratives Rendering mit `html`-Templates, reaktive Properties und gescopte Styles über `css`. `app-map` bleibt wegen Leaflet teils imperativ (Karte wird in `firstUpdated` erzeugt). Die Decorators benötigen `experimentalDecorators` in der `tsconfig.json`.
