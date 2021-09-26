import * as PIXI from 'pixi.js';
import { getTokenGraphics, getTokenHitArea } from '../domain/tokens';
import { throttle } from 'lodash';
import { OutlineFilter } from '@pixi/filter-outline';
import { DropShadowFilter } from '@pixi/filter-drop-shadow';
import { GlowFilter } from '@pixi/filter-glow';

type OnTokenChange = (token: any) => void;

const outlineFilterBlue = new OutlineFilter(2, 0x99ff99);
const dropShadowFilter = new DropShadowFilter();
dropShadowFilter.color = 0x000000;
dropShadowFilter.alpha = 1;
dropShadowFilter.blur = 3;
dropShadowFilter.distance = 0;

const glowFilter = new GlowFilter();
glowFilter.color = 0x000000;

let hovered: string | undefined;

export class TokensLayer {
  public readonly layer = new PIXI.Container();
  private readonly tokensLayer = new PIXI.Container();
  private readonly markersLayer = new PIXI.Container();
  private readonly terrainLayer = new PIXI.Container();

  private draggingRegister: Record<string, boolean> = {};
  private renderedTokens: any = {};
  private readonly parent: PIXI.Container;
  private readonly onTokenChange: OnTokenChange;

  constructor(
    parent: PIXI.Container,
    onTokenChange: OnTokenChange,
  ) {
    this.layer.pivot.set(0.5);
    this.layer.sortableChildren = true;

    this.layer.addChild(this.terrainLayer);
    this.layer.addChild(this.tokensLayer);
    this.layer.addChild(this.markersLayer);

    this.parent = parent;
    this.onTokenChange = onTokenChange;

    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyF' && hovered) {
        this.onTokenChange({
          id: hovered,
          toggleFlip: true,
        });
      }

      console.log(e);
    });
  }

  update(tokens: any[]) {
    tokens.forEach((token: any) => {
      let currentToken = this.renderedTokens[token.id];

      if (!currentToken) {
        const hexSprite = PIXI.Sprite.from(getTokenGraphics(token.tokenId));

        hexSprite.interactive = true;
        hexSprite.anchor.set(0.5);
        hexSprite.x = token.position?.[0] ?? 0;
        hexSprite.y = token.position?.[1] ?? 0;
        hexSprite.hitArea = getTokenHitArea(token.tokenId);
        hexSprite.rotation = token.rotation ?? 0;
        hexSprite.zIndex = token.zIndex ?? 0;
        hexSprite.filters = [glowFilter];

        currentToken = hexSprite;

        this.renderedTokens[token.id] = currentToken;

        this.registerDragNDrop(token.id, hexSprite);
        this.registerRotation(token.id, hexSprite);

        if (token.type === 'marker') {
          this.markersLayer.addChild(hexSprite);
        } else if (token.type === 'terrain') {
          this.terrainLayer.addChild(hexSprite);
        } else {
          this.tokensLayer.addChild(hexSprite);
        }
      }

      currentToken.x = token.position?.[0] ?? 0;
      currentToken.y = token.position?.[1] ?? 0;
      currentToken.rotation = token.rotation ?? 0;
      currentToken.zIndex = token.zIndex ?? 0;
      currentToken.visible = token.visible;
      // currentToken.tint = 0x00fff5;

      if (token.isFlipped) {
        currentToken.texture = PIXI.Texture.from(getTokenGraphics(`${ token.armyId }-rewers` as any));
      } else {
        currentToken.texture = PIXI.Texture.from(getTokenGraphics(token.tokenId));
      }

      if (this.draggingRegister[token.id]) {
        currentToken.tint = 0x7a7a7a;
      } else {
        currentToken.tint = 0xffffff;
      }
    });
  }

  private registerDragNDrop(tokenId: string, tokenSprite: PIXI.Sprite) {
    const that = this;


    tokenSprite.on('pointerover', function (this: typeof tokenSprite) {
      hovered = tokenId;
      this.filters = [outlineFilterBlue];

      console.log(hovered);
    });

    tokenSprite.on('pointerout', function (this: typeof tokenSprite) {
      hovered = undefined;
      this.filters = [glowFilter];

      console.log(hovered);
    });


    tokenSprite
      .on('pointermove', function onDragMove(this: any, e) {
        if (that.draggingRegister[tokenId]) {
          const newPosition = e.data.getLocalPosition(this.parent);

          that.onTokenChange({
            id: tokenId,
            position: [newPosition.x, newPosition.y],
          });
        }
      })
      .on('pointerdown', function onDragStart(this: PIXI.Sprite, event) {
        // store a reference to the data
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch

        if (!event.data.originalEvent.ctrlKey) {
          that.draggingRegister[tokenId] = true;
        }


        // todo: dodać zIndex
        console.log(event);
        const parent = this.parent;

        console.log(this.zIndex = this.parent.children[this.parent.children.length - 1].zIndex + 1);
        this.parent.sortChildren();

        that.onTokenChange({
          id: tokenId,
          zIndex: this.zIndex,
        });
      })
      .on('pointerup', function onDragEnd(this: any, event) {
        that.draggingRegister[tokenId] = false;

        console.log(event);
      })
      .on('pointerupoutside', function onDragEnd(this: any, event) {
        that.draggingRegister[tokenId] = false;
        console.log(event);
      });
  }

  private registerRotation(tokenId: string, tokenSprite: PIXI.Sprite) {
    const onDown = (e: any) => {
      if (e.data.originalEvent.ctrlKey) {
        document.addEventListener('mouseup', onUp);
        tokenSprite.addListener('mousemove', onMove);
      }
    };

    const onMove = throttle((e: PIXI.InteractionEvent) => {
      const local = e.data.getLocalPosition(this.parent);
      const x = local.x - tokenSprite.x;
      const y = local.y - tokenSprite.y;

      const angle = Math.atan2(y, x);
      const roundTo = Math.PI / 3;
      const rotation = Math.round(angle / roundTo) * roundTo;

      tokenSprite.rotation = rotation;

      this.onTokenChange({
        id: tokenId,
        rotation,
      });
    }, 25);

    const onUp = () => {
      document.removeEventListener('mouseup', onUp);
      tokenSprite.removeListener('mousemove', onMove);
    };

    tokenSprite.addListener('mousedown', onDown);
  }
}
