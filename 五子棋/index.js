/*
* @Author: cb
* @Date:   2017-01-09 16:45:25
* @Last Modified by:   cb
* @Last Modified time: 2017-01-11 14:38:54
*/

'use strict';
const PIECE_COLOR  = {
  BLACK: 'black',
  WHITE: 'red',
  NONE: null
}

const ADD_TYPE = {
  SUCCESS: 'success',
  FAIL: 'fail',
  FINISH: 'finish'
}

class Board {
  constructor(x, y) {
    this._x = x;
    this._y = y;
    this._lastPiece = null;
    this._isGameOver = false;
    this._init();
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get lastPiece() {
    return this._lastPiece;
  }

  _init () {
    this._board = new Array(this._y);
    for(var y = 0; y< this._y; y++) {
      this._board[y] = this._board[y] || new Array(this._x);
      for(var x = 0; x < this._x; x++) {
        this._board[y][x] = null;
      }
    }
  }
  addPiece(piece) {
    if (this._board[piece.y][piece.x] != null) return ADD_TYPE.FAIL;
    this._board[piece.y][piece.x] = piece;
    this._lastPiece = piece;
    if (this._checking(piece)){
      this._isGameOver = true;
      return ADD_TYPE.FINISH;
    }
    return ADD_TYPE.SUCCESS;
  }

  _checking (piece = null) {
    return !piece ? this._checkingBoard() : this._checkingPiece(piece);
  }

  _checkingBoard () {
    for(var y = 0; y < this._y; y ++) {
      for (var x = 0; x < this._x; x++) {
        if (this._board[y][x] != null && this._checkingPiece(this._board[y][x])) {
          //获胜
          return true;
        }
      }
    }
    return false;
  }
  _checkingPiece (piece) {
    let post = 1, x = piece.x, y = piece.y, _p = null, step = {
      t: 0,
      v: 0,
      l: 0,
      r: 0
    };
    for ( var i = -4; i < 5; i++) {
      if (i == 0) continue;

      step.t += this._isEqualColorPiece((x, y) => {
        if (x + i >= 0 && x + i < this._x) return true;
      }, (x, y) => {
        return this._board[y][x + i];
      },piece) ? 1 : -step.t;

      step.v += this._isEqualColorPiece((x, y) => {
        if (y + i >= 0 && y + i < this._y) return true;
      }, (x, y) => {
        return this._board[y + i][x];
      }, piece) ? 1 : -step.v;

      step.l += this._isEqualColorPiece((x, y) => {
        if (x + i >= 0 && y + i >= 0 && x + i < this._x && y + i < this._y) return true;
      }, (x, y) => {
        return this._board[y + i][x + i];
      }, piece) ? 1 : -step.l;

      step.r += this._isEqualColorPiece((x, y) => {
        if (x + i >= 0 && y - i >= 0 && x + i < this._x && y - i < this._y) return true;
      }, (x, y) => {
        return this._board[y - i][x + i];
      }, piece) ? 1 : -step.r;
      if (step.t == 4 || step.v == 4 || step.l == 4 || step.r == 4) return true;
    }
    return false;
  }

  _isEqualColorPiece(cb, getPiece, piece) {
    let x = piece.x, y = piece.y;
    if (!cb(x, y)) return 0;
    let p = getPiece(x, y);
    if (!p || p._color != piece._color) return 0;
    return 1;
  }
}

class Piece {
  constructor(color, x, y) {
    this._color = color;
    this._x = x;
    this._y = y;
  }
  get color() {
    return this._color;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }
}

class Player {
  constructor(board) {
    this._board = board;
    this._color = PIECE_COLOR.NONE;
  }
  setColor(color = PIECE_COLOR.NONE) {
    this._color = color;
  }
  get board() {
    return this._board;
  }
  get color() {
    return this._color;
  }
  /**
   * 下棋
   * @param  {[type]} x [description]
   * @param  {[type]} y [description]
   * @return {[type]}   [description]
   */
  play(x, y) {
    return this._board.addPiece(new Piece(this._color, x, y));
  }
}
//2 算法统计最高的权重

class GoBangAI {
  constructor(board) {
    this._board = board;
    this._vituralBoard = new VituralBoard(this._board.x, this._board.y);
  }

  init() {
    this._vituralBoard.addPiece();
  }

  get vituralBoard() {
    return this._vituralBoard;
  }

  getPiece() {
    return this._vituralBoard.maxPiece;
  }

