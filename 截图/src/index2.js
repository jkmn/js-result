/*
* @Author: cb
* @Date:   2017-11-16 15:02:07
* @Last Modified by:   cb
* @Last Modified time: 2017-11-17 17:29:28
*/

!function(fn) {
    window.clip = fn()
}(() => {

    class DomRect {
        constructor(left, top, width, height) {
            this._left = left
            this._top = top
            this._width = width
            this._height = height
        }


        get point() {
            return new Point(this._left, this._top)
        }

        set point(point) {
            this._left = point.x
            this._top = point.y
        }

        get left() {
            return this._left
        }

        get right() {
            return this._left + this._width
        }

        get width() {
            return this._width
        }

        get height() {
            return this._height
        }

        get top() {
            return this._top
        }

        get bottom() {
            return this._top + this._height
        }
    }

    class BaseNode {
        constructor(node, parent) {
            this._node = node // 自身节点
            this._parent = parent //父节点
            this._next = null //后面的兄弟元素
            this._prev = null //前面的兄弟元素
        }

        //设置后面的兄弟元素
        set next(next) {
            this._next = next
        }

        //设置前面的兄弟元素
        set prev(prev) {
            this._prev = prev
        }

        getImageData() {
            throw new Error('子类必须实现次方法')
        }
    }

    //节点对象
    class ElementNode extends BaseNode {
        constructor(node, parent) {
            super(node, parent)
            this._parseNode()
            this._canvas = this._createCanvas()
            this._ctx = this._canvas.getContext('2d')
            this._img = null
            this._childs = []
        }

        //解析元素获取需要的内容
        _parseNode() {
            let node = this._node
            this._tagName = node.nodeName.toLowerCase() //标签名称
            this._rect = this._getRectForParent() //元素相对于父级的位置
            this._style = window.getComputedStyle(node, null) //样式
            this._afterStyle = window.getComputedStyle(node, '::after') //after的样式
            this._beforeStyle = window.getComputedStyle(node, '::before') //before的样式
            this._borders = this._pickBorders() //边框
            this._radius = this._pickRadius()//圆角
            this._backgroundColor = this._style['background-color'] //背景颜色
            this._bakgroundImage = this._style['background-image'] //背景图片
            this._backgroundImageSize = this._style['background-size'] //背景图片尺寸
        }

        //定位只为它父级元素的定位
        _getRectForParent() {
            let node = this._node
            let nRect = node.getBoundingClientRect()
            let rect = new DomRect(nRect.left, nRect.top, nRect.width, nRect.height)
            if (node.parentNode && node.parentNode.nodeType == 1) {
               let pRect = node.parentNode.getBoundingClientRect()
               rect.point = rect.point.subtract(new Point(pRect.left, pRect.top))
            }
            return rect
        }

        //根据名称获取css的样式
        getStyleByName(name) {
            return this._style[name]
        }

        /**
         * 提取边框
         * @return {[type]} [description]
         */
        _pickBorders() {
            let arr = 'top right bottom left'.split(' ')
            let borders = {}

            arr.forEach( a => {
                borders[a] = {
                    width: parseInt(this._style[`border-${a}-width`]),
                    color: this._style[`border-${a}-color`]
                }
            })
            return borders
        }

        /**
         * 提取圆角
         * @return {[type]} [description]
         */
        _pickRadius() {
            let arr = 'top-left top-right bottom-left bottom-right'.split(' ')
            let radius = {}
            arr.forEach(a => {
                let num = this._style[`border-${a}-radius`]
                if (num.charAt(num.length - 1) == '%') {
                    //百分比
                    num = (num = parseInt(num) / 100) > 1 ? 1 : num
                    num *= Math.min(this._rect.width, this._rect.height)
                } else {
                    num = parseInt(num)
                }

                radius[a] = Math.min(num, Math.min(this._rect.width, this._rect.height) / 2)
            })
            return radius
        }

        //是否为行级元素
        get isInline() {
            return  this.getStyleByName('display').indexOf('inline') == 0
        }

        //是否浮动
        get isFloat() {
            return this.getStyleByName['float'] != 'none'
        }

        //是否悬浮
        get isAbsolute() {
            return this.getStyleByName('position') == 'absolute'
        }
        //获取padding
        get padding() {

            return {
                top: parseInt(this.getStyleByName('padding-top')),
                right: parseInt(this.getStyleByName('padding-right')),
                bottom: parseInt(this.getStyleByName('padding-bottom')),
                left: parseInt(this.getStyleByName('padding-left'))
            }
        }

        //获取margin
        get margin() {
            return {
                top: parseInt(this.getStyleByName('margin-top')),
                right: parseInt(this.getStyleByName('margin-right')),
                bottom: parseInt(this.getStyleByName('margin-bottom')),
                left: parseInt(this.getStyleByName('margin-left'))
            }
        }

        //获取叫padding的宽度
        get outerWidth() {
            return this._rect.width
        }

        //获取加padding的高度
        get outerHeight() {
            return this._rect.height
        }

        //获取纯粹的宽度
        get width () {
            return this._rect.width - this.padding.left - this.padding.right
        }

        //获取纯粹的高度
        get height() {
            return this._rect.height - this.padding.top - this.padding.bottom
        }

        get rect() {
            return this._rect
        }

        //绘制占位背景
        _drawPlaceBg(ctx) {
            let rect = this._rect
            let radius = this._radius
            ctx.beginPath()
            let radiusDires = ['top-left', 'top-right', 'bottom-right', 'bottom-left']
            radiusDires.forEach( (dire, index) => {
                let radiu = radius[dire]
                    switch(index) {
                        case 0:
                            ctx.moveTo(0, radiu)
                            ctx.arcTo(0, 0, radiu, 0, radiu)
                            ctx.lineTo(rect.width - radius[radiusDires[index + 1]], 0)
                            break
                        case 1:
                            ctx.arcTo(rect.width, 0, rect.width, radiu, radiu)
                            ctx.lineTo(rect.width, rect.height - radius[radiusDires[index + 1]])
                            break
                        case 2:
                            ctx.arcTo(rect.width, rect.height, rect.width - radiu, rect.height, radiu)
                            ctx.lineTo(radius[radiusDires[index + 1]], rect.height)
                            break
                        case 3:
                            ctx.arcTo(0, rect.height, 0, rect.height -  radiu, radiu)
                            ctx.lineTo(0, radius[radiusDires[0]])
                    }
            })
            ctx.closePath()
            ctx.fillStyle = this._backgroundColor
            ctx.fill()
        }

        //获取背景颜色 如果是透明的 则向父级递归查找
        _getBackgroundColor() {
            let node = this
            while(node) {
                let bgColor = node._backgroundColor
                if (/^rgba\([^,]+,[^,]+,[^,]+, 0\)$/.test(bgColor)) {
                    node = node._parent
                    continue
                }
                return bgColor
            }
            return this._backgroundColor
        }

        //绘制边框
        _drawBorder(ctx) {
            let rect = this._rect
            let radius = this._radius
            let borderDires = ['top', 'right', 'bottom', 'left']
            let radiusDires = ['top-left', 'top-right', 'bottom-right', 'bottom-left']
            borderDires.forEach((dire, index) => {
                let width = parseInt(this.getStyleByName(`border-${dire}-width`))
                let radiu = radius[radiusDires[index]]
                if (width > 0) {
                    ctx.beginPath()
                    ctx.strokeStyle = this.getStyleByName(`border-${dire}-color`)
                    ctx.lineWidth = width
                    switch(index) {
                        case 0:
                            ctx.moveTo(0, radiu)
                            ctx.arcTo(0, 0, radiu, 0, radiu)
                            ctx.lineTo(rect.width - radius[radiusDires[index + 1]] - width, 0)
                            break
                        case 1:
                            ctx.moveTo(rect.width - radiu - width, 0)
                            ctx.arcTo(rect.width - width , 0, rect.width - width, radiu, radiu)
                            ctx.lineTo(rect.width - width, rect.height - radius[radiusDires[index + 1]] - width)
                            break
                        case 2:
                            ctx.moveTo(rect.width - width, rect.height - width - radiu)
                            ctx.arcTo(rect.width - width, rect.height - width, rect.width - width - radiu, rect.height - width, radiu)
                            ctx.lineTo(radius[radiusDires[index + 1]], rect.height - width)
                            break
                        case 3:
                            ctx.moveTo(radiu, rect.height - width)
                            ctx.arcTo(0, rect.height - width, 0, rect.height -  radiu - width, radiu)
    
                            ctx.lineTo(.5, radius[radiusDires[0]])
                    }
                    ctx.closePath()
                    ctx.stroke()
                   
    
                }
    
            })
        }

        //创建canvas
        _createCanvas() {
            let canvas = document.createElement('canvas')
            canvas.width = this._rect.width
            canvas.height = this._rect.height
            return canvas
        }

        //transform
        _transform() {

            return new Promise(res => {
                let transform = this.getStyleByName('transform')
                var isFind = false
                if (transform != 'none') {
                    transform.replace(/^matrix\(([^\)]+)\)$/, (match, t) => {
                        t = t.split(',').map(i => parseFloat(i.trim()))
                        let deg = 0
                        if (t[1] < 0) {
                            //大于 180
                            deg = Math.acos(t[1]) * 180 / Math.PI + 180
                        } else {
                            deg = Math.acos(t[0]) * 180 / Math.PI
                        }

                        isFind = true
                        // ctx.rotate(deg * Math.PI / 180)
                       
                        // ctx.putImageData(this._ctx.getImageData(0,0, this._rect.width, this._rect.height), 0, 0)
                        this.load().then(o => {

                            let canvas = this._createCanvas()
                            let ctx = canvas.getContext('2d')
                            ctx.translate(this._rect.width / 2, this._rect.height / 2)
                            ctx.rotate(deg * Math.PI / 180)
                            ctx.drawImage(this._img, 0, 0, this._img.width, this._img.height, -this._rect.width / 2, -this._rect.height / 2, canvas.width, canvas.height)

                            this._canvas = canvas
                            this._ctx = ctx

                            res()
                        })
                    })
                }

                if (!isFind) {
                    res()
                }
            })

        }

        get img() {
            return this._img
        }

        //加载图片 返回自己
        load() {
            return new Promise(res => {
                let img = new Image
                img.src = this._canvas.toDataURL('image/png')
                img.onload = () => {
                    this._img = img
                    res(this)
                }
            })
        }

        //再画布上绘制图片
        drawChild(child) {
            this._ctx.drawImage(child.img, 0, 0, child.img.width, child.img.height, child.rect.left, child.rect.top, child.img.width, child.img.height)
        }
    }
    //有子元素的节点对象
    class DeepElementNode extends ElementNode {

        constructor(node, parent) {
            super(node, parent)
            this._childrens = [] //子节点
            this._parseChild() //解析子节点
        }

        /**
         * 解析子节点
         * @return {[type]} [description]
         */
        _parseChild() {
            let childrens =  [...this._node.childNodes].filter( child => !this._ignoreTag(child)) //过滤子元素
            childrens.forEach( (child, i) => {
                let _nodeChild
                _nodeChild = child.nodeType == 1 ? elementFactory(child, this) : new TextNode(child, this)
                this._childrens[i] = _nodeChild

                //前面有兄弟元素
                if (this._childrens[i - 1] != void 0) {
                    let prev = this._childrens[i - 1]
                    prev.next = _nodeChild
                    _nodeChild.prev = prev
                }
            })
        }

        //过滤元素
        _ignoreTag(child) {
           
            //不是元素节点和文本节点
            if (child.nodeType != 1 && child.nodeType != 3) return true
            let filterTag = ['script', 'style', 'link', 'head', 'meta'] //要过滤的标签
            let tagName = child.nodeName.toLowerCase()
            if (filterTag.indexOf(tagName) != -1 ) return true
            //是否隐藏
            if (child.nodeType == 1) {
                
                let _style = window.getComputedStyle(child, null)
                let rect = child.getBoundingClientRect()
                if (_style['display'] == 'none' || _style['visibility'] == 'hidden' || _style['opacity'] == 0) return true
                if (rect.width == 0 || rect.height == 0) return true
            }
            if (child.nodeType == 3) {
                //换行组成
                return /^\s*(\r?\n)+\s*$/.test(child.nodeValue)
            }
            return false
        }

        getImageData () {
            return new Promise((res, rej) => {

                let ctx = this._ctx
                let tasks = []
                this._drawPlaceBg(ctx)
                // this._drawBorder(ctx)
                ctx.clip()
                this._childrens.forEach(child => {
                    if (child instanceof TextNode) {
                        child.draw(ctx)
                    } else {
                        tasks.push(child.getImageData())
                    }
                })
                if (tasks.length) {
                    Promise.all(tasks).then(data => {
                        let ts = data.map(d => {
                            return d.load()

                        })
                        Promise.all(ts).then(ds => {
                            ds.forEach(d => {
                                this.drawChild(d)
                            })
                            this._transform()
                            ctx.save()
                            this._transform().then(o => {
                                res(this)
                            })                       
                            
                        })
                    })
                } else {
                    ctx.save()
                    this._transform().then(o => {
                        res(this)
                    })
                }
            })
        }

    }

    //文本节点
    class TextNode extends BaseNode {

        constructor(node, parent) {
            super(node, parent)

            this._text = node.nodeValue
            this._font = this._parent.getStyleByName('font') //字体
            this._fontSize = parseInt(this._parent.getStyleByName('font-size')) //字号
            this._color = this._parent.getStyleByName('color') //颜色

            this._lineHeight = parseInt(this._parent.getStyleByName('line-height')) //行高
            this._lineHeight = isNaN(this._lineHeight) ? 1.375 * this._fontSize : this._lineHeight

            this._textIndent = parseInt(this._parent.getStyleByName('text-indent')) //首行缩进
            this._letterSpace = parseInt(this._parent.getStyleByName('letter-space')) //文字间距
            this._textAlign = this._parent.getStyleByName('text-align') // 文字的对齐方式
            this._textAlign = this._textAlign == 'start' ? 'left' : this._textAlign //正常话对齐方式
            this._textBaseline = 'middle' //文字的描述位置
            this._startY = null //开始的Y轴
            this._startX = null //开始的X轴
            this._firstLineX = null //首行x轴的坐标
        }

        _initTexts() {
            let textList = Array.prototype.slice.call(this._text)

            return textList.map((text, index) => {
                
                let offset = textList.slice(0, index).length
                let range = this._parent._node.ownerDocument.createRange()
                range.setStart(this._node, offset)
                range.setEnd(this._node, offset + text.length)
                let rect = range.getBoundingClientRect()
                return {
                    text: text,
                    x: rect.x - this._parent.rect.left,
                    y: rect.y - this._parent.rect.top
                }

            })

        }


        draw(ctx) {
            this._initTexts().forEach(obj => {
                // console.log(obj)
                ctx.textAlign = this._textAlign
                ctx.fillStyle = this._color
                ctx.textBaseline = this._textBaseline
                ctx.font = this._font
                ctx.fillText(obj.text, obj.x, obj.y)
            })
        }
    }

    //svg节点
    class SvgNode extends ElementNode {
        constructor(node, parent){
            super(node, parent)
        }

        //获取svg的字符串
        _createSvgStr() {
            let fill = this._style['fill'] //记录下svg的颜色
            let _node = this._node.cloneNode(true) //拷贝一份svg
            _node.style.fill = fill
            let wrap = document.createElement('div')
            wrap.appendChild(_node)
            let svgStr = wrap.innerHTML
            wrap = null
            return svgStr
        }

        //根据svg的字符串生成图片地址
        //需要使用 canvg库
        _createSrc(svgStr) {
            let canvas = document.createElement('canvas')
            canvas.width = this._rect.width
            canvas.height = this._rect.height
            canvg(canvas, svgStr)
            return canvas.toDataURL('image/png')
        }

        getImageData() {
            return new Promise((res, rej) => {
                let ctx = this._ctx
                this._drawPlaceBg(ctx)
                this._drawBorder(ctx)
                let c = this._createCanvas()
                canvg(c, this._createSvgStr())
                let src = c.toDataURL('image/png')
                let image = new Image
                image.src = src
                image.onload = () => {
                    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height)
                    ctx.save()
                    this._transform().then(o => {
                        res(this)
                    })
                    
                }
            })
        }
    }

    //图片节点
    class ImgNode extends ElementNode {
        constructor(node, parent) {
            super(node, parent)
        }

        getImageData () {
            return new Promise(res => {
                let ctx = this._ctx
                this._drawPlaceBg(ctx)
                this._drawBorder(ctx)
                ctx.clip()
                let image = new Image
                image.src = this._node.src
                image.onload = () => {
                    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, this._rect.width, this._rect.height)
                    ctx.save()
                    this._transform().then(o => {
                        res(this)
                    })               
                    
                }
            })
            
        }
    }

    class Board {

        constructor(node) {
            this._node = node
            this._canvas = document.createElement('canvas')
            this._canvas.style.width = node.getStyleByName('width')
            this._canvas.style.height = node.getStyleByName('height')
            this._canvas.width = node.width
            this._canvas.height = node.height
            this._ctx = this._canvas.getContext('2d')
            document.body.appendChild(this._canvas)
        }
        draw() {
            this._node.getImageData().then(data => {
                data.load().then(d => {
                    this._ctx.drawImage(d.img, 0, 0, this._canvas.width, this._canvas.height, 0, 0, this._canvas.width, this._canvas.height)
                })
            })
        }
        
    }

    //节点工厂
    //根据节点的类型 生成对应的节点对象
    function elementFactory(node, parent) {
        if (node.nodeType == 1) {
            let map = {'img': ImgNode, 'svg': SvgNode}
            let tageName = node.nodeName.toLowerCase()
            if (map[tageName] != void 0) return new map[tageName](node, parent)
            return new DeepElementNode(node, parent)
        } else if (node.nodeType == 3) {
            return new TextNode(node, parent)
        }

        throw new Error('node 必须是元素节点或者是文本节点')
    }

    function clipNode(node) {
        if (node.nodeType == 1) {
            let _node = new elementFactory(node)
            new Board(_node).draw(document.body)
        }
    }

    return {
        clipNode: clipNode //整页截图
    }
})

