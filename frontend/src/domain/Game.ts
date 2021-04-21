import { Board } from './Board';
import { armies } from './tokens';
import { getRandomDirection } from './Vector';
import { Player, PlayerAttrs } from './Player';
import { sample } from 'lodash';

export const getNewVersion = () => Date.now(); // timestamped uuid

type Attrs = { version: number, players: PlayerAttrs[]; board: ReturnType<Board['toAttrs']> };

export class Game {
  private version: number;
  private players: Player[];
  private board: Board;

  private constructor(ctor: { version: number, players: Player[], board: Board }) {
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

    const player = sample(this.players);

    if (!player) {
      return;
    }

    player.placeRandomToken(tile.pos);

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
      players: this.players.map(p => p.toAttrs()),
      version: this.version,
    };
  }

  public static fromAttrs(attrs: Attrs): Game {
    return new Game({
      board: Board.fromAttrs(attrs.board),
      players: attrs.players.map(p => Player.fromAttrs(p)),
      version: attrs.version,
    });
  }

  public static create(): Game {
    return new Game({
      version: 0,
      players: [],
      board: Board.empty(3),
    });
  }

  addPlayer(param: { id: string }) {
    if (this.players.some(p => p.id === param.id)) {
      return;
    }

    this.version = getNewVersion();
    this.players.push(Player.create(
      param.id,
      armies[this.players.length % armies.length],
    ));
  }

  // test
  getBoard() {
    return Board.create({
      tiles: this.players.flatMap(p => p.getTilesOnBoard()),
    });
  }
}
