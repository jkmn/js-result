/*
* @Author: cb
* @Date:   2017-01-14 11:31:05
* @Last Modified by:   cb
* @Last Modified time: 2017-01-16 14:25:05
*/
/**
 * 敌方坦克图层
 */
'use strict';


class EnemyTankScene extends TankScene {
  constructor(...args) {
    super(...args);
    this._group = 'enemy';
    this._drections = [];
    this._currentStep = 0;
  }

  /**
   * 自动移动
   * @return {[type]} [description]
   */
  _autoMove() {
    this._tankMove(this._tank.direction);
    if (this._isOutRange(this._tank)) {
      this._changeDirection();
    }
  }

  _changeDirection() {
    this._currentStep++;
    if (this._currentStep > this._config.tank.step.length - 1 ) this._currentStep = 0;
    this._tank.direction = this._config.tank.step[this._currentStep];
  }


  draw(ctx) {
    this._autoMove();
    super.draw(ctx);
  }

}