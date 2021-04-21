import { stateRepository } from '../infrastructure/stateRepository';
import { auth } from './auth';
import { map } from 'rxjs/operators';
import { asyncTap } from '../rxjs-utils';
import type { User } from '../domain/User';
import { stateManager } from './stateManager';

const getGameId = (): string => {
  const queryParams = new URLSearchParams(window.location.search);
  const gameId = queryParams.get('gameId');

  return gameId!; // this is verified during system init
};

const initSetup = (gameId: string) => {
  const sub = auth.login$.pipe(
    map(user => ({
      gameId,
      user,
    })),
    asyncTap(async ({ gameId, user }) => {
      const game = await stateRepository.getOrCreate(gameId);

      game.addPlayer({
        id: user.email,
      });

      await stateRepository.saveState(gameId, game);
    }),
  ).subscribe();

  return () => sub.unsubscribe();
};

interface InitParams {
  gameId: string;
  user: User;
}

const join = async ({ gameId, user }: InitParams) => {
  await stateRepository.addPlayer(gameId, user.email);
};

export const game = {
  init(gameId: string) {

    initSetup(gameId);
  },
  placeRandomToken: () => {
    const user = auth.getUser();

    if (!user) {
      return;
    }

    const state = stateManager.getState();

    state.placeRandomToken(user.email);
    stateManager.update(state);
  },
  rotateRandomToken: () => {
    const state = stateManager.getState();

    state.rotateRandomToken();
    stateManager.update(state);
  },
  getGameId,
};
