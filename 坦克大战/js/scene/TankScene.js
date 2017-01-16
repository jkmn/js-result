/*
* @Author: cb
* @Date:   2017-01-14 12:00:34
* @Last Modified by:   cb
* @Last Modified time: 2017-01-16 14:22:31
*/

'use strict';
class TankScene extends GameScene {
  constructor(...args) {
    super(...args);
    this._openDetectedCollision = true;
    this._timer = null;
    this._initParts();
  }
  _initParts() {
    Object.keys(this._config).forEach(key => {
      switch(key) {
        case 'tank':
          this._initTank();
        break;
      }
    })
  }

  _initTank() {
    let config = this._config.tank;
    let size = new Size(config.size.width, config.size.height);
    let point = new Point(config.position.x, config.position.y);
    let tank = this._tank = new TankPart(point, size, this._getDirection());
    tank.resource = config.resource;
    tank.speed = config.speed;
    tank.hp = config.hp;
    this._tank.openInvincible(this._config.config.invincibleTime || 0);
    this._partContainer.add(tank);
    this._autoShot();
  }

  _getDirection() {
    let config = this._config.tank;
    return config && config.step && config.step[this._currentStep] || config.direction
  }

  /**
   * 自动射击
   * @return {[type]} [description]
   */
  _autoShot() {
    if (!this._config.config.autoShot || !this._tank) return;
    this._tankShot();
    setTimeout(this._autoShot.bind(this), this._config.config.shotInterval);
  }

  //子弹射击
  _tankShot() {
    if (!this._tank) return;
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
      this._initTank();
    }, time * 1000);
  }

  _tankMove(direction) {
    this._tank.move(direction, this._config.tank.speed);
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
              _part.toDie();
              part.beAttacked(_part.atk);
            } else if(part instanceof BulletPart) {
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
       this._tank = null;
       this._resurgence();
    }
    super.draw(ctx);
  }

}