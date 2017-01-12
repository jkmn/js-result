/*
* @Author: cb
* @Date:   2017-01-12 15:14:31
* @Last Modified by:   cb
* @Last Modified time: 2017-01-12 16:48:33
*/

'use strict';

class DumImage {

  static createCanvas() {
    let canvas = document.createElement('canvas');
    return canvas;
  }

  static _transformPoint(x, y, num) {
    return 4 * x + y * num * 4;
  }

  static _getOriginImageData(img) {
    let canvas = DumImage.createCanvas();
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, img.width, img.height);
  }

  static _computDumData(imageData, radiu) {
    let data = imageData.data;
    let dumData = new Uint8ClampedArray(data.length);
    for(var y = 0; y < imageData.height; y++ ) {
      for(var x = 0; x < imageData.width; x++) {
        let i = DumImage._transformPoint(x, y, imageData.width);
        let dum = DumImage._computeSinglePointDumNum(imageData, x, y, radiu);
        dum.forEach((num, index) => {
          dumData[i + index] = num;
        })
      }
    }

    for(var y = 0; y < imageData.height; y++ ) {
      for(var x = 0; x < imageData.width; x++) {
        let i = this._transformPoint(x, y, imageData.width);
        for(var l = 0; l < 4; l++) {
          imageData.data[i + l] = dumData[i + l];
        }
      }
    }
    return imageData;
  }

  // /**
//  * 计算单个点的像素的模糊值
//  * @param  {[type]} imageData [description]
//  * @param  {[type]} x         [description]
//  * @param  {[type]} y         [description]
//  * @param  {Number} radiu     模糊半径
//  * @return {[type]}           [description]
//  */
  static _computeSinglePointDumNum(imageData, x, y, radiu = 5) {
    let startX = x - radiu, startY= y - radiu, endX = x + radiu, endY = y + radiu, data = imageData.data, num = 0;
    let target = {
      r: 0,
      g: 0,
      b: 0,
      a: 0
    }
    for(let y = startY; y <= endY; y ++) {
      if (y < 0 || y >= imageData.height) continue;
      for(let x = startX; x <= endX; x ++ ) {
        if (x < 0 || x >= imageData.width) continue;
        let i = DumImage._transformPoint(x, y, imageData.width);
        target.r += data[i];
        target.g += data[i + 1];
        target.b += data[i + 2];
        target.a += data[i + 3];
        num++;
      }
    }
    return [target.r / num,target.g / num,target.b / num,target.a / num]
  }

  static dumpForSrc(src, radiu) {
    return new Promise((resolve, reject) => {
      this.loadImage(src).then(img => {
        resolve(DumImage._computDumData(DumImage._getOriginImageData(img), radiu));
      })
    });
  }

  static loadImage(src) {
    return new Promise((resolve, reject) => {
      let img = new Image;
      img.onload = () => resolve(img)
      img.onerror = () => reject(img)
      img.src = src;
    });
  }
}