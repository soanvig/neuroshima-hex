import * as PIXI from 'pixi.js';
import * as Honeycomb from 'honeycomb-grid';
import { Board, getToken } from '../../domain/Board';
import { game } from '../../application/game';


interface Rendered {
  render(board: Board): void;
}

class PixiRendarer implements Rendered {
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
    const Hex = Honeycomb.extendHex({ size: 63, orientation: 'flat' })
    const Grid = Honeycomb.defineGrid(Hex);

    return Grid.hexagon({
      radius: 2,
    });
  }

  private initPixi() {
    const app = new PIXI.Application({
      transparent: true,
      // antialias: true,
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
      const hexSprite = PIXI.Sprite.from(token?.graphics);

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

      hexSprite.addListener('click', e => {
        console.log(hex);
      })

      hexSprite.addListener('mouseover', e => {
        hexSprite.alpha = 0.5;
      })

      hexSprite.addListener('mouseout', e => {
        hexSprite.alpha = 1;
      })

      this.boardContainer.addChild(hexSprite);
    });
  }

  mount() {
    document.querySelector('#board')!.appendChild(this.app.view)
  }
}

export const init = () => {
  const renderer = new PixiRendarer();

  renderer.mount()

  game.state.subscribe(a => {
    renderer.render(a.board);
  });
}
