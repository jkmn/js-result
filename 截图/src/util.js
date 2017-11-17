/*
* @Author: cb
* @Date:   2017-11-16 09:20:10
* @Last Modified by:   cb
* @Last Modified time: 2017-11-16 09:20:20
*/
     class Rect {
        constructor(x, y, width, height) {
            this._x = x
            this._y = y
            this._width = width
            this._height = height
        }

        set point (point) {
            this._x = point.x
            this._y = point.y
        }

        get origin () {
            return new Point(this._x + this._width / 2, this._y + this._height / 2)
        }

        get x () {
            return this._x
        }

        get y () {
            return this._y
        }

        get width() {
            return this._width
        }

        get height() {
            return this._height
        }
    }
    class Point {
        constructor (x, y) {
            this._x = x
            this._y = y
        }

        get x() {
            return this._x
        }

        get y()  {
            return this._y
        }
    }