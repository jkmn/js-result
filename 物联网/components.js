((fn, global) => {

    global.components = fn(global)

})((global) => {


    class Chart {
        constructor({rect} = {}) {
            this._rect = rect
            this._widgets = []
            this._data = {}
        }

        updateData(data) {
            this._data = data
            this._widgets = []
        }

        //给子类实现的类
        draw(ctx) {
            this._widgets.forEach(widget => widget.draw(ctx))
        }

        drawChart(ctx) {    
            this.draw(ctx)
        }
    }

    /**
     * 有轴先的图表基类
     * 所有图表继承于它
     */
    class AxisChart extends Chart{
        constructor ({xArray = [], yArray = [], useGuide = true, axisBdColor = '#000', axisColor, ...options} = {}) {
            super(options)
            //1 计算坐标轴原点

            this._axisFont = '15px Arial' //轴坐标的字体
            this._yArray = yArray
            this._xArray = xArray
            this._maxYWidth = this._getYAxisMaxWidth()
            this._origin = this._getOrigin() //坐标原点
            this._width = this._rect.width - this._maxYWidth
            this._height = this._rect.height - 35
            this._yAxisData = this._transY()
            this._xAxisData = this._transX()
            this._useGuide = useGuide
            this._axisBdColor = axisBdColor
            this._axisColor = axisColor
        }


        _transY() {
            let len = this._yArray.length - 1
            let svgHeight = this._height / len
            this._pointHeight = this._height / this._yArray[len]            
            let map = {}
            this._yArray.forEach((v, i) => {
                map[v] = {
                    x: this._origin.x - 5,
                    y: this._origin.y - svgHeight * i
                }
            })

            return map
        }

        _transX() {
            let len = this._xArray.length
            let svgWidth = this._svgWidth = this._width / len
            let map = {}
            this._xArray.forEach((v, i) => {
                map[v] = {
                    x: this._origin.x + svgWidth / 2 + svgWidth * i,
                    y: this._origin.y + 5                }
            })
            return map
        }

        //绘制坐标轴
        _drawAxis(ctx) {
            ctx.save()
            //坐标轴
            ctx.beginPath()
            ctx.strokeStyle = this._axisBdColor
            ctx.moveTo(this._origin.x - .5, this._origin.y - this._height)
            ctx.lineTo(this._origin.x - .5, this._origin.y -.5)
            ctx.lineTo(this._origin.x  + this._width, this._origin.y - .5)
            ctx.stroke()
            ctx.closePath()

            //标记
            ctx.textAlign = "right"
            ctx.textBaseline = 'middle'
            ctx.fillStyle = this._axisColor


            var drawText = (data) => {
                return (key) => {
                    let v = data[key]
                    ctx.fillText(key, v.x, v.y)
                }
            }
            this._yArray.forEach(drawText(this._yAxisData))

            ctx.textAlign = "center"
            ctx.textBaseline = 'top'
            this._xArray.forEach(drawText(this._xAxisData))
           
            ctx.restore()
        }
        drawChart() {
            if (this._useGuide) {
                this._drawGuide(ctx)
            }
            this._drawAxis(ctx)
            super.drawChart(ctx)
        }

        _getOrigin() {
            let x = this._maxYWidth + this._rect.x
            let y = this._rect.y + this._rect.height - 20
            return new Point(x, y)
        }

        //获取y轴上面的文字最大宽度
        _getYAxisMaxWidth() {
            let canvas = document.createElement('canvas')
            let ctx = canvas.getContext('2d')
            ctx.font = this._axisFont
            let widthMap = this._yArray.map((v) => {
                v = v + ''
                return ctx.measureText(v).width
            })

            canvas = ctx = null

            return Math.max.apply(Math, widthMap)
        }

        //绘制辅助线
        _drawGuide(ctx) {
            ctx.save()
            ctx.setLineDash([5, 2])
            ctx.strokeStyle = '#ddd'
            this._yArray.forEach((key, i) => {
                 if (i == 0) return
                 let v = this._yAxisData[key]
                 ctx.beginPath()
                 ctx.moveTo(this._origin.x, v.y - .5)
                 ctx.lineTo(this._origin.x + this._width, v.y - .5)
                 ctx.stroke()
                 ctx.closePath()
 
            })
            ctx.restore()
         }
    }
    
    //柱状图
    class HistogramChart extends AxisChart {
        constructor({color = ['#000'], barWidth = 0.6, ...options} = {}) {
            super(options)
            this._barWidth = barWidth
            this._color = typeof color == 'string' ? [color] : color
        }


        updateData(data) {
            super.updateData(data)
            Object.keys(this._xAxisData).forEach((key, i) => {
                let xAxis = this._xAxisData[key]
                let val = this._data[key]
                if (val !== void 0) {
                    let width = this._barWidth * this._svgWidth
                    let height = this._pointHeight * val
                    this._widgets.push(new Column({
                        rect: new Rect(xAxis.x - width / 2, this._origin.y - 1 - height, width, height),
                        color: this._color[i % this._color.length]
                    }))
                }
            })
        }
    }

    //折线图
    class LineChart extends AxisChart {
        constructor({vRadiu = 3, vColor = 'green', lColor = '#666', lWidth = 1, ...options} = {}) {
            super(options)
            this._vRadiu = vRadiu
            this._vColor = vColor
            this._lColor = lColor
            this._lWidth = lWidth
        }

        updateData(data) {
            super.updateData(data)
            let startPoint = null
            let endPoint = null
    
            Object.keys(this._xAxisData).forEach((key, i) => {
                let xAxis = this._xAxisData[key]
                let val = this._data[key]
                if (val !== void 0) {
                    let x = xAxis.x
                    let y = this._origin.y - this._pointHeight * val
                    if (startPoint == null) {
                        startPoint = new Point(x, y)
                    } else if (endPoint == null) {
                        endPoint = new Point(x, y)
                    }
                    if (startPoint != null  && endPoint != null) {
                        this._widgets.push(new Line({
                            startPoint,
                            endPoint,
                            width: this._lWidth,
                            color: this._lColor,
                            rSize: this._vRadiu,
                            rColor: this._vColor,
                            startY: this._origin.y
                        }))
                        startPoint = endPoint
                        endPoint = null
                    }
                }
            })
            
        }

    }


    class BezierChart extends AxisChart {
        constructor({...options} = {}) {
            super(options)
        }


        draw(ctx) {

        }
    }


    //饼状图
   class PieChart extends Chart{
       constructor({config, interval = 5, radiu = 50, ...options} = {}) {
           super(options)
           this._config = config
           this._interval = interval
           this._radiu = radiu
       }

       updateData(data) {
           super.updateData(data)
           this._config = this._config.sort((a, b) => data[a.name] > data[b.name] ? -1 : 1)
           let total = Object.values(data).reduce((a, b) => a + b, 0)
           let i = 0
           let prevDeg = 0
           let allDeg = 2 * Math.PI
           this._config.forEach((conf) => {
                let name = conf.name
                let val = this._data[name]
                if (val !== void 0) {
                    let bfb = val / total
                    allDeg -= prevDeg

                    this._widgets.push(
                        new Pie({
                            color: conf.color,
                            radiu: this._radiu + this._interval * i,
                            start: 0,
                            from: 0, 
                            to: -allDeg,
                            origin: this._rect.origin
                        })
                    )
                    ++i
                    prevDeg = 2 * Math.PI * bfb

                }
           })
       }
   }


   class Pie {
       constructor({color, origin, radiu, start, from, to} = {}) {
            this._color = color
            this._radiu = radiu
            this._start = start
            this._from = from
            this._to = to
            this._timer = 50
            this._step = (this._to - this._from) / this._timer
            this._origin = origin
       }

       draw(ctx) {
           if (this._from != this._to) {
                this._from += this._step
                if (this._from <= this._to) {
                    this._from = this._to
                }
           }
           ctx.save()
           ctx.beginPath()
           ctx.globalAlpha = 0.8
           ctx.fillStyle = this._color
           ctx.moveTo(this._origin.x, this._origin.y)
           ctx.arc(this._origin.x, this._origin.y, this._radiu, this._start, this._from, true)
           ctx.closePath()
           ctx.fill()
           ctx.restore()
       }
   }

    class Column {
        constructor ({rect, color} = {}) {
            this._isAnimation = true //是否运动
            this._timers = 50 //运动几次
            this._color = color
            this._rect = rect
            this._aRect = new Rect(rect.x, rect.y + rect.height, rect.width, 0)
        }


        draw(ctx) {
            ctx.save()
            ctx.fillStyle = this._color
            let rect = this._aRect
            if (this._isAnimation) {
                rect.height += this._rect.height / this._timers
                if ( rect.height >= this._rect.height) {
                    rect.height = this._rect.height
                    this._isAnimation = false
                }
                rect.y = this._rect.y + this._rect.height - rect.height
            }

            ctx.fillRect(rect.x, rect.y, rect.width, rect.height)

            ctx.restore()
        }
    }


    class Line {
        constructor({startPoint, endPoint, width = 1, lColor = '#666', rSize = 2, rColor = 'green', startY} = {}) {
            this._startPoint = startPoint
            this._endPoint = endPoint
            this._timer = 50
            this._lWidth = width
            this._lColor = lColor
            this._rSize = rSize
            this._rColor = rColor
            this._startY = startY
            this._isAnimation = true
            this._aStartPoint = new Point(startPoint.x, startY)
            this._aEndPoint = new Point(endPoint.x, startY)
        }

        draw(ctx) {
            if (this._isAnimation) {
                this._aStartPoint.y -= (this._startY - this._startPoint.y) / this._timer
                this._aEndPoint.y -= (this._startY - this._endPoint.y) / this._timer
                if (this._aStartPoint.y <= this._startPoint.y || this._aEndPoint.y <= this._endPoint.y) {
                    this._isAnimation = false
                    this._aStartPoint = this._startPoint
                    this._aEndPoint = this._endPoint
                }
            }

            ctx.save()
            ctx.beginPath()
            ctx.lineWidth = this.lWidth
            ctx.strokeStyle = this.lColor
            ctx.moveTo(this._aStartPoint.x, this._aStartPoint.y)
            ctx.lineTo(this._aEndPoint.x, this._aEndPoint.y)
            ctx.stroke()
            ctx.closePath()
            
            ctx.fillStyle = this._rColor
            ctx.beginPath()
            ctx.arc(this._aStartPoint.x, this._aStartPoint.y, this._rSize, 0, 2 * Math.PI)
            ctx.fill()
            ctx.closePath()
            ctx.beginPath()
            ctx.arc(this._aEndPoint.x, this._aEndPoint.y, this._rSize, 0, 2 * Math.PI)
            ctx.fill()
            ctx.closePath()

            ctx.restore()
        }
    }
    

    var computednGrid = (len, ...values) => {
        let num = 0
        for (let v of values) {
            if (typeof v == 'number') {
                num += v
            } else if (typeof v == 'string') {
                if (v.substr(-1, 1) == '%') {
                    v = parseFloat(v) / 100
                    num += len * v
                } else if (v.substr(-2, 2) == 'px') {
                    num += parseFloat(v)
                }
            }
        }

        return num
    }
    

    return {
        HistogramChart,
        LineChart,
        BezierChart,
        PieChart
    }

    
    
}, window)