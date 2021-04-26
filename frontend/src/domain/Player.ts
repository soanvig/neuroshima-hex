import { without } from 'lodash';
import type { Vector } from './Vector';
import { getNeutralDirection } from './Vector';
import type { PlayerTokenAttrs } from './PlayerToken';
import { PlayerToken } from './PlayerToken';
import type { Army } from './tokens';

export interface PlayerAttrs {
  id: string;
  points: number;
  hand: PlayerTokenAttrs[];
  graveyard: PlayerTokenAttrs[];
  onBoard: PlayerTokenAttrs[];
  deck: PlayerTokenAttrs[];
}

export class Player {
  private MAX_HAND_SIZE = 3;

  public id: string;
  public points: number = 0;
  private hand: PlayerToken[];
  private graveyard: PlayerToken[];
  private onBoard: PlayerToken[];
  private deck: PlayerToken[];

  private constructor(
    id: string,
    points: number,
    hand: PlayerToken[],
    graveyard: PlayerToken[],
    onBoard: PlayerToken[],
    deck: PlayerToken[],
  ) {
    this.id = id;
    this.points = points;
    this.hand = hand;
    this.graveyard = graveyard;
    this.onBoard = onBoard;
    this.deck = deck;
  }

  public static create(
    id: string,
    army: Army,
  ) {
    return new Player(
      id,
      0,
      [],
      [],
      [],
      army.tokens.map(t => PlayerToken.create(t)),
    );
  }

  public static fromAttrs(attrs: PlayerAttrs) {
    return new Player(
      attrs.id,
      attrs.points,
      attrs.hand.map(t => PlayerToken.fromAttrs(t)),
      attrs.graveyard.map(t => PlayerToken.fromAttrs(t)),
      attrs.onBoard.map(t => PlayerToken.fromAttrs(t)),
      attrs.deck.map(t => PlayerToken.fromAttrs(t)),
    );
  }

  public toAttrs(): PlayerAttrs {
    return {
      id: this.id,
      deck: this.deck.map(t => t.toAttrs()),
      hand: this.hand.map(t => t.toAttrs()),
      onBoard: this.onBoard.map(t => t.toAttrs()),
      graveyard: this.graveyard.map(t => t.toAttrs()),
      points: this.points,
    };
  }

  public getHand(): PlayerToken[] {
    return this.hand;
  }

  public drawToken() {
    const token = this.deck.pop();

    if (!token) {
      console.warn('Token cannot be found');
      return;
    }

    this.hand.push(token);
    this.deck = without(this.deck, token);

    return token;
  }

  public placeRandomToken(pos: Vector) {
    const token = this.drawToken();

    if (!token) {
      return;
    }

    this.putTokenOnBoard(token.id, pos);
  }

  public putTokenOnBoard(id: string, position: Vector) {
    const token = this.findTokenInHand(id);

    if (!token) {
      console.warn('Token cannot be found');
      return false;
    }

    token.setPosition(position);

    this.hand = without(this.hand, token);
    this.onBoard.push(token);
  }

  public rotateToken() {

  }

  public flipToken(id: string) {
    const token = this.findTokenOnBoardById(id);

    if (!token) {
      console.warn('Token cannot be found');
      return false;
    }

    token.flip();

    return true;
  }

  public killToken(id: string): boolean {
    const token = this.findTokenOnBoardById(id);

    if (!token) {
      console.warn('Token cannot be found');
      return false;
    }

    this.onBoard = without(this.onBoard, token);
    this.graveyard.push(token);

    return true;
  }

  public addPoints(amount: number) {
    this.points += amount;
  }

  public subtractPoints(amount: number) {
    this.points -= amount;
  }

  private findTokenOnBoardById(id: string) {
    return this.onBoard.find(token => token.id === id);
  }

  private findTokenInHand(id: string) {
    return this.hand.find(token => token.id === id);
  }

  public getTilesOnBoard() {
    return this.onBoard.map(t => ({
      pos: t.position,
      token: {
        id: t.token.id,
        direction: getNeutralDirection(),
      },
    }));
  }
}
