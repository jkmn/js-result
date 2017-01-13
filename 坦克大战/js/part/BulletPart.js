/*
* @Author: cb
* @Date:   2017-01-13 08:31:22
* @Last Modified by:   cb
* @Last Modified time: 2017-01-13 17:18:50
*/

'use strict';

class BulletPart extends Part {
  constructor(point, size, direction, speed = 2) {
    super(point, size);
    this._s = speed;
    this._step = this._parseDirection(direction);
  }

  fly() {
    this._point.x += this._step.x;
    this._point.y += this._step.y;
  }

  _parseDirection(direction) {
    let step = {x: 0, y: 0};
    switch(direction) {
      case 'l':
        step.x = -this._s;
      break;
      case 'u':
        step.y = -this._s;
      break;
      case 'r':
        step.x = this._s;
      break;
      case 'd':
        step.y = this._s;
      break;
    }
    return step;
  }

  _draw(ctx) {
    ctx.fillColor = 'black';
    ctx.arc(this._point.x, this._point.y, this._size.width, 0, 2 * Math.PI);
    ctx.fill();
  }
}