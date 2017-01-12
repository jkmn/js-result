/*
* @Author: cb
* @Date:   2017-01-12 08:33:37
* @Last Modified by:   cb
* @Last Modified time: 2017-01-12 09:57:29
*/

'use strict';

class UIFont {
  constructor(size, fontName) {
    this._size = size;
    this._fontName = fontName || 'Arial';
  }

  get font () {
    return `${this._size}px  ${this._fontName}`;
  }
}

class UIText {
  constructor(text, point, color, font, isFill = false) {
    this._point = point || new Point(0, 0);
    this._text = text;
    this._isFill = !!isFill;
    this._color = color || 0x000;
    this._font = font || new UIFont(15);
  }

  set point(point) {
    this._point = point;
  }

  get point() {
    return this._point;
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.font = this._font.font;
    ctx[this._isFill ? 'fillStyle' : 'strokeStyle'] = this._color;
    ctx[this._isFill ? 'fillText' : 'strokeText'](this._text, this._point.x, this._point.y);
    ctx.closePath();
    ctx.restore();
  }
}