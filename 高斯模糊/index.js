/*
* @Author: cb
* @Date:   2017-01-12 15:14:31
* @Last Modified by:   cb
* @Last Modified time: 2017-01-12 22:36:22
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
    let blurs = fnBlur(radiu);
    DumImage._each(0, imageData.height, (y) => {
      DumImage._each(0, imageData.width, (x) => {
        let index = DumImage._transformPoint(x, y, imageData.width);
        let dum = DumImage._computeSinglePointDumNum(imageData, x, y, radiu, blurs);
        for(var i = 0; i < 3; i++) {
          dumData[index + i] = dum[i];
        }
        dumData[index + 3] = data[index + 3];
      });
    });
   for(var i = 0, l = data.length; i < l; i++) {
      data[i] = dumData[i];
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
  static _computeSinglePointDumNum(imageData, x, y, radiu, blurs) {

    let target = {
      r: 0,
      g: 0,
      b: 0,
    }, data = imageData.data;
    let i = 0;
    DumImage._eachImageDataRange(imageData, x, y, radiu, (_tmpX, _tmpY, _x, _y) => {
      let index = DumImage._transformPoint(_tmpX, _tmpY, imageData.width);
      target.r += data[index] * blurs[i];
      target.g += data[index + 1] * blurs[i];
      target.b += data[index + 2] * blurs[i];
      i++;
    });

    return Object.values(target);
  }

  static _eachImageDataRange(imageData,x, y, radiu, cb) {
    let startX = x - radiu, startY= y - radiu, endX = x + radiu, endY = y + radiu, data = imageData.data;
     DumImage._each(startY, endY, (_y) => {
      let _tmpY = _y;
      if (_y < 0) {
        _tmpY = imageData.height + _y;
      } else if(_y >= imageData.height) {
        _tmpY = _y - imageData.height;
      }
      DumImage._each(startX, endX, (_x) => {
        let _tmpX = _x;
        if (_x < 0) {
          _tmpX = imageData.width + _x;
        } else if (_x >= imageData.width) {
          _tmpX = _x - imageData.width;
        }
        cb(_tmpX, _tmpY, _x, _y);
      })

    })
  }

  static _each(start = 0, end = 0, cb, step = 1) {
    for(var i = start; i < end; i+= step) {
      cb(i);
    }
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

  /**
   * 高斯模糊算法
   * 公式:
   *              2     2        2
   *     1    -(x   + y  ) / 2 a
   *   ----- e
   *       2
   *    2派a
   * 参考地址 http://www.ruanyifeng.com/blog/2012/11/gaussian_blur.html
   *         http://blog.csdn.net/markl22222/article/details/10313565
   * @param  {[type]} x [description]
   * @param  {[type]} y [description]
   * @param  {[type]} a [description]
   * @return {[type]}   [description]
   */

function fnBlur(radiu) {
  let blurs = [], a = radiu / 3, total = 0;
  for(let x = -radiu; x < radiu; x++) {
    for(let y = -radiu; y < radiu; y++) {
      let b = Math.exp(-(x * x + y * y) / (2 * a * a)) / (2 * a * a * Math.PI);
      total += b;
      blurs.push(b);
    }
  }

  return blurs.map(b => b / total);

}

