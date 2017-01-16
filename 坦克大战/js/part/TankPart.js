/*
* @Author: cb
* @Date:   2017-01-13 08:29:12
* @Last Modified by:   cb
* @Last Modified time: 2017-01-14 15:51:01
*/

'use strict';

class TankPart extends Part {

  constructor(point, size, direction = Direction.U) {
    super(point, size);
    this._resource = {};
    this._moveDirection = direction;
    this._bulletAtk = 1;
  }
  set bulletAtk(val) {
    this._bulletAtk = val;
  }
  get isInvicible() {
    return this._isInvicible;
  }

  set direction(val) {
    this._moveDirection = val;
  }
  get direction() {
    return this._moveDirection;
  }
  _draw(ctx) {
    let resource = this._resource[this._moveDirection];
    if (resource) {
      ctx.drawImage(resource, 0, 0, this._rect.width, this._rect.height, this._rect.x, this._rect.y, this._rect.width, this._rect.height);
    }
  }
  move(direction, speed) {
    this._speed = speed;
    if (this._moveDirection != direction) {
      this._moveDirection = direction;
      return;
    };
    super.move();
  }
  shot() {
    let size = new Size(3, 3);
    let x = 0, y = 0;
    switch(this._moveDirection) {
      case 'l':
        x = this._rect.x - size.width / 2;
        y = this._rect.y + this._rect.height / 2;
      break;
      case 'r':
        x = this._rect.x + this._rect.width + size.width / 2;
        y = this._rect.y + this._rect.height / 2;
      break;
      case 'u':
        x = this._rect.x + this._rect.width / 2;
        y = this._rect.y - size.height / 2;
      break;
      case 'd':
        x = this._rect.x + this._rect.width / 2;
        y = this._rect.y + this._rect.height + size.height / 2;
      break;
    }
    let bullet = new BulletPart(new Point(x, y), size, this._moveDirection);
    bullet.atk = this._bulletAtk;
    return bullet;
  }
}