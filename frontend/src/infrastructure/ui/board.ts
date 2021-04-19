import * as PIXI from 'pixi.js';
import * as Honeycomb from 'honeycomb-grid';

import tile from '../../../assets/borgo/borgo-sztab.png';

export const init = () => {
  const app = new PIXI.Application({
    transparent: true,
    // antialias: true,
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1,
  })

  const graphics = new PIXI.Container()

  graphics.interactive = true;
  // graphics.addListener('mouseover', (e) => {
  //
  //   console.log(e);
  //
  // })

  graphics.x = app.screen.width / 2;
  graphics.y = app.screen.height / 2;

// Center bunny sprite in local container coordinates

  graphics.pivot.y = graphics.height / 2;
  graphics.pivot.x = graphics.width / 2;
// Listen for animate update

  const Hex = Honeycomb.extendHex({ size: 63, orientation: 'flat' })
  const Grid = Honeycomb.defineGrid(Hex)

  document.querySelector('#board')!.appendChild(app.view)
// set a line style of 1px wide and color #999
//   graphics.lineStyle(1, 0x999999)

// render 10,000 hexes
  Grid.hexagon({
    radius: 2,
  }).forEach(hex => {
    // console.log(hex.toPoint())

    const hexOrigin = hex.toPoint();


    const bunny = PIXI.Sprite.from(tile);
    bunny.interactive = true;

// center the sprite's anchor point
    bunny.anchor.set(0.5);

    // console.log(hex.center())

    const hitPolygon = new PIXI.Polygon(...hex.corners().map(corner => {
      console.log(hexOrigin, corner)
      return new PIXI.Point(corner.x - hex.center().x, corner.y - hex.center().y);
    }));

    const g = new PIXI.Graphics();
    g.beginFill(0x000)
    g.drawPolygon(hitPolygon)
    // bunny.addChild(g);


    bunny.x = hexOrigin.x + hex.center().x;
    bunny.y = hexOrigin.y + hex.center().y;
    bunny.pivot.x = hex.center().x;
    bunny.pivot.y = hex.center().y;


    bunny.hitArea = hitPolygon
    // bunny.rotation = 60 * Math.PI / 180;
    //
    bunny.addListener('click', e => {
      console.log(hex);
    })

    bunny.addListener('mouseover', e => {
      bunny.alpha = 0.5;
    })

    bunny.addListener('mouseout', e => {
      bunny.alpha = 1;
    })


    graphics.addChild(bunny);
    // graphics.addChild(g);

    //
    // const point = hex.toPoint()
    // // add the hex's position to each of its corner points
    // const corners = hex.corners().map(corner => corner.add(point))
    // // separate the first from the other corners
    // const [firstCorner, ...otherCorners] = corners
    //
    // // move the "pencil" to the first corner
    // graphics.moveTo(firstCorner.x, firstCorner.y)
    // // draw lines to the other corners
    // otherCorners.forEach(({ x, y }) => graphics.lineTo(x, y))
    // // finish at the first corner
    // graphics.lineTo(firstCorner.x, firstCorner.y)


  })

  app.stage.addChild(graphics)


  // app.stage.addChild(bunny)
}
