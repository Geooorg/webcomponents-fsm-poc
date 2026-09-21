# Web Components Karte

Kleines Vite + TypeScript-Projekt: eine Karte (Leaflet) mit Menü und Info-Feld, alles als native Web Components (Custom Elements mit Shadow DOM) auf Basis von Lit.

## Start

```bash
npm install
npm run dev      # Dev-Server
npm run build    # Typecheck (tsc) + Produktions-Build
```

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
| `<app-menu>` | `src/components/app-menu.ts` | Drei Ereignis-Buttons (Toggle) und Form-Auswahl per Radio-Buttons (Rechteck, Kreis, Polygon). Beides ist abwählbar: erneuter Klick hebt die Auswahl auf. Sendet bei jeder Änderung das Event `selection-change`. |
| `<app-map>` | `src/components/app-map.ts` | Zeigt eine Leaflet-Karte (OpenStreetMap, Berlin). Die Property `shape` steuert, welche Form eingezeichnet wird; `null` entfernt sie. Das Leaflet-CSS wird ins Shadow DOM eingebettet. |
| `<app-info>` | `src/components/app-info.ts` | Editierbares Textfeld oben rechts, initial leer und nur im Zustand `SendReady` sichtbar. Zeigt bei Auswahl „Ereignis: … / Form: …“, der Text darf überschrieben werden. Property `text`. |
| `<app-cancel-button>` | `src/components/app-cancel-button.ts` | Button „Abbrechen (Esc)“, sendet `cancel-click`. Wird auch durch die Esc-Taste ausgelöst. |
| `<app-ok-button>` | `src/components/app-ok-button.ts` | Großer OK-Button unten links, standardmäßig `disabled`; sendet `ok-click`. |
| `<app-spinner>` | `src/components/app-spinner.ts` | Vollflächiger Overlay mit Spinner (Property `active`) in `Bootstrapping` und `Gesendet`. |

`src/types.ts` enthält die gemeinsamen Typen (`Shape`, `Selection`) und typisiert das Event `selection-change`.

## Zustandsmaschine (Machina)

`src/fsm.ts` steuert mit [Machina](https://machina-js.org) den Ablauf:

```
Bootstrapping --(0,5 s)--> ShowMap --[Ereignis gewählt]--> EreignisGewaehlt --[Form gewählt]--> SendReady --[OK]--> Gesendet --(1 s)--> ShowMap
```

- `Bootstrapping` ist der Startzustand und simuliert die Abfrage von Hintergrunddiensten (0,5 s, Spinner).
- Nur in `SendReady` ist der OK-Button aktiv und das Textfeld rechts sichtbar.
- Wird die Auswahl im Menü geändert, ergibt sich der Zustand aus der Auswahl (z. B. Ereignis abgewählt → `ShowMap`).
- Bei `Gesendet` wird der Text des Textfelds per `console.log` ausgegeben und ein Spinner angezeigt; nach 1 Sekunde geht es zurück nach `ShowMap`.
- Abbrechen (Button oder Esc) fragt „Wirklich abbrechen?“ und führt ab `EreignisGewaehlt` zurück nach `ShowMap`. Esc wird auf `keyup` ausgewertet (siehe Kommentar in `main.ts`).
- Beim Wechsel nach `ShowMap` werden Menü, Karte und Textfeld zurückgesetzt.

## Datenfluss

```
<app-menu> --selection-change {event, shape}--> main.ts --> <app-info>.text
                                                        \-> <app-map>.shape
```

Die Komponenten kennen sich nicht gegenseitig. `src/main.ts` verbindet sie: Events nach oben, Properties nach unten.

## Lit

Die Komponenten sind mit [Lit](https://lit.dev) gebaut (`LitElement`, Decorators `@customElement`, `@property`, `@state`). Lit liefert deklaratives Rendering mit `html`-Templates, reaktive Properties und gescopte Styles über `css`. `app-map` bleibt wegen Leaflet teils imperativ (Karte wird in `firstUpdated` erzeugt). Die Decorators benötigen `experimentalDecorators` in der `tsconfig.json`.
