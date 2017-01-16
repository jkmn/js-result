/*
* @Author: cb
* @Date:   2017-01-13 08:32:32
* @Last Modified by:   cb
* @Last Modified time: 2017-01-16 15:52:53
*/

'use strict';
class WallPart extends Part {
  constructor(config) {
    super(config);
  }

  _draw(ctx) {
    if (this._resource) {
      ctx.drawImage(this._resource, 0, 0, this._rect.width, this._rect.height, this._rect.x, this._rect.y, this._rect.width, this._rect.height);
    }
  }
}