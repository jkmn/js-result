/*
* @Author: cb
* @Date:   2017-01-14 11:31:05
* @Last Modified by:   cb
* @Last Modified time: 2017-01-17 17:19:01
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
    if (!this._tank) return;
    this._tankMove(this._tank.direction);
    if (this._isOutRange(this._tank)) {
      this._changeDirection();
    }
  }

_limitTankMoveCollisionPart(part) {
  super._limitTankMoveCollisionPart(part);
  this._changeDirection();
}

  _changeDirection() {
    this._currentStep++;
    let step =  this._tank.step
    if (this._currentStep > step.length - 1 ) this._currentStep = 0;
    this._tank.direction = step[this._currentStep];
  }


  draw(ctx) {
    this._autoMove();
    super.draw(ctx);
  }

}