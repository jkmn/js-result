/*
* @Author: cb
* @Date:   2017-01-13 11:25:24
* @Last Modified by:   cb
* @Last Modified time: 2017-01-13 11:33:07
*/

'use strict';

class Event {
  constructor() {
    this._handlers = {};
  }

  on(name, handler) {
    this._handlers[name] = this._handlers[name] || [];
    this._handlers[name].push(handler);
  }

  rm(name,handler) {
    let handlers = this._handlers[name] || [];
    if (handlers.length) {
      let index = handlers.indexOf(handler);
      if (index != -1) {
        hadlers.splice(index, 1);
      }
    }
  }

  emit() {
    let args = [...arguments];
    let name = args.shift();
    let handlers = this._handlers[name] || [];
    handlers.forEach(handler => {
      handler.apply(null, args);
    })
  }
}