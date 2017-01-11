/*
* @Author: cb
* @Date:   2017-01-11 11:21:11
* @Last Modified by:   cb
* @Last Modified time: 2017-01-11 14:26:16
*/

'use strict';
const Api = require('./index.js');

let Board = Api.Board;
let Player = Api.Player;
let PIECE_COLOR = Api.PIECE_COLOR;
let GoBangAI2 = Api.GoBangAI2;
let GoBangAI1 = Api.GoBangAI1;
let GoBangAI = Api.GoBangAI;

var WIDTH = 100, HEIGHT = 100;
var jl = [], _t = 20, totalNumber = 20, totalTime = Date.now();
      function startGame() {
        var startTime = Date.now();
         console.log(`正在进行第${Math.abs(totalNumber)}`);
         let board = new Board(WIDTH, HEIGHT);
         var player1 = new Player(board);
         player1.setColor(PIECE_COLOR.BLACK);
         player1.ai = new GoBangAI(board);
         player1.ai.init();
         var player2 = new Player(board);
         player2.setColor(PIECE_COLOR.WHITE);
         player2.ai = new GoBangAI2(board);
         player2.ai.init();

          var players = [player1, player2], num = 0;

          function play() {
            let player = players[(num++ % 2)], _player = players[(num % 2)];
            var vpiece = player.ai.getPiece();
            player.play(vpiece.x, vpiece.y);
            player.ai.parse(player.color);
            _player.ai.parse(_player.color);
            if (board._isGameOver) {
              let lastPiece = board.lastPiece;
              jl.push(lastPiece.color);
              console.log(`第${Math.abs(totalNumber)}结束, ${lastPiece.color == PIECE_COLOR.WHITE ? '红棋' : '黑棋'} 获胜 用时: ${(Date.now() - startTime) / 1000}秒`);
            }
          }

          var timer = null;

          (function autoStart() {
            timer = setInterval(() => {
              play();
              if (board._isGameOver) {
                clearInterval(timer);
                totalNumber--;
                if (totalNumber > 0) startGame();
                else stat(jl);
              }
            }, 0);
          })();
      }

      function stat(data) {
        var len = data.length, w = 0, b = 0;
        for(var k of data) {
          if (k == PIECE_COLOR.WHITE) {
            w += 1;
          } else {
            b += 1;
          }
        }
        console.log(`黑棋获胜机率: ${b / len * 100}% -- 白棋获胜机率: ${w / len * 100}% 平均用时: ${(Date.now() - totalTime) / 1000 / _t}秒`)
      }

      startGame();