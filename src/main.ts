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

// Abbrechen per Button oder Esc, immer mit Rückfrage. Nur ab EreignisGewaehlt möglich.
const cancelable = () => ['EreignisGewaehlt', 'SendReady', 'Gesendet'].includes(fsm.currentState());

function requestCancel() {
  if (cancelable() && confirm('Wirklich abbrechen?')) fsm.handle('cancel');
}
cancelButton.addEventListener('cancel-click', requestCancel);

// Bewusst keyup statt keydown: Öffnet man confirm() beim keydown von Esc, schließt das
// anschließende keyup (bzw. Auto-Repeat) den Dialog sofort wieder als „Abbrechen“.
document.addEventListener('keyup', (e) => {
  if (e.key === 'Escape') requestCancel();
});

// FSM -> UI
function render(state: string) {
  spinner.active = state === 'Bootstrapping' || state === 'Gesendet';
  okButton.disabled = state !== 'SendReady';
  cancelButton.disabled = !cancelable();
  info.hidden = state !== 'SendReady';
}

render(fsm.currentState());

fsm.on('transitioned', ({ toState }) => {
  render(toState);

  if (toState === 'Gesendet') console.log(info.text);

  if (toState === 'ShowMap') {
    menu.reset();
    map.shape = null;
    info.text = '';
  }
});
