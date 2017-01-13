/*
* @Author: cb
* @Date:   2017-01-13 11:52:30
* @Last Modified by:   cb
* @Last Modified time: 2017-01-13 18:00:50
*/

'use strict';

const Rule = {
  hero: 'hero',
  enemy: 'enemy'
}

class TankGameScene extends GameScene {
  constructor(size, resources = {}) {
    super(size);
    this._tankSize = new Size(60, 60);
    this._walls = [];
    this._generateBullteInterval = 1000; //子弹生成的间隔时间

    this._enemyTanks = {}; //敌人的坦克
    this._enemyNum = 2; //敌人生成坦克的数量
    this._enemyShotInterval = 1;
    this._enemyTankPoints = [new Point(0, 0), new Point(size.width - this._tankSize.width, 0)];
    this._enemyBullets = {};//敌人子弹的集合

    this._timerStop = false; //时间停止

    this._heroTank = null; //我方坦克
    this._heroBullets = {}; //英雄子弹集合
    this._base = null; //基地

    this._resources = resources;

    this._initBase();
    this._initEnemyTanks();
    this._initHeroTank();
    this._addEvent();
    this._run();
  }

  _addEvent() {
    document.body.addEventListener('keydown', this, false);
  }

  handleEvent(event) {
    switch(event.type) {
      case 'keydown':
        this._onKeyDown(event);
      break;
    }
    event.stopPropagation();
  }

  _onKeyDown(event) {
    if (!this._heroTank) return;
    //上: 38  下: 40 左: 37 右: 39
    let speed = 8;
    switch(event.keyCode) {
      case 37:
        this._heroTank.move(-speed, 0,Direction.L);
      break;
      case 38:
        this._heroTank.move(0, -speed, Direction.U);
      break;
      case 39:
        this._heroTank.move(speed, 0, Direction.R);
      break;
      case 40:
        this._heroTank.move(0, speed, Direction.D);
      break;
    }
  }

  _run() {
    this._tanksShot();
  }

  draw(ctx) {
    this._bulletsFly();
    super.draw(ctx);
  }
  /**
   * 子弹你飞行
   * @return {[type]} [description]
   */
  _bulletsFly() {
    // if (this._isDetect) return false;
    this._isDetect = true;
    Object.keys(this._heroBullets).forEach(uid => {
      let bullet = this._heroBullets[uid];
      if (bullet) {
        bullet.fly();
        this._detectBullet(bullet, Rule.hero);
      }
    });

    Object.keys(this._enemyBullets).forEach(uid => {
      let bullet = this._enemyBullets[uid];
      if (bullet) {
        bullet.fly();
        this._detectBullet(bullet, Rule.enemy);
      }
    });
    // this._isDetect = false;
  }

  /**
   * 检测子弹
   * @param  {[type]} bullet [description]
   * @param  {[type]} rule   [description]
   * @return {[type]}        [description]
   */
  _detectBullet(bullet, rule) {
    if (this._isOutRange(bullet)){
      this._destoryBullet(bullet);
    } else {
      this._detectTankAndBulletCollision(rule == Rule.hero ? this._enemyTanks : this._heroTank, bullet) ||
      this._detectBulletCollision(bullet, rule == Rule.hero ? this._enemyBullets : this._heroBullets);
    }
  }

  /**
   * 检测坦克和子弹的碰撞
   * @param  {[type]} tanks  [description]
   * @param  {[type]} bullet [description]
   * @return {[type]}        [description]
   */
  _detectTankAndBulletCollision(tanks, bullet) {
    if (!tanks) return;
    if (tanks instanceof TankPart) {
      let t = {};
      t[tanks._uid] = tanks;
      tanks = t;
    }
    for(let uid in tanks) {
      let tank = tanks[uid];
      if (!tank) continue;
      if (this._detectPartCollision(bullet, tank) && !tank.isInvicible) {
        this._destoryBullet(bullet);
        if (tank == this._heroTank) {
            this._rebirthHeroTank();
        } else {
          this._generateEnemyTank(tank.index);
        }
        this._destoryTank(tank);
        return true;
      }
    }
    return false;
  }



  //检测子弹之间的碰撞
  _detectBulletCollision(bullet, bullets) {
    for(let uid in bullets) {
      let b = bullets[uid];
      if (this._detectPartCollision(b, bullet)) {
        this._destoryBullet(bullet);
        this._destoryBullet(b);
        return true;
      }
    }
    return false;
  }

