/*
* @Author: cb
* @Date:   2017-01-13 09:13:04
* @Last Modified by:   cb
* @Last Modified time: 2017-01-16 15:56:30
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
          this._parseConfig();
          this._currentScene = null;
          this._init();
        });
      }

      _parseConfig() {
        let rect = this._rect = Rect.init(0, 0, this._config.size.width, this._config.size.height);
        delete this._config.size;
        let  target = {}, scenes = this._config.scenes, resources = this._config.resource;
        Object.keys(scenes).forEach(key => {
          let scene = scenes[key];
          let re = resources[key] || {};
          let config = scenes[key].config || {}; //场景的配置
          let scs = [];
          for(let s of scene.scenes) {
            s.rect = rect;
            s.config = Object.assign( config, s.config || {});
            Object.keys(s.parts).forEach(partName => {
              let part = s.parts[partName];
              let common = part.common;
              if (common) {delete part.common}
              for(let entry of part.entrys) {
                if (common) entry = Object.assign(entry, common);
                if (entry.size) {
                  entry.size = new Size(entry.size.width || 0, entry.size.height || 0);
                }
                if (entry.position) {
                  entry.point = new Point(entry.position.x, entry.position.y);
                }
                entry.resource = re[partName] || {};
              }
              s.parts[partName] = part.entrys;
            });
            scs.push(s);
          }
          scenes[key] = scs;
        });
        delete this._config.resource;
      }

      _init() {
        this._gameType = GameType.INIT;
        this._initRender();
        let startGameScene = new StartGame();
        startGameScene.event.on('start', this.startGame.bind(this));
        this._currentScene = startGameScene;
        this._start();
      }

      _initRender() {
        let renderer = this._renderer = new Renderer();
        renderer.setColor('#ccc');
        renderer.setSize(this._rect.width, this._rect.height);
        this._dom.appendChild(renderer.domElement);
      }

      startGame() {
        this._gameType = GameType.RUNING;
        let tankGame =  new TankGame(this._config);
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