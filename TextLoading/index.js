/*
* @Author: cb
* @Date:   2017-01-12 08:04:36
* @Last Modified by:   cb
* @Last Modified time: 2017-01-12 10:54:09
*/

'use strict';

var textLoading = (() => {

  let aTexts = [], canvas = null, aTimers = [];
  function setSize(canvas, size) {
    let pixel = window.devicePixelRatio;
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;
    canvas.width = pixel * size.width;
    canvas.height = pixel * size.height;
  }

  let _defaultConfig = {
    color: '#000',
    fontSize: 15,
    fontName: 'Arial',
    distance: 8,
    height: 35,
    backgroundColor: '#eee',
    id: 'canvas',
    interval: 60
  }


  function createCanvas() {
    let canvas = document.createElement('canvas');
    return canvas;
  }


  function singleFn(fn) {
    let target = null;
    return () => {
      return target || (target = fn());
    }
  }

  let getCanvas = (() => {
    let isInsert = false;
    let canvasFn = singleFn(createCanvas);
    return () => {
      let canvas = canvasFn();
      if (!isInsert) {
        document.body.appendChild(canvas);
      }
      return canvas;
    }
  })();


  function setStyle(canvas) {
    canvas.style.backgroundColor = _defaultConfig.backgroundColor;
    canvas.id = _defaultConfig.id;
  }

  /**
   * [computeSize description]
   * @param  {[type]} len [description]
   * @return {[type]}     [description]
   */
  function computeSize(len) {
    let width = len * _defaultConfig.fontSize + (len + 1) * _defaultConfig.distance;
    let height = _defaultConfig.height;
    return new Size(width, height);
  }

  /**
   * 根据文字所在的位置计算绘制的中心点
   * @param  {[type]} index [description]
   * @return {[type]}       [description]
   */
  function computePointForIndex(index) {
    //x 公式: (i + 1) * (间距 + 1 / 2 * 宽度) + i * 宽度;
    let point = new Point(
      (index + 1) * (_defaultConfig.distance) + index * _defaultConfig.fontSize ,
      _defaultConfig.height * 2 / 3
    );
    console.log(point);
    return point;
  }

  /**
   * 定位每个文字所在的位置
   * @param  {Array}  aTexts [description]
   * @return {[type]}        [description]
   */
  function positionText(aTexts = []) {
    aTexts.forEach((text, i) => {
      text.point = computePointForIndex(i);
    });
  }

    /**
   * 根据字符串生成 UIText 数组
   * @param  {[type]} str [description]
   * @return {[UIText]}     [description]
   */
  function getUITextForString(str) {
    let a = [];
    for(let i = 0, char; char = str.charAt(i++ ); ) {
      a.push(
        new UIText(char, null, _defaultConfig.color, new UIFont(_defaultConfig.fontSize, _defaultConfig.fontName))
      );
    }
    return a;
  }

  let getCtx = (() => {
    let ctx;
    return canvas => {
      return  ctx || (ctx = canvas.getContext('2d'));
    }
  })();

  //开始运动
  function start() {
    aTexts.forEach((text, i) => {
       animationFn(text, i);
    });
  }

  function stop() {
    for( let timer of aTimers) {
      clearTimeout(timer);
    }
    aTimers = [];
  }

  function animationFn(text, i) {
    let step = 2, bottom = _defaultConfig.height * 4 / 5, top = _defaultConfig.fontSize + 5;
    setTimeout(function an () {
        let y = text.point.y + step;
        if (y >= bottom) {
          y = bottom;
          step = -step;
        } else if(y <= top) {
          y = top;
          step = -step;
        }
        text.point.updateY(y);
        draw();
        aTimers[i] = setTimeout(an, _defaultConfig.interval);
    }, i * 50);
  }

  function draw() {
    let ctx = getCtx(canvas);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    aTexts.forEach((text, i) => {
        text.draw(ctx);
    });
  }

  function config(config = {}) {
    _defaultConfig = Object.assign({}, _defaultConfig, config);
  }
  function show(text = '') {
    canvas = getCanvas();
    setSize(canvas, computeSize(text.length));
    setStyle(canvas);
    aTexts = getUITextForString(text);
    positionText(aTexts);
    start();
    draw();
    canvas.style.display = 'block';
  }
  function hide() {
    canvas.style.display = 'none';
    stop();
  }

  return {
    show: show,
    hide: hide,
    config: config
  }
})();

