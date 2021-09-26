import type { Renderer } from './Renderer';
import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import * as Honeycomb from 'honeycomb-grid';
import { OutlineFilter } from '@pixi/filter-outline';
import cursor from '../assets/cursor.png';
import { TokensLayer } from './TokensLayer';
import { getTokenGraphics } from '../domain/tokens';

const outlineFilterBlue = new OutlineFilter(2, 0x807054);


class ArmiesLayer {
  public readonly layer = new PIXI.Container();
  private renderedTokens: any = {};
  private onArmyClick: (armyId: string) => void;

  constructor({
    onArmyClick,
  }: {
    onArmyClick: (armyId: string) => void;
  }) {
    this.onArmyClick = onArmyClick;
    this.layer.pivot.set(0.5);
  }

  update(armies: any[]) {
    armies.forEach((army, index) => {
      let currentToken = this.renderedTokens[army.id];

      if (!currentToken) {
        const hexSprite = PIXI.Sprite.from(getTokenGraphics(`${ army.id }-sztab` as any));

        const hitPolygon = new PIXI.Polygon(75, 0, 37.5, 64.9519052838329, -37.5, 64.9519052838329, -75, 0, -37.5, -64.9519052838329, 37.5, -64.9519052838329);

        hexSprite.interactive = true;
        hexSprite.anchor.set(0.5);
        hexSprite.x = army.position[0];
        hexSprite.y = army.position[1];
        hexSprite.hitArea = hitPolygon;
        hexSprite.rotation = 0;
        hexSprite.zIndex = index;

        currentToken = hexSprite;

        this.renderedTokens[army.id] = currentToken;

        hexSprite.on('click', () => {
          this.onArmyClick(army.id);
        });

        const text = new PIXI.Text(army.tokensLeft, {
          fontFamily: 'Arial',
          fontSize: 56,
          fill: 0xffffff,
          align: 'center',
          fontWeight: '500',
          strokeThickness: 4,
        });

        text.anchor.set(0.5);

        hexSprite.addChild(text);
        (hexSprite as any).text = text;

        this.layer.addChild(hexSprite);
      }

      (currentToken as any).text.text = army.tokensLeft;
    });
  }
}


export class PixiRenderer implements Renderer {
  private grid: Honeycomb.Grid;
  private app: PIXI.Application;
  private boardContainer = new PIXI.Container();
  private gridLayer = new PIXI.Container();
  private tokensLayer: TokensLayer;
  private armiesLayer: ArmiesLayer;
  private cursorsLayer = new PIXI.Container();

  constructor({
    onCursorMove,
    onTokenChange,
    onArmyClick,
  }: any = {}) {
    this.grid = this.initGrid();
    this.app = this.initPixi();

    this.tokensLayer = new TokensLayer(
      this.boardContainer,
      onTokenChange,
    );

    this.armiesLayer = new ArmiesLayer({
      onArmyClick,
    });

    this.boardContainer.x = this.app.screen.width / 2;
    this.boardContainer.y = this.app.screen.height / 2;
    // this.boardContainer.scale.set(1, -1);
    this.boardContainer.interactive = true;
    this.gridLayer.pivot.set(0.5);
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyE') {
        // todo: dodać metodę rotate do tokensLayer
        this.tokensLayer.layer.rotation += Math.PI / 6;
        this.gridLayer.rotation += Math.PI / 6;
      }
    });

    this.boardContainer.on('mousemove', (e) => {
      const localPos = e.data.getLocalPosition(this.boardContainer);
      onCursorMove(localPos.x, localPos.y);
    });

    this.boardContainer.addChild(this.gridLayer);
    this.boardContainer.addChild(this.tokensLayer.layer);
    this.boardContainer.addChild(this.armiesLayer.layer);
    this.boardContainer.addChild(this.cursorsLayer);

    this.initViewport();
    this.drawGrid();
  }

  private initGrid() {
    const Hex = Honeycomb.extendHex({ size: 75, orientation: 'flat' });
    const Grid = Honeycomb.defineGrid(Hex);

    return Grid.hexagon({
      radius: 2,
    });
  }

  private initPixi() {
    const app = new PIXI.Application({
      transparent: true,
      antialias: true,
      resizeTo: window,
    });

    return app;
  }

  private initViewport() {
    const viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: 1000,
      worldHeight: 1000,
      interaction: this.app.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    });

    viewport
      .drag({
        keyToPress: ['ShiftLeft', 'ShiftRight'],
      })
      .wheel();

    viewport.addChild(this.boardContainer);

    this.app.stage.addChild(viewport);
  }

  render(state: { cursors: string[]; tokens: any, armies: any }, onTokenChange: any) {

    this.cursorsLayer.removeChildren();

    this.tokensLayer.update(Object.values(state.tokens));
    this.armiesLayer.update(Object.values(state.armies));

    this.drawCursors(state.cursors);
  }

  mount(element: Element) {
    element.appendChild(this.app.view);
  }

  private drawCursors(cursors: string[]) {
    cursors.forEach(c => {
      const [x, y] = c.split(',');

      const cursorSprite = PIXI.Sprite.from(cursor);

      cursorSprite.x = parseInt(x, 10);
      cursorSprite.y = parseInt(y, 10);
      cursorSprite.height = 20;
      cursorSprite.width = 20;

      this.cursorsLayer.addChild(cursorSprite);
    });
  }

  private drawGrid() {
    this.gridLayer.removeChildren();

    this.grid.forEach(hex => {
      const hexOrigin = hex.toPoint();

      const gridFieldPolygon = new PIXI.Polygon(...hex.corners().map(corner => {
        return new PIXI.Point(corner.x - hex.center().x, corner.y - hex.center().y);
      }));

      const gridField = new PIXI.Graphics();
      gridField.beginFill(0x000);
      gridField.drawPolygon(gridFieldPolygon);
      gridField.alpha = 0.8;
      gridField.pivot.set(gridField.width / 2, gridField.height / 2);
      gridField.scale.set(0.95, 0.95);
      gridField.x = hexOrigin.x + hex.center().x;
      gridField.y = hexOrigin.y + hex.center().y;
      gridField.filters = [outlineFilterBlue];

      this.gridLayer.addChild(gridField);
    });
  }
}
