// packages/history/src/index.ts

export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export function createHistory<T>(initialPresent: T): HistoryState<T> {
  return {
    past: [],
    present: initialPresent,
    future: []
  };
}

export function pushState<T>(state: HistoryState<T>, nextState: T): HistoryState<T> {
  return {
    past: [...state.past, state.present],
    present: nextState,
    future: []
  };
}

export function undo<T>(state: HistoryState<T>): HistoryState<T> {
  if (state.past.length === 0) return state;
  const previous = state.past[state.past.length - 1];
  const remainingPast = state.past.slice(0, -1);
  return {
    past: remainingPast,
    present: previous,
    future: [state.present, ...state.future]
  };
}

export function redo<T>(state: HistoryState<T>): HistoryState<T> {
  if (state.future.length === 0) return state;
  const next = state.future[0];
  const remainingFuture = state.future.slice(1);
  return {
    past: [...state.past, state.present],
    present: next,
    future: remainingFuture
  };
}
