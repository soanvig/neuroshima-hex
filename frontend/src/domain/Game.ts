import { Board } from './Board';
import { armies } from './tokens';
import { Player, PlayerAttrs } from './Player';

export const getNewVersion = () => Date.now(); // timestamped uuid

type Attrs = { version: number, players: PlayerAttrs[]; };

export class Game {
  private version: number;
  private players: Player[];

  private constructor(ctor: { version: number, players: Player[] }) {
    this.version = ctor.version;
    this.players = ctor.players;
  }

  public getVersion() {
    return this.version;
  }

  public placeRandomToken(userId: string) {
    const board = this.getBoard();
    const tile = board.getRandomEmptyTile();

    if (!tile) {
      return;
    }

    const player = this.players.find(p => p.id === userId);

    if (!player) {
      return;
    }

    player.placeRandomToken(tile.pos);

    this.version = getNewVersion();
  }

  public rotateRandomToken() {
  }

  public toAttrs(): Attrs {
    return {
      players: this.players.map(p => p.toAttrs()),
      version: this.version,
    };
  }

  public static fromAttrs(attrs: Attrs): Game {
    return new Game({
      players: attrs.players.map(p => Player.fromAttrs(p)),
      version: attrs.version,
    });
  }

  public static create(): Game {
    return new Game({
      version: 0,
      players: [],
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
