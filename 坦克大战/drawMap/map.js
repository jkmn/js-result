var mapConfig = {
  size: {
    width: 900,
    height: 900
  },
  //资源
  resource: {
    path: './img/',
    images: {
      hero: {
        tank: {
          l: 'p1tankL.gif',
          r: 'p1tankR.gif',
          u: 'p1tankU.gif',
          d: 'p1tankD.gif'
        }
      },
      enemy: {
        tank: {
          l: 'p2tankL.gif',
          r: 'p2tankR.gif',
          u: 'p2tankU.gif',
          d: 'p2tankD.gif'
        },
      },
      map:{
        wall: 'wall.gif',
        walls: 'walls.gif',
        base: 'star.gif'
      }
    }
  },
  hero: {
    config: {
      shotInterval: 500, //射击间隔
      resurgenceTime: 3, //复活时间
      invincibleTime: 3, //无敌时间
      autoShot: false,
      shotKey: 'a'
    },
    tank: {
      size: {
        width: 60,
        height: 60
      },
      hp: 1,
      bulletAtk: 1,
      speed: 30,
      direction: 'u',
      //出生地点
      position: {
        x: 0,
        y: 840
      }
    }
  },

 enemy: {
    config: {
      shotInterval: 500, //射击间隔
      resurgenceTime: 3, //复活时间
      invincibleTime: 0, //无敌时间
      autoShot: true
    },
    tank: {
      size: {
        width: 60,
        height: 60
      },
      step: ['d', 'l'],
      hp: 1,
      bulletAtk: 1,
      speed: 1,
      direction: 'd',
      positions: [
        {
          x:0,
          y:0
        },
        {
          x: 840,
          y: 0
        }
      ]
    }
  },

  map: {
    base: {
      size: {
        width: 40,
        height: 40
      },
      position: {
        x: 430,
        y: 860
      }
    },
    walls: {
      size: {
        width: 60,
        height: 60
      },
      positions: [
        {
          x: 360,
          y: 840
        },
        {
          x: 360,
          y: 780
        },{
          x: 420,
          y: 780
        },{
          x: 480,
          y: 780
        },
        {
          x: 480,
          y: 840
        }
      ]
    }
  }
}