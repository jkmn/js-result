/*
* @Author: cb
* @Date:   2017-01-18 15:00:33
* @Last Modified by:   cb
* @Last Modified time: 2017-01-18 17:27:11
*/

'use strict';

let canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');
let img = document.querySelector('img');

let loadImg = new Image;
loadImg.onload = () => {
  console.log(1)
  let imgW = img.naturalWidth, imgH = img.naturalHeight;
  canvas.width = imgW;
  canvas.height = imgH;
  canvas.style.width = imgW + 'px';
  canvas.style.height = imgH + 'px';
  ctx.drawImage(img, 0, 0, imgW, imgH);
  let imgData =  ctx.getImageData(0, 0, imgW, imgH);
  let w = imgW, h = imgH;

  let l = Math.sqrt(w * w + h * h);
  let dot = l / 40;
  let ang = 4;

  let cx = w / 2 + Math.cos(ang) * dot, cy = h / 2 + Math.sin(ang) * dot;

  let a = [];

  let id = 1;

  function Dot(x, y) {
    this._x = x;
    this._y = y;
    this._size = 0;
  }

  Dot.prototype.draw = function(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = '#000';
    let size = this.getV() == 0 ? 0 : 1 - this.getV();
    ctx.arc(this._x, this._y, dot / 2 * size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  Dot.prototype.getV = function() {
    let x = Math.round(this._x);
    let y = Math.round(this._y);
    let index = ((y * w) + x) * 4;
    let data = imgData.data;

    if ( x < 0 || x > w || y < 0 || y > h ) {
      return 0;
    }

    let r = data[index + 0] / 255;
    let g = data[index + 1] / 255;
    let b = data[index + 2] / 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let t = (max + min) / 2;
    if (id == 1) {
        console.log(t);
        id++;
    }
    if ( t > 0.99) return 0;
    return t;

  }






  document.querySelector('input').onblur = function() {
    let num = parseInt(this.value);
    dot = l / num;
    console.log(dot)
    draw();
  }
  draw();

  function draw() {
    a = [];
    ctx.clearRect(0, 0, w, h);
    let d = Math.max(w, h) * Math.sqrt(2);

    let m = Math.ceil((d + dot) / dot);

    for(let i = 0; i < m; i++) {
      let n = i * 6 || 1;
      for (let j = 0; j < n; j++) {
        let t = Math.PI * 2 * j / n;
        let x = cx + Math.cos(t) * i * dot;
        let y = cy + Math.sin(t) * i * dot;
        a.push(new Dot(x, y));
      }
    }
    a.forEach(_a => _a.draw(ctx));
  }
}

loadImg.src = img.src;




