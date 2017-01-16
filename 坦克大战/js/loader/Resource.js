/*
* @Author: cb
* @Date:   2017-01-13 11:48:55
* @Last Modified by:   cb
* @Last Modified time: 2017-01-14 17:23:04
*/

'use strict';
//资源记载器
class Resource {
  constructor(resource) {
    this._cache = {};
    this._finishCn = [];
    this._path = resource.path;
    this._loadResource(resource.images);
  }

  finish(cb) {
    this._finishCn.push(cb);
  }

  //缓存资源
  _cacheResources(resource) {
    if (Array.isArray(resource)) {
      resource.forEach(res => this._cacheResources(res));
    } else {
      let names = (resource.name || '').split(',');
      if (!names.length) {throw '资源格式存在错误 请使用{key:val}配置'}
      let res = this._cache;
      names.forEach((name, index) => {
        if (index == names.length - 1) {
          res[name] = resource;
        } else {
          let obj = res[name];
          if (!obj) {
            obj = res[name] = {};
          }
          res = obj;
        }
      });
    }
  }
  _loadResourceFinish() {
    this._finishCn.forEach(fn => {
      fn(this._cache);
    })
  }

  //加载资源
  _loadResource(resource) {
    this._promises = [];
    this._parseResource(resource);
    Promise.all(this._promises).then((imgs) => {
      this._cacheResources(imgs);
      this._loadResourceFinish();
    })
  }
  _parseResource(resource, names = []) {
    if (typeof resource == 'object') {
      Object.keys(resource).forEach(key => {
        this._parseResource(resource[key], names.concat(key));
      })
    } else {
      this._promises.push(
        this._loadImage(this._path + resource, names)
      )
    }
  }
  //加载图片资源
  _loadImage(src, names) {
    return new Promise((resolve, reject) => {
      let img = new Image;
      img.name = names;
      img.onload = () => resolve(img)
      img.src = src;
    });
  }
}
