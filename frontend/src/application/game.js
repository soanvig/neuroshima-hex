import { stateRepository } from '../infrastructure/stateRepository.js';
import { auth } from './auth.js';
import { asyncTap, map, RxJS, switchMap, takeUntil } from '../rxjs.js';

const store = {
  state: new RxJS.BehaviorSubject({
    players: [],
  }),
};

const ensureGame = async ({ gameId }) => {
  await stateRepository.ensureGame(gameId);
};

const join = async ({ gameId, user }) => {
  await stateRepository.addPlayer(gameId, user.email);
};

export const game = {
  init() {
    auth.login$.pipe(
      map(user => {
        const queryParams = new URLSearchParams(window.location.search);
        const gameId = queryParams.get('gameId');

        if (!gameId) {
          window.alert('No gameId defined man, gtfo');
          throw new Error('No gameId defined man, gtfo');
        }

        return {
          gameId,
          user,
        };
      }),
      asyncTap(ensureGame),
      asyncTap(join),
      switchMap(({ gameId }) => {
        return RxJS.Observable.create(subscriber => {
          stateRepository.onStateChange(gameId, state => subscriber.next(state));
        });
      }),
      takeUntil(auth.logout$),
    ).subscribe(store.state);
  },
  state: store.state.asObservable(),
};
