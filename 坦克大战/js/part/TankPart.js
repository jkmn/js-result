/*
* @Author: cb
* @Date:   2017-01-13 08:29:12
* @Last Modified by:   cb
* @Last Modified time: 2017-01-13 18:00:42
*/

'use strict';

class TankPart extends Part {

  constructor(point, size, direction = Direction.U) {
    super(point, size);
    this._resource = {};
    this._isInvicible = false;
    this._direction = direction;
  }

  get isInvicible() {
    return this._isInvicible;
  }
  /**
   * 设置无敌时间 坦克生成一段时间不能被杀死
   * @param  {[type]} time [description]
   * @return {[type]}      [description]
   */
  set invincibleTime(time) {
    this._invincibleTime = time;
    this._isInvicible = true;
    this._countDown();
  }

  _countDown() {
    if (this._invincibleTime <= 0) {
      this._isInvicible = false;
      return;
    }
    this._invincibleTime -= 1;
    setTimeout(this._countDown.bind(this), 1000);
  }
  set direction(val) {
    this._direction = direction;
  }
  _draw(ctx) {
    let resource = this._resource[this._direction];
    if (resource) {
      ctx.drawImage(resource, 0, 0, this._size.width, this._size.height, this._point.x, this._point.y, this._size.width, this._size.height);
    }
  }
  move(x, y, direction) {
    this._direction = direction;
    this._point.x += x;
    this._point.y += y;
  }
  shot() {
    let size = new Size(3, 3);
    let x = 0, y = 0;
    switch(this._direction) {
      case 'l':
        x = this._point.x - size.width / 2;
        y = this._point.y + this._size.height / 2;
      break;
      case 'r':
        x = this._point.x + this._size.width + size.width / 2;
        y = this._point.y + this._size.height / 2;
      break;
      case 'u':
        x = this._point.x + this._size.width / 2;
        y = this._point.y - size.height / 2;
      break;
      case 'd':
        x = this._point.x + this._size.width / 2;
        y = this._point.y + this._size.height + size.height / 2;
      break;
    }
    let bullet = new BulletPart(new Point(x, y), size, this._direction);
    return bullet;
  }
}