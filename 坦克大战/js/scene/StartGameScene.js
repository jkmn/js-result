/*
* @Author: cb
* @Date:   2017-01-13 11:45:05
* @Last Modified by:   cb
* @Last Modified time: 2017-01-13 14:30:05
*/

'use strict';

//开始场景
class StartGameScene extends GameScene {
  constructor(size) {
    super(size);
    this.event = new Event();
    this._startBtn = new BtnPart('开始游戏',new Point(10, 10), new Size(100, 40), 'blue', '#fff');
    this._scene.add(this._startBtn);
    document.body.addEventListener('click', this, false);
  }
  handleEvent(event) {
    switch(event.type) {
      case 'click':
        this._onClick(event);
      break;
    }
    event.stopPropagation();
  }

  _onClick(evnt) {
    let point = new Point(event.pageX, event.pageY);
    if (this._startBtn.rect.isContaionPoint(point)) {
      document.body.removeEventListener('click', this, false);
      this.event.emit('start');
    }
  }
}