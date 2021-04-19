import { stateRepository } from '../infrastructure/stateRepository';
import { auth } from './auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { asyncTap } from '../rxjs-utils';
import { Game } from '../domain/Game';
import { User } from '../domain/User';
import { getBoard } from '../domain/Board';

const store = {
  state: new BehaviorSubject<Game>({
    players: [],
    board: getBoard(3),
  }),
};

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
        return new Observable<Game>((subscriber) => {
          stateRepository.onStateChange(gameId, (state: Game) => subscriber.next(state));
        });
      }),
      takeUntil(auth.logout$),
    ).subscribe(store.state);
  },
  state: store.state.asObservable(),
};
