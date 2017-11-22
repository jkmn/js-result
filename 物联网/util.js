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

        set x(x) {
            this._x = x
        }

        set y(y) {
            this._y = y
        }

        get width() {
            return this._width
        }

        get height() {
            return this._height
        }

        set width(width) {
            this._width = width
        }

        set height(height) {
            this._height = height
        }
    }
    class Point {
        constructor (x, y) {
            this._x = x
            this._y = y
        }


        subtract(point) {
            this._x -= point.x
            this._y -= point.y
            return this
        }

        get x() {
            return this._x
        }

        get y()  {
            return this._y
        }

        set x(x) {
            this._x = x
        }

        set y(y) {
            this._y = y
        }
    }


class Resource {
    constructor() {
        this._loading = []
        this._cache = {}
    }

    addSrc(src, name) {
        this._loading.push(this.loading(src, name))
    }

    getCache(name) {
        return this._cache[name]
    }

    loading(src, name) {
        return new Promise(res => {
            let img = new Image
            img.src = src
            img.onload = function() {
                res({img: img, src: src, name})
            }
        })
        
    }

    ready() {
        return Promise.all(this._loading).then(data => {
            data.forEach(d => {
                this._cache[d.name] = d.img
            })
            return Promise.resolve()
        })
    }

}