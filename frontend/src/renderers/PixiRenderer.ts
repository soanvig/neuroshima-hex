import type { Renderer } from './Renderer';
import * as PIXI from 'pixi.js';
import * as Honeycomb from 'honeycomb-grid';
import { sample } from 'lodash';
import { OutlineFilter } from '@pixi/filter-outline';
import { Board, getToken } from '../domain/Board';
import { getTokenGraphics } from '../domain/tokens';

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
    this.boardContainer.pivot.y = this.boardContainer.height / 2;
    this.boardContainer.pivot.x = this.boardContainer.width / 2;
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
      backgroundColor: 0x1099bb,
      resolution: window.devicePixelRatio || 1,
    });

    return app;
  }

  render(board: Board) {
    this.boardContainer.removeChildren();

    this.grid.forEach(hex => {
      const cube = hex.cube();

      const token = getToken(board)({
        x: cube.q,
        y: cube.r,
        z: cube.s,
      })!;

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
      // g.beginFill(0x000)
      // g.drawPolygon(hitPolygon)
      // hexSprite.addChild(g);

      hexSprite.x = hexOrigin.x + hex.center().x;
      hexSprite.y = hexOrigin.y + hex.center().y;
      hexSprite.rotation = sample([0, 120, 60, 180, 240, 300])! * Math.PI / 180;

      hexSprite.addListener('click', e => {
        console.log(hex);
      });

      hexSprite.addListener('mouseover', e => {
        hexSprite.filters = [outlineFilterBlue];
      });

      hexSprite.addListener('mouseout', e => {
        hexSprite.filters = [];
      });

      this.boardContainer.addChild(hexSprite);
    });
  }

  mount(element: Element) {
    element.appendChild(this.app.view);
  }
}