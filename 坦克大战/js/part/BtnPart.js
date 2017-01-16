/*
* @Author: cb
* @Date:   2017-01-13 11:46:09
* @Last Modified by:   cb
* @Last Modified time: 2017-01-16 15:49:18
*/

'use strict';

//按钮
class BtnPart extends Part {
  constructor(config) {
    super(config);
    this._text = config.text;
    this._color = config.color
    this._textColor = config.textColor;
  }

  _draw(ctx) {
    ctx.fillStyle = this._color;
    ctx.fillRect(this._rect.x, this._rect.y, this._rect.width, this._rect.height);
    ctx.textAlign = 'center';
    ctx.fillStyle = this._textColor;
    ctx.fillText(this._text, this._rect.centerPoint.x, this._rect.centerPoint.y);
  }
}
