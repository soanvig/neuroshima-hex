import { sample } from 'lodash';
import { sampleTokenId } from './tokens';
import { areVectorsEqual, getNeutralDirection, getRandomDirection, Vector, generatePossibleVectors } from './Vector';

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

type StringifiedBoard = { size: number, tiles: Tile[] };

export class Board {
  private size: number;
  private tiles: Tile[];

  private constructor(ctor: { tiles: Tile[], size: number }) {
    this.tiles = ctor.tiles;
    this.size = ctor.size;
  }

  public getRandomTile(): Tile {
    return sample(this.tiles)!;
  }

  public getToken(vector: Vector): Token | null {
    return this.tiles.find(tile => areVectorsEqual(tile.pos, vector))?.token ?? null;
  }

  public placeToken(pos: Vector, tokenId: string) {
    const index = this.tiles.findIndex(tile => areVectorsEqual(tile.pos, pos));
    const tile = this.tiles[index];

    if (tile.token) {
      throw new Error(`Cannot place token on existing token ${pos}`);
    }

    tile.token = {
      id: tokenId,
      direction: getNeutralDirection(),
    };
  }

  public rotateToken(pos: Vector, direction: Vector) {
    const index = this.tiles.findIndex(tile => areVectorsEqual(tile.pos, pos));
    const tile = this.tiles[index];

    if (!tile.token) {
      throw new Error(`Cannot rotate not existing token ${pos}`);
    }

    tile.token.direction = direction;
  }

  public toJSON(): string {
    return JSON.stringify({
      tiles: this.tiles,
      size: this.size,
    } as StringifiedBoard);
  }

  public static fromJSON(json: string): Board {
    const data: StringifiedBoard = JSON.parse(json);

    return new Board({
      tiles: data.tiles,
      size: data.size,
    });
  }

  public static empty(size: number): Board {
    const min = -1 * (size - 1);
    const max = size - 1;

    return new Board({
      size,
      tiles: generatePossibleVectors(min, max).map(pos => ({
        pos,
        token: null,
      })),
    });
  }
}