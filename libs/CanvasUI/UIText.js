/*
* @Author: cb
* @Date:   2017-01-12 08:33:37
* @Last Modified by:   cb
* @Last Modified time: 2017-01-12 08:33:59
*/

'use strict';

class UIText {
  constructor(text, point, color, isFill = false) {
    this._point = point;
    this._text = text;
    this._isFill = !!isFill;
    this._color = color;
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
  }
}