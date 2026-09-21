import { createFsm } from 'machina';
import type { Selection } from './types';

export type FsmState = 'Bootstrapping' | 'ShowMap' | 'EreignisGewaehlt' | 'SendReady' | 'Gesendet';

const BOOTSTRAP_DELAY_MS = 500;
const RESET_DELAY_MS = 1000;

// Der Zustand ergibt sich aus der aktuellen Auswahl; bleibt er gleich, wird nicht transitioniert.
function stateFor({ event, shape }: Selection): FsmState {
  if (!event) return 'ShowMap';
  return shape ? 'SendReady' : 'EreignisGewaehlt';
}

const onSelectionChanged = (current: FsmState) => (_args: unknown, selection: unknown) => {
  const next = stateFor(selection as Selection);
  if (next !== current) return next;
};

export function createSelectionFsm() {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const fsm = createFsm({
    id: 'selection',
    initialState: 'Bootstrapping' as FsmState,
    context: {},
    states: {
      // Simuliert die Abfrage von Hintergrunddiensten.
      Bootstrapping: {
        _onEnter() {
          timer = setTimeout(() => fsm.handle('bootstrapped'), BOOTSTRAP_DELAY_MS);
        },
        _onExit() {
          clearTimeout(timer);
        },
        bootstrapped: 'ShowMap',
      },
      ShowMap: {
        selectionChanged: onSelectionChanged('ShowMap'),
      },
      EreignisGewaehlt: {
        selectionChanged: onSelectionChanged('EreignisGewaehlt'),
        cancel: 'ShowMap',
      },
      SendReady: {
        selectionChanged: onSelectionChanged('SendReady'),
        send: 'Gesendet',
        cancel: 'ShowMap',
      },
      Gesendet: {
        _onEnter() {
          timer = setTimeout(() => fsm.handle('sendDone'), RESET_DELAY_MS);
        },
        _onExit() {
          clearTimeout(timer);
        },
        sendDone: 'ShowMap',
        cancel: 'ShowMap',
      },
    },
  });

  return fsm;
}
