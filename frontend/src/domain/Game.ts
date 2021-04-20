import { v1 } from 'uuid';
import { Board } from './Board';
import { sampleTokenId } from './tokens';
import { getRandomDirection } from './Vector';

export const getNewVersion = () => v1(); // timestamped uuid

type Attrs = { version: string, players: string[]; board: ReturnType<Board['toAttrs']> };

export class Game {
  private version: string;
  private players: string[];
  private board: Board;

  private constructor(ctor: { version: string, players: string[], board: Board }) {
    this.version = ctor.version;
    this.players = ctor.players;
    this.board = ctor.board;
  }

  public getVersion() {
    return this.version;
  }

  public placeRandomToken() {
    const tile = this.board.getRandomEmptyTile();

    if (!tile) {
      return;
    }

    this.board.placeToken(
      tile.pos,
      sampleTokenId(),
    );

    this.version = getNewVersion();
  }

  public rotateRandomToken() {
    const tile = this.board.getRandomFilledTile();

    if (!tile) {
      return;
    }

    this.board.rotateToken(
      tile.pos,
      getRandomDirection(),
    );

    this.version = getNewVersion();
  }

  public toAttrs(): Attrs {
    return {
      board: this.board.toAttrs(),
      players: this.players,
      version: this.version,
    };
  }

  public static fromAttrs(attrs: Attrs): Game {
    return new Game({
      board: Board.fromAttrs(attrs.board),
      players: attrs.players,
      version: attrs.version,
    });
  }

  public static create(): Game {
    return new Game({
      version: getNewVersion(),
      players: [],
      board: Board.empty(3),
    });
  }
}