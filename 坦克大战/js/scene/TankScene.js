/*
* @Author: cb
* @Date:   2017-01-14 12:00:34
* @Last Modified by:   cb
* @Last Modified time: 2017-01-16 16:57:12
*/

'use strict';
class TankScene extends GameScene {
  constructor(...args) {
    super(...args);
    this._openDetectedCollision = true;
    this._timer = null;
    this._prevTank = null;
  }

  _createPart(key, val) {
    switch(key) {
      case 'tank':
        return this._initTank(val);
    }
  }


  _initTank(config) {
    let tank = this._tank = new TankPart(config);
    if (this._config.config.invincibleTime) {
      tank.openInvincible(this._config.config.invincibleTime);
    }
    this._autoShot();
    return tank;
  }

  /**
   * 自动射击
   * @return {[type]} [description]
   */
  _autoShot() {
    if (!this._config.config.autoShot || !this._tank) return;
    this._tankShot();
    setTimeout(() => {
      this._autoShot();
    }, this._config.config.shotInterval);
  }

  //子弹射击
  _tankShot() {
    this._partContainer.add(this._tank.shot());
  }


  /**
   * 坦克移动过程和部件发生碰撞不能移动超过这部件
   * @param  {[type]} tank [description]
   * @param  {[type]} part [description]
   * @return {[type]}      [description]
   */
  _limitTankMoveCollisionPart(part){
    let tank = this._tank;
    switch(tank.direction) {
      case Direction.L:
        tank.rect.x = part.rect.x + part.rect.width;
      break;
      case Direction.R:
        tank.rect.x = part.rect.x - tank.rect.width;
      break;
      case Direction.U:
        tank.rect.y = part.rect.y + part.rect.height;
      break;
      case Direction.D:
        tank.rect.y = part.rect.y - tank.rect.height;
      break;
    }
  }
  /**
   * 复活
   * @return {[type]} [description]
   */
  _resurgence() {
    let time = this._config.config.resurgenceTime;
    setTimeout(() => {
      this._initPart('tank', this._prevTank._config);
      this._prevTank = null;
    }, time * 1000);
  }

  _tankMove(direction) {
    this._tank.move(direction);
  }

  _checkParts() {
     Object.keys(this.partContainer).forEach(uid => {
        let part = this.partContainer[uid];
        if (part && !part.isDie()) {
          this._checkPart(part);
        }
     })
  }

  _checkPart(part) {
    if (!part || part.isDie()) return;
    let outRange = this._isOutRange(part);
    if (outRange ) {
      if (part == this._tank) {
        part.moveToPoint(outRange);
      } else {
        part.toDie();
      }
    }
    this._partCollision(part);
  }

  /**
   * 检查部件是否移出界面的范围
   * @return {Boolean} [description]
   */
  _isOutRange(part) {
    if(!part || part.isDie()) return false;
    let x = part.rect.x, y = part.rect.y;
    if (part.rect.x < 0) x = 0;
    if (part.rect.y < 0) y = 0;
    if (part.rect.x + part.rect.width > this._rect.width) x = this._rect.width - part.rect.width;
    if (part.rect.y + part.rect.height > this._rect.height) y = this._rect.height - part.rect.height;
    if (x != part.rect.x || y != part.rect.y) {
     return new Point(x, y);
    }
    return false;
  }
    //当前scene中的部件和别的scene之间的碰撞之间的碰撞
  _partCollision(part) {
    if(!part || part.isDie()) return;
    let scenes = this._parent.scenes;
    scenes.forEach(scene => {
      if (scene == this) return;
      if (part && !part.isDie()) {
        Object.keys(scene.partContainer).forEach(_uid => {
          let _part = scene.partContainer[_uid];
          if(part && !part.isDie() && _part && !_part.isDie() && part.rect.intersect(_part.rect)) {
            if (_part instanceof BulletPart) {
              if (scene._group && scene._group == this._group) return; //同类之间不相互攻击
              _part.toDie();
              part.beAttacked(_part.atk);
            } else if(part instanceof BulletPart) {
              if (scene._group && scene._group == this._group) return;  //同类之间不相互攻击
              part.toDie();
              _part.beAttacked(part.atk);
            } else {
              this._limitTankMoveCollisionPart(_part);
            }
          }
        })
      }
    })
  }

  draw(ctx) {
    this._checkParts();
    if (this._tank && this._tank.isDie()) {
       this._prevTank = this._tank;
       this._tank = null;
       this._resurgence();
    }
    super.draw(ctx);
  }

}