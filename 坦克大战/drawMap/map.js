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
          parts:{
            base: {
              entrys: [
                {
                  size: {
                    width: 40,
                    height: 40
                  },
                  position: {
                    x: 430,
                    y: 860
                  }
                }
              ]
            },
            steels: {
              common: {
                size: {
                  width: 60,
                  height: 60
                },
                hp: -1,
              },
              entrys: [
                {position: {x: 360, y: 840}},
                {position: {x: 360, y: 780}},
                {position: {x: 420, y: 780}},
                {position: {x: 480, y: 780}},
                {position: {x: 480, y: 840}},
              ]
            },
            walls: {
              common:{
                size: {
                  width: 60,
                  height: 60
                },
              },
              entrys: [
                {position: {x: 0, y: 100}}
              ]
            },
          }
        }
      ]
    }
  }
}