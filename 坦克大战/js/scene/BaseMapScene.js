/*
* @Author: cb
* @Date:   2017-01-14 09:27:58
* @Last Modified by:   cb
* @Last Modified time: 2017-01-16 16:52:04
*/

/**
 * 基础地图
 */
'use strict';


class BaseMapScene extends GameScene {
  constructor(...args) {
    super(...args);
    this._base = null //基地
    this._group = 'map';
    // this._initParts();
  }

  _createPart(key, val) {
    switch(key) {
      case 'base':
        return this._base = new BasePart(val);
      case 'walls':
      case 'steels':
        return new WallPart(val);
    }
  }

}