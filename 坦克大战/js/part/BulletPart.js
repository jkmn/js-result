/*
* @Author: cb
* @Date:   2017-01-13 08:31:22
* @Last Modified by:   cb
* @Last Modified time: 2017-01-16 16:18:14
*/

'use strict';

class BulletPart extends Part {

  _fly() {
    this.move();
  }
  _draw(ctx) {
    this._fly();
    ctx.fillColor = 'black';
    ctx.arc(this._rect.x, this._rect.y, this._rect.width, 0, 2 * Math.PI);
    ctx.fill();
  }
}