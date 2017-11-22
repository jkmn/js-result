/*
* @Author: cb
* @Date:   2017-11-15 09:53:45
* @Last Modified by:   cb
* @Last Modified time: 2017-11-17 09:17:52
*/
((fn) => {

    window.clip = fn

})((() => {
    //根据传入的节点对象继续裁减
    //@param node HTMLElement 要裁减的对象
    var clipNode = (node) => {
        let _nodeStyle = window.getComputedStyle(node, null) //保存下node的style 因为clone 会清除掉它
        let _rects = node.getBoundingClientRect()
        node = cloneNode(node)
        let ctx = createBoard(node)
        drawNode(node, ctx)
    }

    //克隆元素
    var cloneNode = node => {

        let _node = node.cloneNode()
        _node.node = node

        if (node.nodeType == 3) {
            return _node
        }

        const delTags = ['script', "style", "title"] //删除的标签名称
        let _nodeStyle = window.getComputedStyle(node, null) //保存下node的style 因为clone 会清除掉它
        let _rects = node.getBoundingClientRect() //保存下node的rect 因为clone 会清除掉它

      
        node.childNodes.forEach(child => {
            //删除 script style 等标签
            if (delTags.indexOf(child.nodeName.toLowerCase()) != -1) return

            if (child.nodeType == 3) {
                _node.appendChild(cloneNode(child))
            } else if (child.nodeType == 1) {
                //如果子节点是element 递归克隆
                _node.appendChild(cloneNode(child))
            }
        })
        _node._nodeStyle = _nodeStyle
        _node._rects = _rects

        return _node;

    }


    //创建画板 并根据 元素的设置宽高
    var createBoard = (node) => {
        const canvas = document.createElement("canvas") //创建画布
        const ctx = canvas.getContext('2d') //获取画布操作对象
        //根据node值对画布设置大小
        canvas.style.marginTop = "10px"
        canvas.style.width = `${node._rects.left + node._rects.right}px`
        canvas.style.height = `${node._rects.top + node._rects.bottom}px`
        canvas.width = `${node._rects.left + node._rects.right}`
        canvas.height = node._rects.top + node._rects.bottom

        document.body.appendChild(canvas)

        return ctx
    }

    //绘制元素
    var drawNode = (node, ctx) => {
        //绘制文字
        if (node.nodeType == 3) {
            drawText(node, ctx)
            return
        }
        // ctx.setTransform(1, 0, 0, 1, 0, 0)

        //如果元素隐藏不绘制
        if (node._nodeStyle['display'] == 'none' || node._nodeStyle['opacity'] == 0) return

        //定位
        let rect = new Rect(node._rects.left, node._rects.top, node._rects.width, node._rects.height)
        node._rect = rect
        let radius = node._nodeStyle['border-radius'].split(' ').map(r => {
            let radiu;
            if (r.charAt(r.length - 1) == '%') { //如果是百分比的话则乘上长宽最小的值
                radiu =  (parseInt(r) / 100) * Math.min(rect.width, rect.height)
            } else {
                radiu = parseInt(r)
            }
            if (radiu > Math.min(rect.width, rect.height) / 2) {
                radiu = Math.min(rect.width, rect.height) / 2
            }
            return radiu
        })
        //补充4个角的角度
        for(var i = 1; i < 4; i++) {
            if (radius[i] === void 0) {
                radius[i] = (radius[i % 2] === void 0) ? radius[0] : radius[i % 2]
            }
        }
        node._radius = radius
        //绘制svg
        if (node.nodeName.toLowerCase() == "svg") {
            drawSvg(node, ctx)
            return
        }
        if (node.nodeName == "IMG") {
            drawImage(node, ctx)
            return
        }
        drawPlaceBg(node, ctx) //绘制占位背景
        drawBorder(node, ctx) //绘制边框


        //如果是输入框一类的 则绘制里面的内容
        // if (node.nodeName == 'INPUT') {
        //     let text = document.createTextNode(node.value || node.getAttribute("placeholder") || '')
        //     text.node = text
        //     node.appendChild(text)
        //     drawText(text, ctx)
        //     node.removeChild(text)
        // }

        node.childNodes.forEach((child, index) => {
            drawNode(child, ctx)
        })
    }

    //绘制占位背景
    var drawPlaceBg = (node, ctx) => {
        let rect = node._rect
        let radius = node._radius
        ctx.beginPath()
        let radiusDires = ['top-left', 'top-right', 'bottom-right', 'bottom-left']
        radiusDires.forEach( (dire, index) => {
            let radiu = radius[index]
                switch(index) {
                    case 0:
                        ctx.moveTo(rect.x, rect.y + radiu)
                        ctx.arcTo(rect.x, rect.y, rect.x + radiu, rect.y, radiu)
                        ctx.lineTo(rect.x + rect.width - radius[index + 1], rect.y)
                        break
                    case 1:
                        ctx.arcTo(rect.x + rect.width, rect.y, rect.x + rect.width, rect.y + radiu, radiu)
                        ctx.lineTo(rect.x + rect.width, rect.y + rect.height - radius[index + 1])
                        break
                    case 2:
                        ctx.arcTo(rect.x + rect.width, rect.y + rect.height, rect.x + rect.width - radiu, rect.y + rect.height, radiu)
                        ctx.lineTo(rect.x  + radius[index + 1], rect.y + rect.height)
                        break
                    case 3:
                        ctx.arcTo(rect.x, rect.y + rect.height, rect.x, rect.y + rect.height -  radiu, radiu)

                        ctx.lineTo(rect.x, rect.y - radius[0])
                }
        })
        ctx.closePath()
        ctx.fillStyle = node._nodeStyle['background-color']
        ctx.fill()
    }
    //绘制边框
    var drawBorder = (node, ctx) => {
        let rect = node._rect
        let radius = node._radius
        let borderDires = ['top', 'right', 'bottom', 'left']
        //绘制边框
        borderDires.forEach((dire, index) => {
            let width = parseInt(node._nodeStyle[`border-${dire}-width`])
            let radiu = radius[index]
            if (width > 0) {
                ctx.beginPath()
                ctx.strokeStyle = node._nodeStyle[`border-${dire}-color`]
                ctx.lineWidth = width
                switch(index) {
                    case 0:
                        ctx.moveTo(rect.x, rect.y + radiu)
                        ctx.arcTo(rect.x, rect.y, rect.x + radiu, rect.y, radiu)
                        ctx.lineTo(rect.x + rect.width - radius[index + 1] - .5, rect.y)
                        break
                    case 1:
                        ctx.moveTo(rect.x + rect.width - radiu, rect.y)
                        ctx.arcTo(rect.x + rect.width, rect.y, rect.x + rect.width, rect.y + radiu, radiu)
                        ctx.lineTo(rect.x + rect.width - .5, rect.y + rect.height - radius[index + 1])
                        break
                    case 2:
                        ctx.moveTo(rect.x + rect.width, rect.y + rect.height - radiu)
                        ctx.arcTo(rect.x + rect.width, rect.y + rect.height, rect.x + rect.width - radiu, rect.y + rect.height, radiu)
                        ctx.lineTo(rect.x  + radius[index + 1] - .5, rect.y + rect.height)
                        break
                    case 3:
                        ctx.moveTo(rect.x + radiu, rect.y + rect.height)
                        ctx.arcTo(rect.x, rect.y + rect.height, rect.x, rect.y + rect.height -  radiu, radiu)

                        ctx.lineTo(rect.x - .5, rect.y + radius[0])
                }
                ctx.stroke()
                ctx.closePath()

            }

        })
    }
    //绘制svg
    var drawSvg = (node, ctx) => {
        let div = document.createElement('div')
        let _node = node.cloneNode(true)
        _node.style.fill = node._nodeStyle['fill']
        div.appendChild(_node)
        let svg = div.innerHTML.trim()
        let _canvas = document.createElement('canvas')
        _canvas.width = node._rect.width
        _canvas.height = node._rect.height
        canvg(_canvas, svg)
        let src = _canvas.toDataURL('image/png')
        let image = document.createElement('image')
        image.src = src
        image._rects = node._rects
        image._rect = node._rect
        image._nodeStyle = node._nodeStyle
        image._radius = node._radius
        drawImage(image, ctx)
    }
    //绘制图像
    var drawImage = (node, ctx) => {
        let src = node.src;
        let img = new Image
        img.onload = () => {
            ctx.save()
            drawPlaceBg(node, ctx)
            ctx.clip()
            ctx.drawImage(img, 0, 0, img.width, img.height, node._rects.left, node._rects.top, node._rects.width, node._rects.height)
            ctx.restore()
        }

        img.src = src;
    }

    //var re = /[^\u4e00-\u9fa5]/ //判断是否为中文
    //绘制文字
    var drawText = (node, ctx) => {
        let parent = node.parentNode
        let color = parent._nodeStyle['color']
        let font = parent._nodeStyle['font']
        let fontSize = parseInt(parent._nodeStyle['fontSize'])
        let align = parent._nodeStyle['text-align']
        let lineHeight = parseInt(parent._nodeStyle['lineHeight'])
        lineHeight = isNaN(lineHeight) ? 1.375 * fontSize : lineHeight
        let isWrap = parent._nodeStyle['word-wrap'] == 'break-word' //是否换行了
        let text = node.nodeValue
        let textIndent = parseInt(parent._nodeStyle['textIndent']) //缩进
        let parentWidth = parent._rects.width - parseInt(parent._nodeStyle['padding-left']) - parseInt(parent._nodeStyle['padding-right'])

        let textList = Array.prototype.slice.call(text)
        let _node = node.node
        let textMap = textList.map((text, index) => {

            let offset = textList.slice(0, index).length
            let range = document.createRange()
            range.setStart(_node, offset)
            range.setEnd(_node, offset + text.length)
            let rect = range.getBoundingClientRect()
            return {
                text: text,
                x: rect.left + document.defaultView.pageXOffset,
                y: rect.top + document.defaultView.pageYOffset
            }

        })


        textMap.forEach( t => {
            ctx.beginPath()
            ctx.textAlign = 'left'
            ctx.fillStyle = color
            ctx.textBaseline = "top"
            ctx.font = font
            ctx.fillText(t.text, t.x, t.y)
            ctx.closePath()
        })
    }

    //拆分文字 区别中文和英文
    var splitText = (text) => {
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

    return {
        clipNode: clipNode //整页截图
    }
})())