  parse(color) {
    let lastPiece = this._board.lastPiece;
    this._vituralBoard.addPiece(lastPiece, color);
  }
}


class VituralPiece {
  constructor(x, y) {
    this._x = x;
    this._y = y;
    this._piece = null;
    let d = {w: 0, b : 0};
    this._h = d;
    this._v = d;
    this._l = d;
    this._r = d;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  set piece(val) {
    this._piece = val;
  }

  get piece() {
    return this._piece;
  }

  get w() {
    return Math.max(this._l.w , this._r.w , this._h.w , this._v.w);
  }
  get b() {
    return Math.max(this._l.b , this._r.b , this._h.b , this._v.b);
  }


  get weight() {
    return this.w + this.b;
  }
}


class VituralBoard {
  constructor(x, y) {
    this._x = x;
    this._y = y;
    this.maxPiece = null
    this._initVitural();
  }
  get vitural() {
    return this._vitural;
  }
  _initVitural() {
    this._vitural = new Array(this._y);
    for(var y = 0; y < this._y; y++) {
      this._vitural[y] = this._vitural[y] || new Array(this._x);
      for(var x = 0; x < this._x; x++) {
        this._vitural[y][x] = new VituralPiece(x, y);
      }
    }
  }

  addPiece(piece, color) {
    if (piece) {
      let vituralPiece = this._vitural[piece.y][piece.x];
      vituralPiece.piece = piece;
    }
    this._currentColor = color;
    return this._countBoard();
  }
  _countBoard() {
    // let maxPiece = {w: null, b: null};
    this.maxPiece = null
    let pieces = [];
    for (var y = 0; y < this._y; y++) {
      for (var x = 0; x < this._x; x++) {
        let v = this._vitural[y][x];
        if (v.piece) continue;
        v._l = this._l(x, y);
        v._r = this._r(x, y);
        v._v = this._v(x, y);
        v._h = this._h(x, y);
        if (!this.maxPiece || this.maxPiece.weight == v.weight ) {
          pieces.push( this.maxPiece ? v : (this.maxPiece = v));
        }  else if (this.maxPiece.weight < v.weight) {
          pieces.length = 0;
          pieces.push(this.maxPiece = v);
        }
      }
    }
    let len = pieces.length;
    this.maxPiece = len == 1 ? this.maxPiece : pieces[Math.round(Math.random() * (len - 1))];
    return this.maxPiece;
  }

  _l(x, y){
    let ifFn = (i) => {
      return true;
    }
    let getPiece = (i) => {
        return {
        l: x - i >= 0 && y - i >= 0 ? this._vitural[y - i][x - i] : null,
        r: x + i < this._x && y + i < this._y ? this._vitural[y + i][x + i] : null
      }
    }
    return this._computeCb(ifFn, getPiece);
  }
  _r(x, y){
    let ifFn = (i) => {
      return true;
    }
    let getPiece = (i) => {
      return {
        l: x + i < this._x && y - i >= 0 ? this._vitural[y - i][x + i] : null,
        r: x - i >= 0 && y + i < this._y ? this._vitural[y + i][x - i] : null
      }
    }
    return this._computeCb(ifFn, getPiece);
  }
  _v(x, y){
    let ifFn = (i) => {
      return true;
    }
    let getPiece = (i) => {
      return {
        l: y - i >= 0 ? this._vitural[y - i][x] : null,
        r: y + i < this._y ? this._vitural[y + i][x] : null
      }
    }
    return this._computeCb(ifFn, getPiece);
  }
  _h(x, y) {
    let ifFn = (i) => {
      return true;
    }
    let getPiece = (i) => {
      return {
        l: x - i >= 0 ? this._vitural[y][x - i] : null,
        r: x + i < this._x ? this._vitural[y][x + i] : null
      }
    }
    return this._computeCb(ifFn, getPiece);
  }
  _computeCb(ifFn, getPiece) {
    var w = this._compute(ifFn, getPiece,PIECE_COLOR.WHITE), b = this._compute(ifFn, getPiece, PIECE_COLOR.BLACK);
     return {
      w: 1 << w,
      b: 1 << b
    }
  }
  _compute(ifCn, getPiece , color) {
    var lspace = 0, rspace = 0, lc = 0,rc = 0, lstep = 0, rstep = 0;
    var isEndl = false, isEndr = false;
    for (var i = 1; i < 5; i++) {
      if (ifCn(i)) {
        let lps = getPiece(i);
        let lp = lps.l;
        let rp = lps.r;
        if (!lp) {
          isEndl = true;
        }
        if (!rp) {
          isEndr = true;
        }
        if (!isEndl) {
          lstep += 1;
          if (lp.piece){
            if (lp.piece._color != color) {
              isEndl = true;
              lstep -= 1;
            } else {
              if (lspace == 0) lc += 1;
            }
          } else {
            if (lc == 0) lspace += 1;
            if (lc > 0) {
              isEndl = true;
            }
          }
        }

        if (!isEndr) {
          rstep += 1;
          if (rp.piece) {
            if (rp.piece._color != color) {
              isEndr = true;
              rstep -= 1;
            } else {
              if (rspace == 0) rc += 1;
            }
          } else {
            if (rc == 0) rspace += 1;
            if (rc > 0) {
              isEndr = true;
            }
          }
        }
        if (isEndr && isEndl) break;
      }
    }
    return this._getCount(lstep, rstep, lspace, rspace,  lc, rc, color);
  }

