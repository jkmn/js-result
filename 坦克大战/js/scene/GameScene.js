/*
* @Author: cb
* @Date:   2017-01-13 11:49:52
* @Last Modified by:   cb
* @Last Modified time: 2017-01-15 00:41:18
*/

'use strict';

class GameScene {
  constructor(rect, config, parent) {
    this._partContainer = new PartContainer();
    this._parent = parent;
    this.event = new Event();
    this._group = null;
    this._rect = rect;
    this._config = config;
  }
  get partContainer() {
    return this._partContainer.partContainer;
  }
  get rect() {
    return this._rect;
  }

  draw(ctx) {
    this._partContainer.draw(ctx);
  }
}