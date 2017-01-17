/*
* @Author: cb
* @Date:   2017-01-17 14:36:36
* @Last Modified by:   cb
* @Last Modified time: 2017-01-17 17:22:14
*/

'use strict';


var config = {
    size: {
    width: 900,
    height: 900
  },
  subline: true, //是否开启辅助线
  //资源
  resource: {
    path: '../img/',
    map:{
        walls: 'walls.gif',
        base: 'star.gif',
        steels: 'steels.gif',
        grass: 'grass.png'
    }
  },
  config: {
    walls: {
      hp: 1
    },
    base: {
      hp: 1
    },
    steels: {
      hp: -1,
    }
  }
}