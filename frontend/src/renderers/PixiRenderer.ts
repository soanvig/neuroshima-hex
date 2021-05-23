import type { Renderer } from './Renderer';
import * as PIXI from 'pixi.js';
import * as Honeycomb from 'honeycomb-grid';
import { OutlineFilter } from '@pixi/filter-outline';
import type { Board } from '../domain/Board';
import { getTokenGraphics, others } from '../domain/tokens';
import type { Vector } from '../domain/Vector';
import { throttle } from 'lodash';
import { game } from '../application/game';

const outlineFilterBlue = new OutlineFilter(4, 0x99ff99);

export class PixiRenderer implements Renderer {
  private grid: Honeycomb.Grid;
  private app: PIXI.Application;
  private boardContainer = new PIXI.Container();

  constructor() {
    this.grid = this.initGrid();
    this.app = this.initPixi();

    this.boardContainer.x = this.app.screen.width / 2;
    this.boardContainer.y = this.app.screen.height / 2;
    this.boardContainer.pivot.y = this.grid.pointWidth() / 2;
    this.boardContainer.pivot.x = this.grid.pointHeight() / 2;

    this.app.stage.addChild(this.boardContainer);
  }

  private initGrid() {
    const Hex = Honeycomb.extendHex({ size: 65, orientation: 'flat' });
    const Grid = Honeycomb.defineGrid(Hex);

    return Grid.hexagon({
      radius: 2,
    });
  }

  private initPixi() {
    const app = new PIXI.Application({
      transparent: true,
      antialias: true,
      width: 800,
      height: 600,
      resolution: window.devicePixelRatio || 1,
    });

    return app;
  }

  render(board: Board) {
    this.boardContainer.removeChildren();

    this.grid.forEach(hex => {
      const cube = hex.cube();

      const token = board.getToken({
        x: cube.q,
        y: cube.r,
        z: cube.s,
      });

      if (!token) {
        const mask = PIXI.Sprite.from(others.mask);
        const maskOrigin = hex.toPoint();

        mask.anchor.set(0.5);
        mask.x = maskOrigin.x + this.grid.pointWidth() / 2;
        mask.y = maskOrigin.y + this.grid.pointHeight() / 2;

        this.boardContainer.addChild(mask);

        return;
      }

      const hexOrigin = hex.toPoint();
      const hexSprite = PIXI.Sprite.from(getTokenGraphics(token.id));

      hexSprite.interactive = true;
      hexSprite.anchor.set(0.5);


      const hitPolygon = new PIXI.Polygon(...hex.corners().map(corner => {
        return new PIXI.Point(corner.x - hex.center().x, corner.y - hex.center().y);
      }));
      hexSprite.hitArea = hitPolygon;

      // UNCOMMENT TO DEBUG HIT AREAS
      // const g = new PIXI.Graphics();
      // g.beginFill(0xF0F0F0);
      // g.drawPolygon(hitPolygon);
      // hexSprite.addChild(g);

      hexSprite.x = hexOrigin.x + this.grid.pointWidth() / 2;
      hexSprite.y = hexOrigin.y + this.grid.pointHeight() / 2;
      hexSprite.rotation = this.mapDirectionToRotation(token.direction);

      hexSprite.addListener('click', e => {
        console.log(hex);
      });

      hexSprite.addListener('mouseover', e => {
        hexSprite.filters = [outlineFilterBlue];
      });

      hexSprite.addListener('mouseout', e => {
        hexSprite.filters = [];
      });

      const onDown = () => {
        document.addEventListener('mouseup', onUp);
        hexSprite.addListener('mousemove', onMove);
      };

      const onMove = throttle((e: PIXI.InteractionEvent) => {
        const local = e.data.getLocalPosition(this.boardContainer);
        const x = local.x - hexSprite.x;
        const y = local.y - hexSprite.y;

        const angle = Math.atan2(y, x);
        const roundTo = Math.PI / 3;
        const rotation = Math.round(angle / roundTo) * roundTo;

        hexSprite.rotation = rotation;
      }, 25);

      const onUp = () => {
        document.removeEventListener('mouseup', onUp);
        hexSprite.removeListener('mousemove', onMove);

        const realDirection = Math.floor(hexSprite.rotation / Math.PI * 3);

        const direction = realDirection < 0 ? 6 - realDirection : realDirection;

        // @TODO Use real token id, not the general one
        // game.rotateToken(token.id, direction);
      };

      hexSprite.addListener('mousedown', onDown);


      this.boardContainer.addChild(hexSprite);
    });
  }

  mount(element: Element) {
    element.appendChild(this.app.view);
  }

  private mapDirectionToRotation(direction: number): number {
    return direction * 60 * Math.PI / 180;
  }
}
