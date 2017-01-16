/*
* @Author: cb
* @Date:   2017-01-14 11:57:03
* @Last Modified by:   cb
* @Last Modified time: 2017-01-16 16:39:27
*/

'use strict';
class HeroTankScene extends TankScene {
  constructor(...args) {
    super(...args);
    this._group = 'hero';
    this._addEvent();
  }

  _addEvent() {
    document.body.addEventListener('keydown', this, false);
  }

  handleEvent(event) {
    switch(event.type) {
      case 'keydown':
        this._onKeyDown(event);
      break;
    }
    event.stopPropagation();
  }

  _onKeyDown(event) {
    if (!this._tank) return;
    //上: 38  下: 40 左: 37 右: 39
    let map = {37: Direction.L, 38: Direction.U, 39: Direction.R, 40: Direction.D};
    let direction = map[event.keyCode];
    if(direction) {
      this._tankMove(direction);
    }
    //射击
    let key = this._config.config.shotKey;
    if (String.fromCharCode(event.keyCode).toLowerCase() == key.toLowerCase()) {
      this._tankShot();
    }
  }

}