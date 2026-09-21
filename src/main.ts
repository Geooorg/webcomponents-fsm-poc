import './components/app-menu';
import './components/app-map';
import './components/app-info';
import './components/app-ok-button';
import './components/app-cancel-button';
import './components/app-spinner';
import { createSelectionFsm } from './fsm';
import type { Selection } from './types';

const $ = <T extends keyof HTMLElementTagNameMap>(tag: T) =>
  document.querySelector<HTMLElementTagNameMap[T]>(tag)!;

const menu = $('app-menu');
const map = $('app-map');
const info = $('app-info');
const okButton = $('app-ok-button');
const cancelButton = $('app-cancel-button');
const spinner = $('app-spinner');

const fsm = createSelectionFsm();

const describe = ({ event, shape }: Selection) =>
  event || shape ? `Ereignis: ${event ?? 'keines gewählt'}\nForm: ${shape ?? 'keine gewählt'}` : '';

// UI -> FSM
menu.addEventListener('selection-change', (e) => {
  const selection = e.detail;
  map.shape = selection.shape;
  info.text = describe(selection);
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

  spinner.active = toState === 'Gesendet';
  if (toState === 'Gesendet') console.log(info.text);

  if (toState === 'Init') {
    menu.reset();
    map.shape = null;
    info.text = '';
  }
});
