/*
* @Author: cb
* @Date:   2017-01-13 14:24:17
* @Last Modified by:   cb
* @Last Modified time: 2017-01-13 14:42:02
*/

//基地
'use strict';

class BasePart extends Part {

  constructor(point, size) {
    super(point, size);
  }

  _draw(ctx) {
    if(this._resource) {
      ctx.drawImage(this._resource, 0, 0, this._size.width, this._size.height, this._point.x, this._point.y, this._size.width, this._size.height);
    }
  }
}