  /**
   * 检测两个部件是否碰撞
   * @param  {[type]} part1 [description]
   * @param  {[type]} part2 [description]
   * @return {[type]}       [description]
   */
  _detectPartCollision(part1, part2) {
    let sx1 = part1.rect.x,
        ex1 = part1.rect.x + part1.rect.width,
        sy1 = part1.rect.y,
        ey1 = part1.rect.y + part1.rect.height,
        sx2 = part2.rect.x,
        ex2 = part2.rect.x + part2.rect.width,
        sy2 = part2.rect.y,
        ey2 = part2.rect.y + part2.rect.height;
    return (((sx1 >= sx2 && sx1 <= ex2) || (ex1 >= sx2 && ex1 <= ex2)) && ((sy1 >= sy2 && sy1 <= ey2) || (ey1 > sy2 && ey1 < ey2)));
  }

  /**
   * 销毁坦克
   * @param  {[type]} tank [description]
   * @return {[type]}      [description]
   */
  _destoryTank(tank) {
    if (tank == this._heroTank) {
      this._heroTank = null;
    } else {
      delete this._enemyTanks[tank._uid];
    }

    this._destoryBullet(tank);
  }

  /**
   * 销毁子弹
   * @param  {[type]} bullet [description]
   * @param  {[type]} rule   [description]
   * @return {[type]}        [description]
   */
  _destoryBullet(bullet) {
    let index, bullets = this._heroBullets;
    if (bullets[bullet._uid]) {
      delete bullets[bullet._uid];
    } else {
      bullets = this._enemyBullets;
      if (bullets[bullet._uid]) delete bullets[bullet._uid];
    }
    this._destoryPart(bullet);
  }

  /**
   * 销毁部件
   * @param  {[type]} part [description]
   * @return {[type]}      [description]
   */
  _destoryPart(part) {
    this._scene.remove(part);
  }

  /**
   * 检测部件是否移出范围
   * @param  {[type]}  part [description]
   * @return {Boolean}      [description]
   */
  _isOutRange(part) {
    return part.rect.x < this._rect.x || part.rect.x + part.rect.width > this._rect.width || part.rect.y < this._rect.y || part.rect.y + part.rect.width > this._rect.height;
  }

  /**
   * 坦克射击
   * @return {[type]} [description]
   */
  _tanksShot() {

    if (this._heroTank) {
      let bullet = this._heroTank.shot();
      this._heroBullets[bullet._uid] = bullet;
      this._scene.add(bullet);
    }

    if (!this._timerStop) {
      Object.keys(this._enemyTanks).forEach(key => {
        let tank = this._enemyTanks[key];
        if (tank) {
          let bullet = tank.shot();
          this._enemyBullets[bullet._uid] = bullet;
          this._scene.add(bullet);
        }
      });
    }

    setTimeout(this._tanksShot.bind(this), this._generateBullteInterval);
  }



  /**
   * 初始化基地
   * @return {[type]} [description]
   */
  _initBase() {
    let size = new Size(40, 40);
    let point = new Point((this._size.width - size.width) / 2, this._size.height - size.height);
    let base = this._base = new BasePart(point, size);
    base.resource = this._resources.base;
    this._scene.add(base);
  }

  /**
   * 重生英雄
   * @return {[type]} [description]
   */
  _rebirthHeroTank() {
    setTimeout(this._initHeroTank.bind(this), 1000);
  }

  /**
   * 初始化英雄坦克
   * @return {[type]} [description]
   */
  _initHeroTank() {
    this._heroTank = this._generateTank(new Point(0, this._size.height - this._tankSize.height), this._resources.tank.hero, Direction.U);
    this._heroTank.invincibleTime = 3;
    this._scene.add(this._heroTank);
  }
  /**
   * 初始化敌方坦克
   */
  _initEnemyTanks() {
    for(let i = 0; i < this._enemyNum; i++) {
      this._generateEnemyTank(i);
    }
  }

  _generateEnemyTank(index) {
    let point = this._enemyTankPoints[index % 2];
    let tank = this._enemyTanksGenerate(point);
    tank.index = index;
    this._scene.add(tank);
  }

  /**
   * 敌坦克生成器
   * @param  {[type]} point [description]
   * @return {[type]}       [description]
   */
  _enemyTanksGenerate(point){
    let enemyTank = this._generateTank(point, this._resources.tank.enemy, Direction.D)
    this._enemyTanks[enemyTank._uid] = enemyTank;
    return enemyTank;
  }

  /**
   * 坦克生成器
   * @param  {[type]} point     [description]
   * @param  {[type]} resources [description]
   * @param  {[type]} direction [方向]
   * @return {[type]}           [description]
   */
  _generateTank(point, resource, direction) {
    let tank = new TankPart(point, this._tankSize, direction);
    tank.resource = resource;
    return tank;
  }


  /**
   * 载入资源
   * @param  {[type]} resources [description]
   * @return {[type]}           [description]
   */
  loadResource(resources) {
    this._resources = resoures;
  }

}