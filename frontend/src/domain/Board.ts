import combinate from 'combinate';
import { range, sample } from 'lodash';
import { sampleTokenId } from './tokens';

export interface Vector {
  x: number;
  y: number;
  z: number;
}

interface Tile {
  pos: Vector;
  token: Token | null;
}

// Token scaffolding
export interface BaseToken {
  id: string;
  graphics: string;
}

// Ingame token
export interface Token {
  id: string;
  direction: Vector;
}

const generatePossibleVectors = (min: number, max: number) => combinate({
  x: range(min, max + 1),
  y: range(min, max + 1),
  z: range(min, max + 1),
}).filter(pos => (
  pos.x + pos.y + pos.z === 0
));

export const getNeutralDirection = () => ({ x: 0, y: -1, z: 1 });
const getRandomDirection = () => sample(generatePossibleVectors(-1, 1).filter(pos => !areVectorsEqual(pos, { x: 0, y: 0, z: 0 })))!;

export type Board = Tile[];

const areVectorsEqual = (v1: Vector, v2: Vector): boolean => (
  v1.x === v2.x
    && v1.y === v2.y
    && v1.z === v2.z
);

export const getBoard = (size: number): Board => {
  const min = -1 * (size - 1);
  const max = size - 1;

  return generatePossibleVectors(min, max).map(pos => ({ pos, token: null }));
};

export const getToken = (board: Board) => (vector: Vector): Token | null => {
  return board.find(tile => areVectorsEqual(tile.pos, vector))?.token ?? null;
};

const mapBoard = (board: Board, filter: (v: Tile) => boolean, cb: (v: Tile) => Tile): Board => {
  return board.map(tile => {
    if (filter(tile)) {
      return cb(tile);
    } else {
      return tile;
    }
  });
};

export const replaceToken = (board: Board, pos: Vector, tokenId: string): Board => mapBoard(
  board,
  tile => areVectorsEqual(tile.pos, pos),
  tile => ({
    ...tile,
    token: {
      id: tokenId,
      direction: tile.token ? tile.token.direction : getNeutralDirection(),
    },
  }),
);

export const rotateToken = (board: Board, pos: Vector): Board => mapBoard(
  board,
  tile => areVectorsEqual(tile.pos, pos),
  tile => ({
    ...tile,
    token: {
      id: tile.token ? tile.token.id : sampleTokenId(),
      direction: getRandomDirection(),
    },
  }),
);