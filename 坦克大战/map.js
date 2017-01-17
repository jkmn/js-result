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
        base: 'star.gif',
        steels: 'steels.gif'
      }
    }
  },
  scenes: {
    hero: {
      config: {
        shotInterval: 500, //射击间隔
        resurgenceTime: 3, //复活时间
        invincibleTime: 3, //无敌时间
        autoShot: false,
        shotKey: 'a',
      },
      scenes: [
        {
          parts: {
            tank: {
              entrys: [
                {
                  size: {
                    width: 60,
                    height: 60
                  },
                  hp: 1,
                  bulletAtk: 1,
                  speed: 30,
                  direction: 'u',
                  position: {x: 0, y: 840}
                }
              ]
            }
          }
        }
      ]
    },

   enemy: {
      config: {
        shotInterval: 500, //射击间隔
        resurgenceTime: 3, //复活时间
        invincibleTime: 0, //无敌时间
        autoShot: true
      },
      scenes: [
        {
          parts:{
            tank: {
              entrys: [{
                position: {x: 0, y: 0},
                step: ['d', 'r', 'd', 'l'],
                size: {
                  width: 60,
                  height: 60
                },
                hp: 1,
                bulletAtk: 1,
                speed: 2,
                direction: 'd',
              }]
            }
          }
        },
        {
          parts: {
            tank: {
              entrys: [
              {
                position: {x: 840, y: 0},
                step: ['d', 'l', 'd', 'r'],
                size: {
                  width: 60,
                  height: 60
                },
                hp: 1,
                bulletAtk: 1,
                speed: 2,
                direction: 'd',
              }]
            }
          }
        }
      ]
    },

    map: {
      scenes: [
        {
          parts:{"walls":{"entrys":[{"hp":1,"size":{"width":60,"height":60},"position":{"x":300,"y":840}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":300,"y":780}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":300,"y":720}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":300,"y":600}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":420,"y":540}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":600,"y":540}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":540,"y":360}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":300,"y":300}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":180,"y":360}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":180,"y":420}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":120,"y":480}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":240,"y":480}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":360,"y":780}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":420,"y":780}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":420,"y":840}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":480,"y":780}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":600,"y":720}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":600,"y":720}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":720,"y":600}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":720,"y":540}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":720,"y":420}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":780,"y":240}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":780,"y":180}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":720,"y":60}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":540,"y":120}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":480,"y":180}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":480,"y":240}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":300,"y":240}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":240,"y":180}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":120,"y":240}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":60,"y":360}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":0,"y":480}},{"hp":1,"size":{"width":60,"height":60},"position":{"x":0,"y":540}}]},"base":{"entrys":[{"hp":1,"size":{"width":40,"height":40},"position":{"x":370,"y":850}}]}}
        }
      ]
    }
  }
}