/*
* @Author: cb
* @Date:   2017-01-13 09:13:04
* @Last Modified by:   cb
* @Last Modified time: 2017-01-13 14:35:45
*/

'use strict';



let TankGame = (
  () => {
    let _defaultConfig = {
      resource: {
        tank: {
          hero: {
            l: `./img/p1tankL.gif`,
            r: `./img/p1tankR.gif`,
            u: `./img/p1tankU.gif`,
            d: `./img/p1tankD.gif`
          },
          enemy: {
            l: `./img/p2tankL.gif`,
            r: `./img/p2tankR.gif`,
            u: `./img/p2tankU.gif`,
            d: `./img/p2tankD.gif`
          }
        },
        wall: './img/wall.gif',
        walls: './img/walls.gif',
        base: './img/star.gif'
      }
    }

    //坦克游戏
    class TankGame {
      constructor(config) {
        this._config = Object.assign({}, _defaultConfig, config);
        new Resource(this._config.resource || {}).finish((resources) => {
          this._cacheResources = resources;
          this._currentScene = null;
          this._init();
        });
      }

      _init() {
        this._gameType = GameType.INIT;
        this._initRender();
        let startGameScene = new StartGameScene(this._renderer.size);
        startGameScene.event.on('start', this.startGame.bind(this));
        this._currentScene = startGameScene;
        this._start();
      }

      _initRender() {
        let renderer = this._renderer = new Renderer();
        renderer.setColor('#ccc');
        renderer.setSize(this._config.width, this._config.height);
        this._config.parent.appendChild(renderer.domElement);
      }

      startGame() {
        this._gameType = GameType.RUNING;
        let tankGameScene =  new TankGameScene(this._renderer.size, this._cacheResources);
        this._currentScene =tankGameScene;
      }

      _start() {
        this._renderer.renderer(this._currentScene);
        requestAnimationFrame(() => {this._start()})
      }

    }

  return TankGame;
  }
)();