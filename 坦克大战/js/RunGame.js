/*
* @Author: cb
* @Date:   2017-01-13 11:52:30
* @Last Modified by:   cb
* @Last Modified time: 2017-01-16 16:33:26
*/

'use strict';

const Rule = {
  hero: 'hero',
  enemy: 'enemy'
}

class TankGame extends GameScene {
  constructor(config) {
    super(config);
    console.log(this._config);
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
    for(let config of this._config.scenes.map) {
      let mapScene = this._mapScene = new BaseMapScene(config, this)
      this._scenes.push(mapScene);
    }
    
  }

  /**
   * 初始化英雄坦克
   * @param  {[type]} ctx [description]
   * @return {[type]}     [description]
   */
  _initHeroTank() {
    for(let config of this._config.scenes.hero) {
      let heroScene = new HeroTankScene(config, this)
      this._scenes.push(heroScene);
    }
   
  }

  _initEnemyTanks() {
     for(let config of this._config.scenes.enemy) {
      let heroScene = new EnemyTankScene(config, this)
      this._scenes.push(heroScene);
    }
  }


  draw(ctx) {
    this._scenes.forEach(scene => scene.draw(ctx));
  }

}