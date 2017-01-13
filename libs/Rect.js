/*
* @Author: cb
* @Date:   2017-01-13 11:06:49
* @Last Modified by:   cb
* @Last Modified time: 2017-01-13 11:25:07
*/

'use strict';

class Rect {
  constructor(point, size) {
    this._point = point;
    this._size = size;
    this._center = new Point(point.x + size.width / 2, point.y + size.height / 2); //中心点
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

  get centerPoint() {
    return this._center;
  }

  get point() {
    return this._point;
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