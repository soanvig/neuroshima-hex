import { stateRepository } from '../infrastructure/stateRepository';
import { auth } from './auth';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { filter, map, mapTo, switchMap, takeUntil } from 'rxjs/operators';
import { asyncTap } from '../rxjs-utils';
import { createGame, Game, randomizeBoard, updateGameVersion } from '../domain/Game';
import { User } from '../domain/User';

const getGameId = (): string => {
  const queryParams = new URLSearchParams(window.location.search);
  const gameId = queryParams.get('gameId');

  return gameId!; // this is verified during system init
};

const store = {
  gameId: '',
  remoteState: new BehaviorSubject<Game>(createGame()),
  localState: new BehaviorSubject<Game>(createGame()),
};

const sendStateSubject = new Subject<void>();

interface InitParams {
  gameId: string;
  user: User;
}

const ensureGame = async ({ gameId }: InitParams) => {
  await stateRepository.ensureGame(gameId);
};

const join = async ({ gameId, user }: InitParams) => {
  await stateRepository.addPlayer(gameId, user.email);
};

const initRemoteStateUpdate = () => {
  auth.login$.pipe(
    map(user => ({
      gameId: store.gameId,
      user,
    })),
    asyncTap(ensureGame),
    asyncTap(join),
    switchMap(({ gameId }) => new Observable<Game>((subscriber) => {
      stateRepository.onStateChange(gameId, (state: Game) => subscriber.next(state));
    })),
    takeUntil(auth.logout$),
  ).subscribe(store.remoteState);
};

/**
 * Update local state whenever remote store is updated and the version is greater
 */
const initRemoteToLocalStateUpdate = () => {
  store.remoteState.pipe(
    filter(state => state.version > store.localState.value.version),
  ).subscribe(store.localState);
};

/**
 * Sends state to remote, after it is updated locally and sendState is clicked
 */
const initLocalStateSend = () => {
  store.localState.pipe(
    switchMap(state => sendStateSubject.pipe(mapTo(state))), // wait for sendStateSubject
    switchMap(state => from(stateRepository.saveState(store.gameId, state))),
  ).subscribe();
};

const initStateLogging = () => {
  store.localState.subscribe(state => console.log(`Local state updated: ${state.version}`));
  store.remoteState.subscribe(state => console.log(`Remote state updated: ${state.version}`));
};

export const game = {
  init() {
    store.gameId = getGameId();

    initRemoteStateUpdate();
    initRemoteToLocalStateUpdate();
    initLocalStateSend();
    initStateLogging();
  },
  state$: store.localState.asObservable(),
  updateLocalState: (state: Game) => {
    store.localState.next(updateGameVersion(state));
  },
  sendState: () => sendStateSubject.next(),
  randomizeBoard: () => {
    game.updateLocalState(randomizeBoard(store.localState.value));
  },
  getGameId,
};
