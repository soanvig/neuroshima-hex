import { v1 } from 'uuid';
import { Board, getBoard, getNeutralDirection, replaceToken, rotateToken, Vector } from './Board';
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
      direction: getNeutralDirection(),
    }),
  })),
});

export const getNewVersion = () => v1(); // timestamped uuid

export const updateGameVersion = (game: Game): Game => ({
  ...game,
  version: getNewVersion(),
});

export const randomizeBoard = (game: Game): Game => updateGameVersion({
  ...game,
  board: getBoard(3).map(tile => ({
    ...tile,
    token: ({
      id: sampleTokenId(),
      direction: { x: 0, y: -1, z: 1 },
    }),
  })),
});

export const placeToken = (game: Game) => (pos: Vector, tokenId: string): Game => ({
  ...game,
  board: replaceToken(game.board, pos, tokenId),
});

export const randomTokenRotate = (game: Game) => (pos: Vector): Game => ({
  ...game,
  board: rotateToken(game.board, pos),
});