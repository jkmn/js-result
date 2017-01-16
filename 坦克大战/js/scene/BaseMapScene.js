/*
* @Author: cb
* @Date:   2017-01-14 09:27:58
* @Last Modified by:   cb
* @Last Modified time: 2017-01-15 00:40:52
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
    this._initParts();
  }

  _initParts() {
    Object.keys(this._config).forEach(key => {
      let partConfig = this._config[key];
      switch(key) {
        case 'base':
          this._initBase(partConfig);
        break;
        case 'walls':
          this._initWalls(partConfig);
        break;
      }
    })
  }
   /**
   * 初始化基地
   * @return {[type]} [description]
   */
  _initBase(config) {
    let size = new Size(config.size.width, config.size.height);
    let point = new Point(config.position.x, config.position.y);
    let base = this._base = new BasePart(point, size);
    base.resource = config.resource;
    this._partContainer.add(base);
  }

  _initWalls(config) {
    let size = new Size(config.size.width, config.size.height);
    for(let post of config.positions) {
      let point = new Point(post.x, post.y);
      let wall = new WallPart(point, size);
      wall.resource = config.resource;
      this._partContainer.add(wall);
    }
  }

}