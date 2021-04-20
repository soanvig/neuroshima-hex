import combinate from "combinate";
import { range } from 'lodash';

interface Vector {
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

export type Board = Tile[];

export const getBoard = (size: number): Board => {
  const min = -1 * (size - 1);
  const max = size - 1;

  return combinate({
    x: range(min, max + 1),
    y: range(min, max + 1),
    z: range(min, max + 1),
  }).filter(pos => (
    pos.x + pos.y + pos.z === 0
  )).map(pos => ({ pos, token: null }));
}

export const getToken = (board: Board) => (vector: Vector): Token | null => {
  return board.find(tile => (
    tile.pos.x === vector.x
    && tile.pos.y === vector.y
    && tile.pos.z === vector.z
  ))?.token ?? null;
}
