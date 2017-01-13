/*
* @Author: cb
* @Date:   2017-01-12 08:29:31
* @Last Modified by:   cb
* @Last Modified time: 2017-01-13 15:12:25
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

  set x(x) {
    this._x = x;
  }

  set y(y) {
    this._y = y;
  }

  updateY(y) {
    this._y = y;
  }

  updateX(x) {
    this._x = x;
  }
}