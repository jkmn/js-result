/*
* @Author: cb
* @Date:   2017-01-12 08:38:01
* @Last Modified by:   cb
* @Last Modified time: 2017-01-12 08:38:58
*/

'use strict';

class UICircle {
  constructor(point, radiu, color = UICOLOR.DEFAULT, canDraw = true, isFill = false) {
    this._point = point;
    this._radiu = radiu;
    this._color = color;
    this._isFill = isFill;
    this._canDraw = canDraw;
  }

  set canDraw(val) {
    this._canDraw = val;
  }

  get point() {
    return this._point;
  }

  draw(ctx, color) {
   if (!this._canDraw) return;
   ctx.save();
   ctx.beginPath();
   ctx[this._isFill ? 'fillStyle' : 'strokeStyle'] = color || this._color;
   ctx.arc(this._point.x, this._point.y, this._radiu, 0, 2 * Math.PI);
   ctx[this._isFill ? 'fill' : 'stroke']();
   ctx.closePath();
   ctx.restore();
  }
  //是否包含一个点
  containPoint(point){
    if(!(point instanceof Point)) {
      throw('请出入 Point 的对象');
    }
    let x = this._point.x, y = this._point.y;
    return point.x > x - this._radiu && point.x < x + this._radiu && point.y > y - this._radiu && point.y < y + this._radiu;
  }
}