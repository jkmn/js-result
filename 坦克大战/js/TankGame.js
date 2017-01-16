/*
* @Author: cb
* @Date:   2017-01-13 11:52:30
* @Last Modified by:   cb
* @Last Modified time: 2017-01-16 11:40:51
*/

'use strict';

const Rule = {
  hero: 'hero',
  enemy: 'enemy'
}

class TankGame {
  constructor(rect, config) {
    this._config = config;
    this._rect = rect;
    this._scenes = [];
    this._initMap();
    this._initHeroTank();
    this._initEnemyTanks();
  }

  get scenes() {
    return this._scenes;
  }

  /**
   * 初始化地图
   * @return {[type]} [description]
   */
  _initMap() {
    let mapScene = this._mapScene = new BaseMapScene(this._rect,this._config.map, this)
    this._scenes.push(mapScene);
  }

  /**
   * 初始化英雄坦克
   * @param  {[type]} ctx [description]
   * @return {[type]}     [description]
   */
  _initHeroTank() {
    let tankSize = new Size(60, 60);
    let heroScene = this._heroTankScene = new HeroTankScene(this._rect,this._config.hero, this)
    this._scenes.push(heroScene);
  }

  _initEnemyTanks() {
      let config = this._config.enemy;
      config.tank.positions.forEach(position => {
        let tank = Object.assign({}, config.tank, {position});
        delete tank.positions;
        let _config = Object.assign({}, config, {tank});
        let tankScene = new EnemyTankScene(this._rect, _config, this);
        this._scenes.push(tankScene);
      })
  }


  draw(ctx) {
    this._scenes.forEach(scene => scene.draw(ctx));
  }

}