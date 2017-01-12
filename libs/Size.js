/*
* @Author: cb
* @Date:   2017-01-12 08:30:13
* @Last Modified by:   cb
* @Last Modified time: 2017-01-12 08:31:05
*/

'use strict';

class Size {
  constructor(width = 0, height = 0) {
    this._width = width;
    this._height = height || this._width;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }
}