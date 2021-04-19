import { Board } from './Board';

export interface Game {
  players: string[];
  board: Board;
}