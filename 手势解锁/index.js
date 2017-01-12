/*
* @Author: cb
* @Date:   2017-01-11 15:51:46
* @Last Modified by:   cb
* @Last Modified time: 2017-01-12 08:34:31
*/

'use strict';


const UICOLOR = {
  DEFAULT: '#333',
  CHECKED: 'orange',
  ERROR: 'red',
  SUCCESS: 'green'
}


class UILine {
  constructor(startPoint, endPoint) {
    this._startPoint = startPoint;
    this._endPoint = endPoint;
    this._strokeColor = UICOLOR.CHECKED;
    this._lineWidth = 5;
  }

  get startPoint() {
    return this._startPoint;
  }

  get endPoint() {
    return this._endPoint;
  }

  set endPoint(point) {
    this._endPoint = point;
  }

  set startPoint(point = null) {
    this._startPoint = point;
  }

  draw(ctx, color) {
    if (!this._startPoint || !this._endPoint) return;
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color || this._strokeColor;
    ctx.lineWidth = this._lineWidth;
    ctx.moveTo(this._startPoint.x, this._startPoint.y);
    ctx.lineTo(this._endPoint.x, this._endPoint.y);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }
}

UILine.copy = function(line) {
  if (! (line instanceof UILine)) {
    throw '参数必须是 UILine 的对象';
  }
  return new UILine(line.startPoint, line.endPoint);
}

class LineContainer {
  constructor () {
    this._lines = [];
  }

  addLine(line) {
    if (! (line instanceof UILine)) {
      throw new Error('line 参数必须为 UILine 的对象');
    }
    this._lines.push(line);
  }

  clear() {
    this._lines = [];
  }

  draw(ctx, color) {
    for(let line of this._lines) {
      line.draw(ctx, color);
    }
  }
}

class UICircle {
  constructor(x, y, radiu, color = UICOLOR.DEFAULT, canDraw = true, isFill = false) {
    this._point = new Point(x, y);
    this._radiu = radiu;
    this._color = color;
    this._isFill = isFill;
    this._canDraw = canDraw;
  }

  set canDraw(val) {
    this._canDraw = val;
  }

  get point() {
    return this._point;
  }

  draw(ctx, color) {
   if (!this._canDraw) return;
   ctx.save();
   ctx.beginPath();
   ctx[this._isFill ? 'fillStyle' : 'strokeStyle'] = color || this._color;
   ctx.arc(this._point.x, this._point.y, this._radiu, 0, 2 * Math.PI);
   ctx[this._isFill ? 'fill' : 'stroke']();
   ctx.closePath();
   ctx.restore();
  }
  //是否包含一个点
  containPoint(point){
    if(!(point instanceof Point)) {
      throw('请出入 Point 的对象');
    }
    let x = this._point.x, y = this._point.y;
    return point.x > x - this._radiu && point.x < x + this._radiu && point.y > y - this._radiu && point.y < y + this._radiu;
  }
}

class BigCircle {
  constructor(x, y, radiu) {
    this._x = x;
    this._y = y;
    this._bigCircle = new UICircle(x, y, radiu);
    this._smallCircle = new UICircle(x, y, radiu / 3, UICOLOR.CHECKED, false, true);
    this._isChecked = false;
  }

  refresh() {
    this.isChecked = false;
  }

  set isChecked(val) {
    this._isChecked = val;
    this._smallCircle.canDraw = val;
  }

  get isChecked() {
    return this._isChecked;
  }

  get bigCircle() {
    return this._bigCircle;
  }

  get smallCircle() {
    return this._smallCircle;
  }

  get point(){
    return this._bigCircle.point;
  }

  draw(ctx, color) {
    this._bigCircle.draw(ctx);
    if (this._smallCircle instanceof UICircle) {
      this._smallCircle.draw(ctx, color);
    }
  }

  containBigCirlcePoint(point) {
    return this._bigCircle.containPoint(point);
  }
  containSmallCirclePoint(point) {
    return this._smallCircle.containPoint(point);
  }
}


class CircleContainer {
  constructor(circles) {
    this._circles = circles || [];
  }

