/*
* @Author: cb
* @Date:   2017-01-17 14:38:03
* @Last Modified by:   cb
* @Last Modified time: 2017-01-17 17:25:30
*/

'use strict';



class Part {
  constructor(point, size) {
    this._uid = ++Part._uid;
    this._point = point;
    this._size = size;
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    this._draw(ctx);
    ctx.closePath();
    ctx.restore();
  }
  _draw(ctx) {
    throw "子类必须实现_draw 方法";
  }

  isContainerPoint(point) {
    return point.x > this._point.x && point.y > this._point.y && point.x < this._size.width + this._point.x && point.y < this._size.height + this._point.y;
  }

  get point() {
    return this._point;
  }

  get size() {
    return this._size;
  }

  get center () {
    if (this._point && this._size) {
      return new Point((this._size.width / 2 + this._point.x ), (this._size.height  / 2 + this._point.y));
    }
  }

  set center(point) {
    this._point = new Point(point.x - this._size.width / 2, point.y - this._size.height / 2);
  }
}

Part._uid = 0;


class RectPart extends Part {
  constructor(point, size) {
    super(point, size);
    this._point = point;
    this._size = size;
    this._color = '#ccc';
  }

  _draw(ctx){
    ctx.strokeStyle = this._color;
    ctx.strokeRect(this._point.x, this._point.y, this._size.width, this._size.height);
  }

  set color(color) {
    this._color = color;
  }
}


class ImgPart extends Part {
  constructor(name,point, size, imgData) {
    super(point, size);
    this._name = name;
    this._imgData = imgData;
  }

  copy() {
    return new ImgPart(this._name, this._point, this._size, this._imgData);
  }

  get size () {
    return this._size;
  }

  get point() {
    return this._point;
  }
  set point(point) {
    this._point = point;
  }

  get name() {
    return this._name;
  }

  _draw(ctx) {
    if (this._point) {
      ctx.drawImage(this._imgData, 0, 0, this._size.width, this._size.height, this._point.x, this._point.y, this._size.width, this._size.height);
    }
  }
}



class Container {
  constructor() {
    this._container = {};
  }
  add(part) {
    this._container[part._uid] = part;
  }
  draw(ctx) {
    for(let uid in this._container) {
      if (this._container.hasOwnProperty(uid)) {
        this._container[uid].draw(ctx);
      }
    }
  }

  get container() {
    return this._container;
  }
}


class LoadResource {
  constructor(_resource) {
    this._resource = _resource;
    this._cacheResources = {};
    this._loadResource();
    this._event = new Event();
  }

  _loadResource() {

    let path = this._resource.path;
    let promoses = Object.keys(this._resource.map).map(name => {
      return this._loadImage(name, path + this._resource.map[name])
    });
    Promise.all(promoses).then(data => {
      data.forEach(img => {
        this._cacheResources[img.name] = img;
      });
      this._event.emit('finish', this._cacheResources);
    })
  }

  _loadImage(name, src) {
    return new Promise((resolve, reject) => {
      let img = new Image;
      img.name = name;
      img.onload = () => {resolve(img)}
      img.src = src;
    });
  }
  on(name, handle) {
    this._event.on(name, handle);
  }
}


class ImgView {
  constructor(name, imgData) {
    this._name = name;
    this._imgData = imgData;
    this._size = new Size(imgData.width, imgData.height);
    this._view = null;
    this._event = new Event();
    this._initView();
  }
  on(name, handle) {
    this._event.on(name, handle);
  }

  get name() {
    return this._name;
  }
  get size() {
    return this._size;
  }

  get imgData() {
    return this._imgData;
  }

  _initView() {
    let li = this._view =  document.createElement('li');
    let img = document.createElement('img');
    img.src = this._imgData.src;
    li.appendChild(img);
    li.addEventListener('click', () => {this._event.emit('click', this)}, false);
  }

  get view() {
    return this._view;
  }
}

class ImgListView {

  constructor(imgDatas) {
    this._imgData = imgDatas;
    this._views = [];
    this._event = new Event();
    this._initView();
  }

  on(name, handle) {
    this._event.on(name, handle);
  }

  _initView() {
    this._views = Object.keys(this._imgData).map(name => {
      let img = this._imgData[name], view = new ImgView(name, img)
      view.on('click', this._onClick.bind(this));
      return view;
    });
  }
  _onClick(view) {
    this._views.forEach(view => view.view.classList.remove('checked'));
    view.view.classList.add('checked');
    this._event.emit('click', view);
  }

