import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { filter, mapTo, switchMap } from 'rxjs/operators';
import { createGame, Game, updateGameVersion } from '../domain/Game';
import { stateRepository } from '../infrastructure/stateRepository';

const store = {
  remoteState: new BehaviorSubject<Game>(createGame()),
  localState: new BehaviorSubject<Game>(createGame()),
};

const sendStateSubject = new Subject<void>();

const initRemoteStateUpdate = (gameId: string) => {
  const sub = new Observable<Game>((subscriber) => {
    stateRepository.onStateChange(gameId, (state: Game) => subscriber.next(state));
  }).pipe(
    filter(v => Boolean(v)), // this may be undefined in firebase on nit
  ).subscribe(store.remoteState);

  return () => sub.unsubscribe();
};

/**
 * Update local state whenever remote store is updated and the version is greater
 */
const initRemoteToLocalStateUpdate = () => {
  const sub = store.remoteState.pipe(
    filter(state => state.version > store.localState.value.version),
  ).subscribe(store.localState);

  return () => sub.unsubscribe();
};

/**
 * Sends state to remote, after it is updated locally and sendState is clicked
 */
const initLocalStateSend = (gameId: string) => {
  const sub = store.localState.pipe(
    switchMap(state => sendStateSubject.pipe(mapTo(state))), // wait for sendStateSubject
    switchMap(state => from(stateRepository.saveState(gameId, state))),
  ).subscribe();

  return () => sub.unsubscribe();
};

const initStateLogging = () => {
  const subLocal = store.localState.subscribe(state => console.log(`Local state updated: ${state.version}`));
  const subRemote = store.remoteState.subscribe(state => console.log(`Remote state updated: ${state.version}`));

  return () => {
    subLocal.unsubscribe();
    subRemote.unsubscribe();
  };
};

export const stateManager = {
  state$: store.localState.asObservable(),
  remoteState$: store.remoteState.asObservable(),
  init(gameId: string) {
    const unsubs = [
      initRemoteStateUpdate(gameId),
      initLocalStateSend(gameId),
      initStateLogging(),
      initRemoteToLocalStateUpdate(),
    ];

    return () => unsubs.forEach(f => f());
  },
  getState() {
    return store.localState.value;
  },
  update: (state: Game) => {
    store.localState.next(updateGameVersion(state));
  },
  send: () => sendStateSubject.next(),
};