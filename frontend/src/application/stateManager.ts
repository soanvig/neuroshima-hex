import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { filter, map, mapTo, switchMap } from 'rxjs/operators';
import { compact } from '../../utils/rxjs';
import { Game } from '../domain/Game';
import { stateRepository } from '../infrastructure/stateRepository';
import { auth } from './auth';

const store = {
  remoteState: new BehaviorSubject<Game>(Game.create()),
  localState: new BehaviorSubject<Game>(Game.create()),
};

const sendStateSubject = new Subject<void>();

const initRemoteStateUpdate = (gameId: string) => {
  const sub = new Observable<Game | null>((subscriber) => {
    stateRepository.onStateChange(gameId, (state: Game | null) => subscriber.next(state));
  }).pipe(
    compact(), // this may be undefined in firebase on init
  ).subscribe(store.remoteState);

  return () => sub.unsubscribe();
};

/**
 * Update local state whenever remote store is updated and the version is greater
 */
const initRemoteToLocalStateUpdate = () => {
  const sub = store.remoteState.pipe(
    filter(state => state.getVersion() > store.localState.value.getVersion()),
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
  const subLocal = store.localState.subscribe(state => console.log(`Local state updated: ${state.getVersion()}`));
  const subRemote = store.remoteState.subscribe(state => console.log(`Remote state updated: ${state.getVersion()}`));

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
    store.localState.next(state);
  },
  send: () => sendStateSubject.next(),
};