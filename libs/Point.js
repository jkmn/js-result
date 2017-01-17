/*
* @Author: cb
* @Date:   2017-01-12 08:29:31
* @Last Modified by:   cb
* @Last Modified time: 2017-01-17 16:27:50
*/

'use strict';

class Point {
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }
  add(point) {
    this._x += point.x;
    this._y += point.y;
  }

  minus(point) {
    this._x -= point.x;
    this._y -= point.y;
  }

  take(num) {
    this._x *= num;
    this._y *= num;
  }

  copy() {
    return new Point(this._x, this._y);
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