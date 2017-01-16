/*
* @Author: cb
* @Date:   2017-01-12 08:30:13
* @Last Modified by:   cb
* @Last Modified time: 2017-01-14 16:44:49
*/

'use strict';

class Size {
  constructor(width = 0, height = 0) {
    this._width = width;
    this._height = height || this._width;
  }

  set width(w) {
    this._width = w;
  }

  set height(h) {
    this._height = h;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  copy() {
    return new Size(this._width, this._height);
  }
}