/*
* @Author: cb
* @Date:   2017-01-13 09:13:04
* @Last Modified by:   cb
* @Last Modified time: 2017-01-15 00:47:41
*/

'use strict';



let Main = (
  () => {

    //坦克游戏
    class Main {
      constructor(config, dom) {
        this._config = config;
        this._dom = dom;
        new Resource(this._config.resource || {}).finish((resources) => {
          this._config.resource = resources;
          this._config.rect = Rect.init(0, 0, config.size.width, config.size.height);
          this._parseConfig();
          this._currentScene = null;
          this._init();
        });
      }

      _parseConfig() {
        Object.keys(this._config.resource).forEach(key => {
          let val = this._config.resource[key];
          Object.keys(val).forEach(k => {
            if (this._config[key] && this._config[key][k])
              this._config[key][k].resource = val[k];
          })
        });

        delete this._config.resource;
      }

      _init() {
        this._gameType = GameType.INIT;
        this._initRender();
        let startGameScene = new StartGameScene(this._config.rect);
        startGameScene.event.on('start', this.startGame.bind(this));
        this._currentScene = startGameScene;
        this._start();
      }

      _initRender() {
        let renderer = this._renderer = new Renderer();
        renderer.setColor('#ccc');
        renderer.setSize(this._config.size.width, this._config.size.height);
        this._dom.appendChild(renderer.domElement);
      }

      startGame() {
        this._gameType = GameType.RUNING;
        let tankGame =  new TankGame(this._config.rect, this._config);
        this._currentScene = tankGame;
      }

      _start() {
        if (this._currentScene) {
          this._renderer.renderer(this._currentScene);
        }
        requestAnimationFrame(() => {this._start()})
      }

    }

  return Main;
  }
)();