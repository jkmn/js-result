/*
* @Author: cb
* @Date:   2017-01-13 11:46:09
* @Last Modified by:   cb
* @Last Modified time: 2017-01-13 15:23:57
*/

'use strict';

//按钮
class BtnPart extends Part {
  constructor(text, point, size, color, textColor) {
    super(point, size);
    this._text = text;
    this._color = color
    this._textColor = textColor;
  }

  _draw(ctx) {
    ctx.fillStyle = this._color;
    ctx.fillRect(this._rect.x, this._rect.y, this._rect.width, this._rect.height);
    ctx.textAlign = 'center';
    ctx.fillStyle = this._textColor;
    ctx.fillText(this._text, this._rect.centerPoint.x, this._rect.centerPoint.y);
  }
}
