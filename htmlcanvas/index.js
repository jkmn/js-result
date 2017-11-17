/*
* @Author: cb
* @Date:   2017-08-03 10:40:29
* @Last Modified by:   cb
* @Last Modified time: 2017-08-03 16:57:04
*/

'use strict';







class Rect {
  constructor(x, y, width, height) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
  }
}


function htmlToCanvas(dom) {
  var dom = dom || document.body;
  var domRect = dom.getBoundingClientRect();


  var canvas = document.createElement('canvas');
  canvas.width = domRect.width;
  canvas.height = domRect.height;
  canvas.style.width = domRect.width + 'px';
  canvas.style.height = domRect.height + 'px';
  let ctx = canvas.getContext('2d');
  cloneNode(dom, ctx);

  document.body.appendChild(canvas);
}


function cloneNode(dom, canvas, offset = {left: 0, top: 0}) {
  if (dom.nodeType == 9) {
    closeNode(dom.body, canvas);
  } else {
    if (dom.nodeType == 3) {
       createTextNode(dom, canvas, Object.assign({}, offset));
    } else if (dom.nodeType == 1 && dom.nodeName != 'SCRIPT') {



      createNode(dom, canvas, Object.assign({}, offset));

      for(var i = 0, l = dom.childNodes.length; i < l; i++) {
        cloneNode(dom.childNodes[i], canvas, {left: offset.left + dom.offsetLeft, top: offset.top + dom.offsetTop});
      }
    }
  }
}


function createNode(node, ctx, offset) {

  var styles = window.getComputedStyle(node, null);
  var radius = styles.borderRadius;
  var left = offset.left + node.offsetLeft, top = offset.top + node.offsetTop;

  ctx.save();
  ctx.beginPath();
  ctx.store
  ctx.fillStyle = styles.backgroundColor;
  ctx.fillRect(left, top, node.clientWidth, node.clientHeight);

  ctx.closePath();
  ctx.restore();



}

function createTextNode(node, ctx, offset) {
 let parent = node.parentNode;

 if (node.nodeValue.replace(/\s/g, '').length == 0)  return;

 var styles = window.getComputedStyle(parent, null);

 var left = parent.offsetLeft, top = parent.offsetTop, paddingLeft = parseInt(styles.paddingLeft), paddingTop = styles.paddingTop, height = parent.clientHeight, fontSize = parseInt(styles.fontSize), width = parent.clientWidth;


var str = node.nodeValue;
 var text = document.createElement(parent.nodeName);
 text.style.font = styles.font;
 text.style.width = width + 'px';
 text.style.lineHeight = styles.lineHeight;
 text.style.wordWrap = 'break-word';
 text.style.wordBreak = 'normal';
 text.style.visibility = 'hidden';

 document.body.append(text);

 var height = 0, prevIndex = 0, _h = 0, strs = [], lines = 0;
 for(var i = 0, l = str.length; i < l; i++) {
    height = text.clientHeight;
    if (_h == 0) _h = height;
    text.innerHTML += str.charAt(i);
    if (height == 0) {
      strs.push(str.charAt(i));
      continue;
    }

    if (height == text.clientHeight) {
      strs.push(str.charAt(i));
    }
      if (height != text.clientHeight || i == l - 1) {
         lines++;
         ctx.save();
         ctx.beginPath();
         ctx.font = styles.font;
         ctx.fillStyle = styles.color;
         ctx.textBaseline = 'middle';
         ctx.fillText(strs.join(''), offset.left + paddingLeft, _h / 2 + (lines - 1) * _h + offset.top);
         ctx.closePath();
         ctx.restore();
         strs = [str.charAt(i)];
         if (i == l - 1 && height != text.clientHeight) {
          strs = [];
          --i;
         }
      }
   
  }

}


class Canvas {
  constructor(rect) {
    var canvas = document.createElement(canvas);
  }

}


