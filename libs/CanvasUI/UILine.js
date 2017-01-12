/*
* @Author: cb
* @Date:   2017-01-12 08:37:11
* @Last Modified by:   cb
* @Last Modified time: 2017-01-12 08:37:44
*/

'use strict';

class UILine {
  constructor(startPoint, endPoint) {
    this._startPoint = startPoint;
    this._endPoint = endPoint;
    this._strokeColor = UICOLOR.CHECKED;
    this._lineWidth = 5;
  }

  get startPoint() {
    return this._startPoint;
  }

  get endPoint() {
    return this._endPoint;
  }

  set endPoint(point) {
    this._endPoint = point;
  }

  set startPoint(point = null) {
    this._startPoint = point;
  }

  draw(ctx, color) {
    if (!this._startPoint || !this._endPoint) return;
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color || this._strokeColor;
    ctx.lineWidth = this._lineWidth;
    ctx.moveTo(this._startPoint.x, this._startPoint.y);
    ctx.lineTo(this._endPoint.x, this._endPoint.y);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }
}



UILine.copy = function(line) {
  if (! (line instanceof UILine)) {
    throw '参数必须是 UILine 的对象';
  }
  return new UILine(line.startPoint, line.endPoint);
}