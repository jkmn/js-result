/*
* @Author: cb
* @Date:   2017-01-13 10:27:32
* @Last Modified by:   cb
* @Last Modified time: 2017-01-13 11:02:06
*/

'use strict';

class Renderer {
  constructor() {
    this._canvas = document.createElement('canvas');
    this._ctx = this._canvas.getContext('2d');
  }
  setSize(width, height) {
    this._size = new Size(width, height);
    this._canvas.style.width = `${width}px`;
    this._canvas.style.height = `${height}px`;
    this._canvas.width = width;
    this._canvas.height = height;
  }
  setColor(color) {
    this._canvas.style.backgroundColor = color;
  }

  get size() {
    return this._size;
  }

  clear() {
    this._ctx.clearRect(0, 0, this._size.width, this._size.height)
  }
  renderer(scene) {
    this.clear();
    scene.draw(this._ctx);
  }
  get domElement() {
    return this._canvas;
  }
}