import { getNeutralDirection, Vector } from './Vector';
import type { BaseToken } from './Board';
import { getTokenById } from './tokens';
import { v4 } from 'uuid';

export interface PlayerTokenAttrs {
  id: string;
  tokenId: string;
  isFlipped: boolean;
  rotation: number;
  position: Vector;
}

export class PlayerToken {
  public readonly id: string;
  public token: BaseToken;
  private isFlipped: boolean = false;
  private rotation: number = 0;
  public position: Vector;

  public static fromAttrs(attrs: PlayerTokenAttrs) {
    return new PlayerToken(
      attrs.id,
      getTokenById(attrs.tokenId),
      attrs.rotation,
      attrs.position,
      attrs.isFlipped,
    );
  }

  public toAttrs(): PlayerTokenAttrs {
    return {
      id: this.id,
      tokenId: this.token.id,
      isFlipped: this.isFlipped,
      position: this.position,
      rotation: this.rotation,
    };
  }

  public static create(token: BaseToken) {
    return new PlayerToken(
      v4(),
      token,
      0,
      getNeutralDirection(),
      false,
    );
  }

  private constructor(
    id: string,
    token: BaseToken,
    rotation: number,
    position: Vector,
    isFlipped: boolean,
  ) {
    this.id = id;
    this.token = token;
    this.rotation = rotation;
    this.position = position;
    this.isFlipped = isFlipped;
  }

  flip() {
    this.isFlipped = !this.isFlipped;
  }

  setFaceUp() {
    this.isFlipped = false;
  }

  setFaceDown() {
    this.isFlipped = true;
  }

  rotateLeft() {
    this.rotation = (this.rotation - 1) % 6;
  }

  rotateRight() {
    this.rotation = (this.rotation + 1) % 6;
  }

  setRotation(newRotation: 0 | 1 | 2 | 3 | 4 | 5) {
    this.rotation = newRotation;
  }

  setPosition(position: Vector) {
    this.position = position;
  }
}