  appendToParent(parent) {
    this._views.forEach(view => {
      parent.appendChild(view.view);
    })
  }

}

class CanvasView {
  constructor(config) {
    this._config = config;
    this._size = new Size(config.size.width, config.size.height);
    this._initCanvas();
    this._ctx = this._canvas.getContext('2d');
    this._container = new Container();
    this._prevRect = null;
    this._rectContainer = [];
    this._currentView = null;
    if (this._config.subline) {
      this._createSubline();
    }
    this._draw();
    this._addEvent();
  }

  _addEvent() {
    this._canvas.addEventListener('mousemove', this, false);
    this._canvas.addEventListener('mouseover', this, false);
    this._canvas.addEventListener('mouseout', this, false);
    this._canvas.addEventListener('click', this, false);
  }

  handleEvent(event) {
    if (!this._currentView) return;
    switch(event.type) {
      case 'mouseover':
      case 'mousemove':
        this._onMouseMove(event);
      break;
      case 'mouseout':
        this._onMouseOut(event);
      break;
      case 'click':
        this._onClick(event);
      break;
    }
  }
  _onClick(event) {
    if (this._currentView && this._prevRect) {
      let part = this._currentView.copy();
      part.center = this._prevRect.center;
      this._container.add(part);
    }
  }
  _onMouseOut(event) {
    this._currentView.point = null;
    if (this._prevRect) {
      this._prevRect.color = '#ccc';
      this._prevRect = null;
    }
  }

  _onMouseMove(event) {
    let size = this._currentView.size;
    let point = new Point(event.offsetX, event.offsetY);
    point.minus(new Point(size.width / 2, size.height / 2));
    this._currentView.point = point;
    this._meetRect();
  }

  _meetRect() {
    if (!this._config.subline || !this._currentView) return;
    let center = this._currentView.center;
    let index = Math.floor(center.x / 60) + 15 * Math.floor(center.y / 60);
    let rect = this._rectContainer[index];
    if (rect == this._prevRect) return;
    this._prevRect && (this._prevRect.color = '#ccc');
    rect.color = 'red';
    this._prevRect = rect;
  }

  updateView(view) {
    this._currentView = new ImgPart(view.name, null, view.size, view.imgData);
  }
  /**
   * 绘制辅助线
   * @return {[type]} [description]
   */
  _createSubline() {
    let interval = 60, num = this._size.width / interval;
    for (let y = 0; y < num ; y++) {
      for(let x = 0; x < num; x++) {
        let rect = new RectPart(new Point(x * interval, y * interval), new Size(interval, interval));
        this._rectContainer.push(rect);
      }
    }
  }

  /**
   * 初始话画布
   * @return {[type]} [description]
   */
  _initCanvas() {
    let canvas = this._canvas = document.createElement('canvas');
    canvas.style.width = this._size.width + 'px';
    canvas.style.height = this._size.height + 'px';
    canvas.width = this._size.width;
    canvas.height = this._size.height;
    document.querySelector('.right').appendChild(canvas);
  }

  _draw() {
    this._ctx.clearRect(0, 0, this._size.width, this._size.height);
    this._currentView && this._currentView.draw(this._ctx);
    this._container.draw(this._ctx);
    this._rectContainer.forEach(rect => rect.draw(this._ctx));
    requestAnimationFrame(this._draw.bind(this));
  }

  getConfig() {
    let container = this._container.container;
    let scenes = {};
    Object.keys(container).forEach(uid => {
      let part = container[uid];
      let c = {
        size: {width: part.size.width, height: part.size.height},
        position: {x: part.point.x, y: part.point.y}
      }
      scenes[part.name] = scenes[part.name] || {};
      scenes[part.name].entrys = scenes[part.name].entrys || [];
      c = Object.assign({}, this._config.config[part.name] || {}, c);
      scenes[part.name].entrys.push(c);
    });
      console.log(JSON.stringify(scenes));
  }


}


class DrawMapController {
  constructor(config) {
    this._config = config;
    let canvasView = new CanvasView(config);
    let loadResource = new LoadResource(config.resource);
    loadResource.on('finish', (resource) => {
      let imgListView = new ImgListView(resource);
      imgListView.appendToParent(document.querySelector('.left ul'));
      imgListView.on('click', (view) => {
        canvasView.updateView(view);
      })
    })
    window.addEventListener('keypress', function(event) {
      if(event.keyCode == 115) {
        canvasView.getConfig();
      } 
    }, false)
  }


}


let drawController = new DrawMapController(config);

