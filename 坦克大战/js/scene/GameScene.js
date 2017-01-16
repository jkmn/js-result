/*
* @Author: cb
* @Date:   2017-01-13 11:49:52
* @Last Modified by:   cb
* @Last Modified time: 2017-01-16 16:50:01
*/

'use strict';

class GameScene {
  constructor(config, parent) {
    this._partContainer = new PartContainer();
    this._parent = parent;
    this.event = new Event();
    this._group = null;
    this._rect = config && config.rect || null;
    this._config = config;
    this._initParts();
  }
  _initParts() {
    if (this._config && this._config.parts) {
      Object.keys(this._config.parts).forEach(partName => this._initPart(partName, this._config.parts[partName]));
    }
  }

  _initPart(key, val) {
    if (Array.isArray(val)) {
      for(let v of val) {
        this._initPart(key, v);
      }
    } else {
      let part = this._createPart(key, val);
      if (part) this._partContainer.add(part);
    }
  }

  _createPart(key, val) {
    throw '子类必须实现之间创建part的'
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