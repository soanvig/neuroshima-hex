import { v1 } from 'uuid';
import { Board } from './Board';
import { sampleTokenId } from './tokens';
import { getRandomDirection } from './Vector';

export interface Game {
  version: string;
  players: string[];
  board: Board;
}

export const createGame = (): Game => ({
  version: '',
  players: [],
  board: Board.empty(3),
});

export const getNewVersion = () => v1(); // timestamped uuid

export const updateGameVersion = (game: Game): Game => ({
  ...game,
  version: getNewVersion(),
});

export const placeRandomToken = (game: Game): Game => {
  game.board.placeToken(game.board.getRandomTile().pos, sampleTokenId());

  return game;
};

export const randomTokenRotate = (game: Game): Game => {
  game.board.rotateToken(game.board.getRandomTile().pos, getRandomDirection());

  return game;
};