  _getCount(lstep, rstep, lspace, rspace, lc, rc, color) {
    if (lstep + rstep < 4) return 0;
    if (lstep == 0) {
      if (rspace > 0) return this._addNum(1, color);
      if (rc < 3) return this._addNum(rc + 2, color);
      if (rc == 3) return color == this._currentColor ? 12 : 4;
      if (rc > 3) return this._addNum(15, color);
    }
    if (rstep == 0) {
      if (lspace > 0) return this._addNum(1, color);
      if (lc < 3) return this._addNum(lc + 2, color);;
      if (lc == 3) return color == this._currentColor ? 12 : 4;
      if (lc > 3) return this._addNum(15, color);
    }
    if (lc == 0 && rc == 0) return 6;
    if (lstep == lc || rstep == rc) {
      let n = lc + rc;
      if (n < 3)  return this._addNum(n + 2, color);;
      if (n == 3) return color == this._currentColor ? 12 : 4;
      if (n > 3) return this._addNum(15, color);
    }
    if (lc + rc == 1) return color = this._currentColor ? 9: 7;
    if (lc + rc == 2) return color == this._currentColor ? 10 : 8;
    if (lc + rc == 3) return color == this._currentColor ? 13 : 11;
    if (lspace > 0 && rspace > 0) return 6;
    return this._addNum(15, color);
  }

  _addNum(num, color) {
    if (color == this._currentColor) return num + 1;
    return num;
  }

  _get3N(color) {
    if (color == PIECE_COLOR.WHITE) return 7;
    return 6;
  }

}

//2 算法统计全部的权重

class VituralPiece1 extends VituralPiece{
  get w() {
    return this._l.w + this._r.w + this._h.w + this._v.w;
  }
  get b() {
    return this._l.b + this._r.b + this._h.b + this._v.b;
  }
}

class VituralBoard1 extends VituralBoard {
  _initVitural() {
    this._vitural = new Array(this._y);
    for(var y = 0; y < this._y; y++) {
      this._vitural[y] = this._vitural[y] || new Array(this._x);
      for(var x = 0; x < this._x; x++) {
        this._vitural[y][x] = new VituralPiece1(x, y);
      }
    }
  }
  _getCount(lstep, rstep, lspace, rspace, lc, rc, color) {
    if (lstep + rstep < 4) return 0;
    if (lstep == 0) {
      if (rc == 0) return 2;
      if (rc < 3) return rc == 1 ? 4 : 6;
      if (rc == 3) return 14;
      if (rc > 3) return 18;
    }
    if (rstep == 0) {
      if (lc > 0) return 2;
      if (lc < 3) return lc == 1 ? 4 : 6;
      if (lc == 3) return 6;
      if (lc > 3) return 18
    }
    if (lc == 0 && rc == 0) return 8;
    if (lstep == lc || rstep == rc) {
      let n = lc + rc;
      if (n < 3)  return n == 1 ? 4 : 6;
      if (n == 3) return 14
      if (n > 3) return 18
    }
    if (lc + rc == 1) return 10
    if (lc + rc == 2) return 12
    if (lc + rc == 3) return 16
    if (lspace > 0 && rspace > 0) return 8;
    return 18;
  }
}

class GoBangAI1 extends GoBangAI {
  constructor(board) {
    super(board);
    this._vituralBoard = new VituralBoard1(this._board.x, this._board.y);
  }
}


//2 取黑白的最大

class VituralPiece2 extends VituralPiece1{
  get weight() {
    return Math.max(this.w, this.b);
  }
}

class VituralBoard2 extends VituralBoard1 {
  _initVitural() {
    this._vitural = new Array(this._y);
    for(var y = 0; y < this._y; y++) {
      this._vitural[y] = this._vitural[y] || new Array(this._x);
      for(var x = 0; x < this._x; x++) {
        this._vitural[y][x] = new VituralPiece2(x, y);
      }
    }
  }
}

class GoBangAI2 extends GoBangAI {
  constructor(board) {
    super(board);
    this._vituralBoard = new VituralBoard2(this._board.x, this._board.y);
  }
}


if (window.module && module.exports) {
  module.exports = {
    PIECE_COLOR,
    Board,
    Player,
    GoBangAI,
    GoBangAI1,
    GoBangAI2,
    PIECE_COLOR
  }
}






