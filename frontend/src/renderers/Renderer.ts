import type { Board } from '../domain/Board';

export interface Renderer {
  render(board: Board): void;
}