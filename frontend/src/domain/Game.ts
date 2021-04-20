import { v1 } from 'uuid';
import { Board, getBoard } from './Board';
import { sampleTokenId } from './tokens';

export interface Game {
  version: string;
  players: string[];
  board: Board;
}

export const createGame = (): Game => ({
  version: '',
  players: [],
  board: getBoard(3).map(tile => ({
    ...tile,
    token: ({
      id: sampleTokenId(),
      direction: { x: 0, y: -1, z: 1 },
    })
  })),
});

export const updateGameVersion = (game: Game): Game => ({
  ...game,
  version: v1(), // timestamped uuid
});

export const randomizeBoard = (game: Game): Game => updateGameVersion({
  ...game,
  board: getBoard(3).map(tile => ({
    ...tile,
    token: ({
      id: sampleTokenId(),
      direction: { x: 0, y: -1, z: 1 },
    })
  })),
})