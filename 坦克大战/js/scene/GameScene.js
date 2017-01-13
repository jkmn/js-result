/*
* @Author: cb
* @Date:   2017-01-13 11:49:52
* @Last Modified by:   cb
* @Last Modified time: 2017-01-13 15:32:56
*/

'use strict';

class GameScene {
  constructor(size) {
    this._scene = new Scene();
    this._size = size;
    this._rect = new Rect(new Point(0, 0), this._size);
  }

  draw(ctx) {
    this._scene.draw(ctx);
  }
}