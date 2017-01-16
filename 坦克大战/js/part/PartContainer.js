/*
* @Author: cb
* @Date:   2017-01-13 08:33:29
* @Last Modified by:   cb
* @Last Modified time: 2017-01-14 14:38:31
*/

'use strict';

class PartContainer {
  //初始化画布
  constructor() {
    this._partContainer = {};
  }

  get partContainer(){
    return this._partContainer;
  }

  add(part) {
    // if(! (part instanceof Part)) {throw 'part 必须是Part的实例'}
    this._partContainer[part._uid] = part;
  }

  remove(part) {
    if (this._partContainer[part._uid]) delete this._partContainer[part._uid];
  }

  clear() {
    this._partContainer = {};
  }

  draw(ctx) {
    Object.keys(this._partContainer).forEach(uid => {
      let part = this._partContainer[uid];
      if(part) {
        if (part.isDie()) {
          delete this._partContainer[uid];
        } else {
          part.draw(ctx);
        }
      }
    });
  }


}