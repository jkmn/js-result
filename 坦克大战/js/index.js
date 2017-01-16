/*
* @Author: cb
* @Date:   2017-01-13 08:28:48
* @Last Modified by:   cb
* @Last Modified time: 2017-01-14 17:24:55
*/

'use strict';

Object.isObject = (obj) => {
  return Object.prototype.toString.call(obj) == '[object Object]';
}

function deepCopy(target = {}, source) {
  for(let key in source) {
    if (source.hasOwnProperty(key)) {
      if (Object.isObject(source[key])) {
        target[key] = deepCopy(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}


let tankGame = new Main(mapConfig, document.body);