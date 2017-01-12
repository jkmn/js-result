/*
* @Author: cb
* @Date:   2017-01-12 08:04:36
* @Last Modified by:   cb
* @Last Modified time: 2017-01-12 08:33:42
*/

'use strict';

var textLoading = (() => {


  let canvas = document.createElement('canvas');
  canvas.style.backgroundColor = '#ccc';
  setSize(canvas, new Size(200));
  document.body.appendChild(canvas);

  let ctx = canvas.getContext('2d');
  let slice = Array.prototype.slice;
  let text = '等待加载...';


  function setSize(canvas, size) {
    let pixel = window.devicePixelRatio;
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;
    canvas.width = pixel * size.width;
    canvas.height = pixel * size.height;
  }
})();

