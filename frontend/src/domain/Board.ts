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

interface Token {
  id: string;
  direction: Vector;
}

export type Board = Tile[];

export const getBoard = (size: number): Board => {
  const min = -1 * Math.floor(size / 2);
  const max = Math.ceil(size / 2);

  return combinate({
    x: range(min, max),
    y: range(min, max),
    z: range(min, max),
  }).map(pos => ({ pos, token: null }));
}

export const getToken = (board: Board) => (vector: Vector): Token | null => {
  return board.find(tile => (
    tile.pos.x === vector.x
    && tile.pos.y === vector.y
    && tile.pos.z === vector.z
  ))?.token ?? null;
}
