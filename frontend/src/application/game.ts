import { stateRepository } from '../infrastructure/stateRepository';
import { auth } from './auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { asyncTap } from '../rxjs-utils';

interface GameState {
  players: any[];
}

const store = {
  state: new BehaviorSubject<GameState>({
    players: [],
  }),
};

const ensureGame = async ({ gameId }: any) => {
  await stateRepository.ensureGame(gameId);
};

const join = async ({ gameId, user }: any) => {
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
        return Observable.create((subscriber: any) => {
          stateRepository.onStateChange(gameId, (state: any) => subscriber.next(state));
        });
      }),
      takeUntil(auth.logout$),
    ).subscribe(store.state as any);
  },
  state: store.state.asObservable(),
};
