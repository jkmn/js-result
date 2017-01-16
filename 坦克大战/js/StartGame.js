/*
* @Author: cb
* @Date:   2017-01-13 11:45:05
* @Last Modified by:   cb
* @Last Modified time: 2017-01-16 15:51:37
*/

'use strict';

//开始场景
class StartGame extends GameScene{
  constructor() {
    super();
    this._startBtn = new BtnPart({
      text: '开始游戏',
      point: new Point(10, 10),
      size: new Size(100, 40),
      color: 'blue',
      textColor: '#fff'
    });
    this._partContainer.add(this._startBtn);
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