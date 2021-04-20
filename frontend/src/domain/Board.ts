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

type Attrs = { size: number, tiles: Tile[] };

export class Board {
  private size: number;
  private tiles: Tile[];

  private constructor(ctor: { tiles: Tile[], size: number }) {
    this.tiles = ctor.tiles;
    this.size = ctor.size;
  }

  public getRandomFilledTile(): Tile | null {
    return sample(this.tiles.filter(t => Boolean(t.token))) ?? null;
  }

  public getRandomEmptyTile(): Tile | null {
    return sample(this.tiles.filter(t => !Boolean(t.token))) ?? null;
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

  public toAttrs(): Attrs {
    return {
      tiles: this.tiles,
      size: this.size,
    };
  }

  public static fromAttrs(attrs: Attrs): Board {
    return new Board({
      tiles: attrs.tiles,
      size: attrs.size,
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