  draw(ctx, color) {
    this._circles.map((circle) => circle.draw(ctx, color));
  }

  refresh() {
    for (let circle of this._circles) {
      circle.refresh();
    }
  }
  /**
   * 找到碰撞到的圆
   * @param  {[type]} point [description]
   * @return {[type]}       [description]
   */
  findTouchCircle(point) {
    for (let circle of this._circles) {
      if (circle.containSmallCirclePoint(point)) return circle;
    }
    return null;
  }
}


function getIntervalAndRadiu(wWidth) {
  let interval = wWidth / 10;
  let radiu = interval ;
  return  {interval, radiu};
}

class TouchUnLock {
  constructor (canvas, finishCb = null) {
    this._canvas = canvas;
    this._bigContainer = new CircleContainer(this._createBigCircle(canvas));
    this._lineContainer = new LineContainer();
    this._tmpLine = null;
    this._ctx = canvas.getContext('2d');
    this._circleIndex = [];
    this._drawColor = null;
    this._finishCb = finishCb;
    this._addEvent();
  }
  refresh() {
   this._tmpLine = null;
   this._drawColor = null;
   this._circleIndex = [];
   this._lineContainer.clear();
   this._bigContainer.refresh();
   this.draw();
  }
  _addEvent() {
    this._canvas.addEventListener('touchstart', this, false);
    this._canvas.addEventListener('touchmove', this, false);
    this._canvas.addEventListener('touchend', this, false);
  }

  handleEvent(event) {
    switch(event.type) {
      case 'touchstart':
        this._onTouchStart(event);
      break
      case 'touchmove':
        this._onTouchMove(event);
      break;
      case 'touchend':
        this._onTouchEnd(event);
      break;
    }
    this.draw();
    event.stopPropagation();
  }
  _onTouchStart(event) {
    this.refresh();
   let point = getTouchPoint(event);
   let circle = this._pointIsInCircle(point);
   if (circle) {
    circle.isChecked = true;
    this._tmpLine = new UILine(circle.point);
    this._circleIndex.push(circle.index);
   }
  }
  _onTouchMove(event) {
    let point = getTouchPoint(event);
    let circle = this._pointIsInCircle(point);
    if (circle && !circle.isChecked) {
      circle.isChecked = true;
      if (this._tmpLine) {
        this._tmpLine.endPoint = circle.point;
        this._lineContainer.addLine(UILine.copy(this._tmpLine));
        this._tmpLine = new UILine(circle.point);
      }
      if (!this._tmpLine) {
        this._tmpLine = new UILine(circle.point);
      }
      this._circleIndex.push(circle.index);
    }

    if (this._tmpLine) {
      this._tmpLine.endPoint = point;
    }

  }
  _onTouchEnd(event) {
    this._tmpLine = null;
    if (this._finishCb) {
      if(this._finishCb(this._circleIndex)) {
        this._drawColor = UICOLOR.SUCCESS;
      } else {
        this._drawColor = UICOLOR.ERROR;
      }
    }
  }
  _createBigCircle(elem) {
    let bigCircles = [];
    let nWidth = elem.getBoundingClientRect().width
    let {interval, radiu} = getIntervalAndRadiu(nWidth);
    for (var y = 0; y < 3; y ++) {
      for (var x = 0; x < 3; x ++) {
        let circle =  new BigCircle( ( x * radiu * 2 + (x + 1) * interval + radiu), ( (y + 1) * interval + y * 2 * radiu + radiu), radiu);
        circle.index = x + y * 3;
        bigCircles.push(circle);
      }
    }
    return bigCircles;
  }
  _pointIsInCircle(point) {
    return this._bigContainer.findTouchCircle(point);
  }

  draw() {
    this._ctx.clearRect(0, 0, nWinW, nWinH);
    this._bigContainer.draw(this._ctx,  this._drawColor);
    this._lineContainer.draw(this._ctx, this._drawColor);
    if (this._tmpLine instanceof UILine) {
      this._tmpLine.draw(this._ctx);
    }
  }
}

function getTouchPoint(event) {
  let touch =  event.changedTouches[0];
  return new Point(touch.pageX, touch.pageY);
}



