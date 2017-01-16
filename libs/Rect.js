/*
* @Author: cb
* @Date:   2017-01-13 11:06:49
* @Last Modified by:   cb
* @Last Modified time: 2017-01-14 16:45:27
*/

'use strict';

class Rect {
  constructor(point, size) {
    this._point = point;
    this._size = size;
    this._center = new Point(point.x + size.width / 2, point.y + size.height / 2); //中心点
  }

  copy() {
    return new Rect(this._point.copy(), this._size.copy());
  }

  /**
   * 是否和别的矩形相交
   * @param  {[type]} rect [description]
   * @return {[type]}      [description]
   */
  intersect(rect) {
    return !(this.x + this.width <= rect.x || this.x >= rect.x + rect.width || this.y + this.height <= rect.y || this.y >= rect.y + rect.height);
  }

  /**
   * 判断当前的点位置是否在矩形里面
   * @param  {[type]}  point [description]
   * @return {Boolean}
   */
  isContaionPoint(point) {
    return point.x >= this._point.x && point.x <= this._point.x + this._size.width && point.y >= this._point.y && point.y <= this._point.y + this._size.height;
  }


  static init(x, y, width, height) {
    return new Rect(new Point(x, y), new Size(width, height));
  }
  set x(x) {
    this._point.x = x;
  }

  set y(y) {
    this._point.y = y;
  }

  set width(w) {
    this._size.width = w;
  }

  set height(h) {
    this._size.height = h;
  }

  get centerPoint() {
    return this._center;
  }

  get point() {
    return this._point;
  }

  set point(point) {
    this._point = point;
  }

  get size() {
    return this._size;
  }

  get x() {
    return this._point.x;
  }

  get y() {
    return this._point.y;
  }

  get width() {
    return this._size.width;
  }

  get height() {
    return this._size.height;
  }

}