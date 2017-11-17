/*
* @Author: cb
* @Date:   2017-11-16 15:02:07
* @Last Modified by:   cb
* @Last Modified time: 2017-11-17 17:29:28
*/

!function(fn) {
    window.clip = fn()
}(() => {



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
        }

        //解析元素获取需要的内容
        _parseNode() {
            let node = this._node
            this._tagName = node.nodeName.toLowerCase() //标签名称
            this._rect = this._node.getBoundingClientRect() //元素的位置
            this._style = window.getComputedStyle(node, null) //样式
            this._afterStyle = window.getComputedStyle(node, '::after') //after的样式
            this._beforeStyle = window.getComputedStyle(node, '::before') //before的样式
            this._borders = this._pickBorders() //边框
            this._radius = this._pickRadius()//圆角
            this._backgroundColor = this._style['background-color'] //背景颜色
            this._bakgroundImage = this._style['background-image'] //背景图片
            this._backgroundImageSize = this._style['background-size'] //背景图片尺寸
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
                            ctx.moveTo(rect.left, rect.top + radiu)
                            ctx.arcTo(rect.left, rect.top, rect.left + radiu, rect.top, radiu)
                            ctx.lineTo(rect.right - radius[radiusDires[index + 1]], rect.top)
                            break
                        case 1:
                            ctx.arcTo(rect.right, rect.top, rect.right, rect.top + radiu, radiu)
                            ctx.lineTo(rect.right, rect.bottom - radius[radiusDires[index + 1]])
                            break
                        case 2:
                            ctx.arcTo(rect.right, rect.bottom, rect.right - radiu, rect.bottom, radiu)
                            ctx.lineTo(rect.left  + radius[radiusDires[index + 1]], rect.bottom)
                            break
                        case 3:
                            ctx.arcTo(rect.left, rect.bottom, rect.left, rect.bottom -  radiu, radiu)
                            ctx.lineTo(rect.left, rect.top + radius[radiusDires[0]])
                    }
            })
            ctx.closePath()
            ctx.fillStyle = this._backgroundColor
            ctx.fill()
        }

        _getCanvas() {
            let canvas = document.createElement('canvas')
            canvas.width = this.outerWidth
            canvas.height = this.outerHeight
            return canvas
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
                if (_style['display'] == 'none' || _style['visibility'] == 'hidden' || _style['opacity'] == 0) return true
                if (_style['width'] == '0px' || _style['height'] == '0px') return true
            }

            if (child.nodeType == 3) {
                //换行组成
                return /^\s*(\r?\n)+\s*$/.test(child.nodeValue)
            }
            return false
        }

        getImageData () {
            let canvas = this._getCanvas()
            let ctx = canvas.getContext('2d')
            this._drawPlaceBg(ctx)
            // ctx.clip()
            this._childrens.forEach(child => {
                if (child instanceof TextNode) {
                    child.draw(ctx)
                } else {
                    ctx.putImageData(child.getImageData(), 0, 0, child.rect.left, child.rect.top, child.outerWidth, child.outerHeight)
                }
            })
            ctx.save()
            return ctx.getImageData(0, 0, canvas.width, canvas.height)
        }

    }

    //文本节点
    class TextNode extends BaseNode {

        constructor(node, parent) {
            super(node, parent)

            this._text = node.nodeValue.replace(/(\n|\s{2,})/g, ' ')
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
            let canvas = document.createElement('canvas')
            this._ctx = canvas.getContext('2d')
            this._ctx.font = this._font
        }

        //初始化文字的开始位置 初始话的位置要根据兄弟元素决定
        _initStartPos() {
            this._startY = this._parent.rect.top + this._parent.padding.top
            let prev = this._prev
            let offsetX = {
                left: 0,
                right: 0
            }
            //文字前面的元素
            while(prev) {
                if (prev.isAbsolute) {
                    prev = prev._prev
                    continue
                }

                if (prev.isInline || prev.isFloat) {
                    offsetX.left += prev.rect.width + prev.margin.right + prev.margin.left
                    prev = prev._prev
                    continue
                }
                this._startY = prev.rect.height + prev.margin.bottom
                break
            }


            let next = this._next
            //文字后面的元素
            while(next) {

                if (next.isInline || next.isFloat) {
                    offsetX.right = next.rect.width + next.margin.right + next.margin.left
                    next = next._next
                    continue
                }
                break
            }

            let fontWidth = this._getFontWidth(this._text) //文字的长度
            switch(this._textAlign) {
                case 'left':
                    this._startX = this._parent.rect.left + this._parent.padding.left
                    this._firstLineX = this._startX + offsetX.left
                    break
                case 'right':
                    this._startX = this._parent.rect.right - this._parent.padding.right
                     this._firstLineX = this._startX - offsetX.right
                    break
                case 'center':
                    this._startX = this._parent.rect.left + this._parent.rect.width / 2
                    this._firstLineX = this._startX
                    if (offsetX.left && fontWidth / 2 + offsetX.left > this._parent.width / 2) {
                        this._firstLineX = this._startX + offsetX.left
                    }
                    if (offsetX.right && fontWidth / 2 + offsetX.right > this._parent.width / 2) {
                        this._firstLineX = this._parent.rect.left + this._parent.padding.left
                        this._textAlign = 'left'
                    }
            }


        }

        //转变文字 生成字符串和其对应的位置
        _transformTextToArr() {

            let row = 0 //行数
            let rowText = '' //一行的文字
            let pWidth = parseInt(this._parent.width)//容器的宽度
            let texts = []
            this._splitText(this._text).forEach(text => {
                let rowWidth = parseInt(this._getFontWidth(rowText + text))
                if (rowWidth > pWidth) {
                    texts.push(this._createTextObject(rowText, row))
                    row += 1
                    rowText = ''
                    return
                }
                rowText += text
            })

            if (rowText.length) {
                texts.push(this._createTextObject(rowText, row))
            }

            return texts
        }

        /** 创建文字对象
        * 包含文字, 起始 x y 轴 信息
        */
        _createTextObject(rowText, row) {
            return {
                text: rowText,
                x: row == 0 ? this._firstLineX : this._startX,
                y: this._startY + this._lineHeight / 2 + row * this._lineHeight
            }
        }


        //获取文字的width
        _getFontWidth(text) {
            return this._ctx.measureText(text).width
        }


        //拆分文字 区别中文和英文
        _splitText(text) {
            let arrs = Array.prototype.slice.call(text)

            let target = []
            let prev = ''
            arrs.forEach( t => {
                if (/[a-zA-Z]/.test(t)) {
                    prev += t
                } else {
                    if (prev.length) {
                        target.push(prev)
                        prev = ''
                    }
                    target.push(t)
                }
            })

            if (prev.length) {
                target.push(prev)
            }
        return target
        }

        //初始化文字
        //将其转化成数组对象
        _initTexts() {
            this._initStartPos()
            return this._transformTextToArr()
        }

        draw(ctx) {
            this._initTexts().forEach(obj => {

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
            this._imgDraw = new SrcDraw(this._createSrc(this._createSvtStr()), this._rect)
        }

        //获取svg的字符串
        _createSvtStr() {
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
            let canvas = this._getCanvas()
            let ctx = canvas.getContext('2d')
            this._drawPlaceBg(ctx)
            ctx.clip()
            ctx.save()
            return ctx.getImageData(0, 0, canvas.width, canvas.height)
        }

        _draw(ctx) {
            this._imgDraw.draw(ctx)
        }
    }

    //图片节点
    class ImgNode extends ElementNode {
        constructor(node, parent) {
            super(node, parent)
            this._Imgdraw = new SrcDraw(node.src, this._rect) //图片的渲染借用 ImgOrignDraw
        }

        _draw(ctx) {
            this._Imgdraw.draw(ctx)
        }
        getImageData () {
            let canvas = this._getCanvas()
            let ctx = canvas.getContext('2d')
            this._drawPlaceBg(ctx)
            ctx.clip()
            ctx.save()
            return ctx.getImageData(0, 0, canvas.width, canvas.height)
        }
    }

    //根据图片路径渲染
    class SrcDraw {

        constructor(src, rect) {
            this._src = src
            this._rect = rect
        }

        draw(ctx) {
            let image = new Image
            image.src = this._src

            image.onload = () => {
                ctx.drawImage(image, 0, 0, image.width, image.height, this._rect.left, this._rect.top, this._rect.width, this._rect.height)
            }
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
            let data = this._node.getImageData()
            this._ctx.putImageData(data, 0, 0, 0, 0, this._canvas.width, this._canvas.height)
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

