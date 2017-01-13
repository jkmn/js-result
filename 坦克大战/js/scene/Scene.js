/*
* @Author: cb
* @Date:   2017-01-13 08:33:29
* @Last Modified by:   cb
* @Last Modified time: 2017-01-13 15:41:07
*/

'use strict';

class Scene {
  //初始化画布
  constructor() {
    this._partContainer = [];
  }

  add(part) {
    // if(! (part instanceof Part)) {throw 'part 必须是Part的实例'}
    this._partContainer.push(part);
  }

  remove(part) {
    let index = this._partContainer.indexOf(part);
    if (index != -1) {
      this._partContainer.splice(index, 1);
    }
  }

  clear() {
    this._partContainer = [];
  }

  draw(ctx) {
    this._partContainer.forEach(part => part.draw(ctx));
  }


}