/*
* @Author: cb
* @Date:   2017-01-12 08:29:31
* @Last Modified by:   cb
* @Last Modified time: 2017-01-12 08:30:02
*/

'use strict';

class Point {
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }
}