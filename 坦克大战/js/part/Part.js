/*
* @Author: cb
* @Date:   2017-01-13 11:45:41
* @Last Modified by:   cb
* @Last Modified time: 2017-01-13 15:23:49
*/

'use strict';

class Part {
  constructor(point, size) {
    this._point = point;
    this._size = size;
    this._rect = new Rect(point, size);
    this._uid = ++Part._uid;
  }
  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    this._draw(ctx);
    ctx.closePath();
    ctx.restore();
  }
  //继承它的子类必须实现此方法
  _draw(ctx) {
    throw '子类必须实现_draw方法';
  }
  set resource(resource) {
    this._resource = resource;
  }

  get rect() {
    return this._rect;
  }
}

Part._uid = 0;