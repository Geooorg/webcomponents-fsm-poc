import './components/app-menu';
import './components/app-map';
import './components/app-info';
import './components/app-ok-button';
import './components/app-cancel-button';
import './components/app-freetext';
import { createSelectionFsm } from './fsm';

const $ = <T extends keyof HTMLElementTagNameMap>(tag: T) =>
  document.querySelector<HTMLElementTagNameMap[T]>(tag)!;

const menu = $('app-menu');
const map = $('app-map');
const info = $('app-info');
const okButton = $('app-ok-button');
const cancelButton = $('app-cancel-button');
const freetext = $('app-freetext');

const fsm = createSelectionFsm();

// UI -> FSM
menu.addEventListener('selection-change', (e) => {
  const selection = e.detail;
  info.event = selection.event;
  info.shape = selection.shape;
  map.shape = selection.shape;
  if (selection.event) freetext.text = selection.event;
  fsm.handle('selectionChanged', selection);
});

okButton.addEventListener('ok-click', () => fsm.handle('send'));

// Abbrechen per Button oder Esc, immer mit Rückfrage.
function requestCancel() {
  if (fsm.currentState() !== 'Init' && confirm('Wirklich abbrechen?')) fsm.handle('cancel');
}
cancelButton.addEventListener('cancel-click', requestCancel);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') requestCancel();
});

// FSM -> UI
fsm.on('transitioned', ({ toState }) => {
  okButton.disabled = toState !== 'SendReady';
  cancelButton.disabled = toState === 'Init';

  if (toState === 'Gesendet') console.log(freetext.text);

  if (toState === 'Init') {
    menu.reset();
    info.event = null;
    info.shape = null;
    map.shape = null;
    freetext.text = '';
  }
});
