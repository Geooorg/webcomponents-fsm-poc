import { createFsm } from 'machina';
import type { Selection } from './types';

export type FsmState = 'Init' | 'EreignisGewaehlt' | 'SendReady' | 'Gesendet';

const RESET_DELAY_MS = 1000;

// Der Zustand ergibt sich aus der aktuellen Auswahl; bleibt er gleich, wird nicht transitioniert.
function stateFor({ event, shape }: Selection): FsmState {
  if (!event) return 'Init';
  return shape ? 'SendReady' : 'EreignisGewaehlt';
}

const onSelectionChanged = (current: FsmState) => (_args: unknown, selection: unknown) => {
  const next = stateFor(selection as Selection);
  if (next !== current) return next;
};

export function createSelectionFsm() {
  let resetTimer: ReturnType<typeof setTimeout> | undefined;

  const fsm = createFsm({
    id: 'selection',
    initialState: 'Init' as FsmState,
    context: {},
    states: {
      Init: {
        selectionChanged: onSelectionChanged('Init'),
      },
      EreignisGewaehlt: {
        selectionChanged: onSelectionChanged('EreignisGewaehlt'),
        cancel: 'Init',
      },
      SendReady: {
        selectionChanged: onSelectionChanged('SendReady'),
        send: 'Gesendet',
        cancel: 'Init',
      },
      Gesendet: {
        _onEnter() {
          resetTimer = setTimeout(() => fsm.handle('sendDone'), RESET_DELAY_MS);
        },
        _onExit() {
          clearTimeout(resetTimer);
        },
        sendDone: 'Init',
        cancel: 'Init',
      },
    },
  });

  return fsm;
}
