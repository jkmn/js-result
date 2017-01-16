/*
* @Author: cb
* @Date:   2017-01-13 11:45:41
* @Last Modified by:   cb
* @Last Modified time: 2017-01-15 00:48:25
*/

'use strict';

class Part {
  constructor(point, size, resource) {
    this._resource = resource;
    // this._point = point;
    // this._size = size;
    this._rect = new Rect(point, size);
    this._uid = ++Part._uid;
    this._hp = 1; //部件血量 当血量为0时  部件死亡 -1为不可杀死部件
    this._atk = 0; //攻击力 两个部件碰撞是 血量 = 血量 - 攻击力
    this._group = null; //部件所属的集团  相同集团之间不能相互攻击 没有集团的部件也可以被攻击

    this._moveDirection = Direction.U; //运动的方向
    this._speed = 0;//运动的速度
  }

  //移动到指定的位置
  moveToPoint(point) {
    this._rect.point = point;
  }

  move(direction, speed) {
    if (direction) {
      this._moveDirection = direction;
    }
    direction = this._moveDirection;
    if (speed) {
      this._speed = speed;
    }
    speed = this._speed;
    let point = new Point(0, 0);
    switch(direction) {
      case Direction.L:
        point.x = -1;
      break;
      case Direction.R:
        point.x = 1;
      break;
      case Direction.U:
        point.y = -1;
      break;
      case Direction.D:
        point.y = 1;
      break;
    }

    point.take(speed);

    this._rect.point.add(point);
  }



  /**
   * 开启无敌状态
   * time 持续时间
   */
  openInvincible(time) {
    if (time == 0) return;
    let currentHp = this._hp;
    this._hp = -1;
    if (time > 0) {
      setTimeout(() => {
        this._hp = currentHp;
      }, time * 1000);
    }
  }
  /**
   * 受到攻击
   * @param  int atk 攻击力
   * @return {[type]}     [description]
   */
  beAttacked(atk) {
    if (this._hp == -1 ) return false;
    this._hp -= atk;
    this._hp = this._hp < 0 ? 0 : this._hp;
  }
  /**
   * 是否已经死亡
   * @return {Boolean} [description]
   */
  isDie() {
    return this._hp == 0;
  }

  toDie() {
    this._hp = 0;
  }

  get atk() {
    return this._atk;
  }

  set atk(atk) {
    this._atk = atk;
  }


  get hp() {
    return this._hp;
  }

  //设置血量
  set hp(hp) {
    this._hp = hp;
  }
  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    this._draw(ctx);
    ctx.closePath();
    ctx.restore();
  }
  //继承它的子类必须实现此方法
  _draw(ctx) {
    throw '子类必须实现_draw方法';
  }
  set resource(resource) {
    this._resource = resource;
  }

  get rect() {
    return this._rect;
  }
}

Part._uid = 0;