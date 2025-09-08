import Chart from './Chart'
import Utils from '../Utils/Utils'
import cloneDeep from "lodash-es/cloneDeep";

class Upgma extends Chart {
  removeSeries(serie) {
    if (this.hasTree) {
      if (this.chart.series.length - 1 > 1) {
        serie.remove()
      } else {
        serie.remove(false)
        this.chart.yAxis[1].remove(false)
        this.chart.yAxis[0].update(
          {
            width: '100%'
          },
          false
        )
        this.chart.xAxis[0].update({
          left: undefined,
          opposite: true
        })
      }
    } else {
      if (this.chart.series.length > 1) {
        serie.remove()
      }
    }
  }

  getCategory(tree) {
    let str = JSON.stringify(tree).replace(/\[/g, '').replace(/\]/g, '').replace(/"/, '').split(',')
    let result = []
    str.forEach((s) => {
      if (isNaN(parseFloat(s))) {
        result.push(s.replace(/"/g, ''))
      }
    })
    return result
  }

  beforeInit() {
    const _this = this
    this.hasTree = true
    this.treePoint = []
    this.treeColor = {}
    this.treeColorRange = {}
    this.groupNames = []
    this.groupColors = []
    this.categories = []
    this.treeOptions = {
      lineWidth: 1,
      dashStyle: 'Solid'
    }
    this.defaultOptions = {
      chart: {
        type: 'upgma',
        marginLeft: 50,
        height: 600
      },
      legend: {
        align: 'right',
        verticalAlign: 'top',
        layout: 'vertical',
        symbolRadius: 0,
        y: 40,
        useHTML: true, // 允许使用HTML格式
        labelFormatter: function() {
          let labelText = this.name;
          // 每30个字符换行
          const maxLength = 30;
          let result = '';
          // 使用循环，将文本每30个字符拆分成一行
          for (let i = 0; i < labelText.length; i += maxLength) {
            result += labelText.substring(i, i + maxLength) + '<br>';
          }
          return result;  // 返回换行处理后的文本
        }
      },
      plotOptions: {
        series: {
          states: {
            inactive: false
          },
          events: {
            legendItemClick: function () {
              if (this.type !== 'tree') {
                _this.removeSeries(this)
              }
              return false
            }
          }
        }
      }
    }
  }
  translate(options) {
    // console.log(options,'options222')
    const opcur = cloneDeep(options)
    let series = []
    opcur.xdata.forEach((x) => {
      series.push({
        yAxis: 1,
        name: x,
        data: []
      })
    })

    this.categories = this.getCategory(options.tree)
    let counter = 0,
      colors = options.treeColor || options.colors,
      color = null,
      x = null
    opcur.namedata.forEach((namedata) => {
      this.groupNames.push(namedata.name)
      color = colors[this.groupNames.length - 1]
      this.groupColors.push(color)

      namedata.data.forEach((data) => {
        x = this.categories.indexOf(data.name)
        this.treeColor[data.name] = {
          color: color,
          index: x
        }
        data.data.forEach((d, i) => {
          series[i].data.push([x, d])
        })
      })

      this.treeColorRange[color] = [counter]
      counter += namedata.data.length
      this.treeColorRange[color].push(counter)
    })

    series.forEach((s) => {
      s.data = s.data.sort((a, b) => {
        return a[0] - b[0]
      })
    })

    let _this = this

    delete opcur.namedata
    delete opcur.xdata
    // delete options.tree

    let defaultYAxis = [
      {
        width: '30%',
        reversed: true,
        offset: 0,
        gridLineWidth: 0,
        lineWidth: 1,
        lineColor: '#000',
        min: 0,
        max: 0.5,
        tickInterval: 0.1,
        tickWidth: 1,
        tickLength: 5,
        minorGridLineWidth: 0,
        minorTickInterval: 0.01,
        minorTickWidth: 1,
        minorTickLength: 3,
        minorTickColor: '#000',
        tickColor: '#000'
      },
      {
        offset: 0,
        left: '43%',
        width: '58%',
        // max: 1,
        gridLineWidth: 0,
        min: 0,
        // tickInterval: 0.25,
        lineWidth: 1,
        lineColor: '#000',
        tickWidth: 1,
        tickLength: 5,
        tickColor: '#000',
        reversedStacks: false
      }
    ]

    options.yAxis &&
    options.yAxis.forEach((yAxis, i) => {
      options.yAxis[i] = Utils.merge(defaultYAxis[i], yAxis)
    })

    let defaultXAxis = [
      {
        left: '42%',
        lineWidth: 0,
        gridLineWidth: 0,
        categories: _this.categories,
        labels: {
          style: {
            textOverflow: 'none'
          },
          formatter: function () {
            if (!_this.treeColor[this.value]) {
              return ''
            }
            return (
              '<span style="color: ' +
              _this.treeColor[this.value].color +
              '">' +
              this.value +
              '</span>'
            )
          }
        }
      }
    ]
    // console.log('defaultXAxis:', defaultXAxis)
    if (!options.xAxis) {
      options.xAxis = defaultXAxis
    } else {
      options.xAxis.forEach((xAxis, i) => {
        options.xAxis[i] = Utils.merge(defaultXAxis[i], xAxis)
      })
    }
    this.treeOptions = {
      lineWidth: options.treeLineWidth || 1,
      dashStyle: options.treeLineDashStyle || 'Solid'
    }
    options.series = series
  }

  getCenter(x, x2) {
    let diff = x2 - x
    return (diff > 0 ? x : x2) + Math.abs(diff) / 2
  }

  calcY(a, b, c, d) {
    let e = a + b,
      f = c + d,
      g = a + d,
      h = c + b

    if (Math.abs(e - f) < Math.abs(g - h)) {
      return e
    } else {
      return g
    }
  }

  getLastCenter(points) {
    return [
      this.getCenter(points[points.length - 2].x, points[points.length - 1].x),
      this.getCenter(points[points.length - 2].y, points[points.length - 1].y)
    ]
  }

  getPointColor(point) {
    for (let key in this.treeColorRange) {
      if (point.x >= this.treeColorRange[key][0] && point.x <= this.treeColorRange[key][1]) {
        // console.log(point.x, key)
        return key
      }
    }
  }

  calcTreePointGroupCenter(treePointGroup) {
    return {
      x: this.getCenter(treePointGroup.parts[0].x, treePointGroup.parts[1].x),
      y: this.getCenter(
        treePointGroup.parts[0].y + treePointGroup.parts[0].y2,
        treePointGroup.parts[1].y + treePointGroup.parts[1].y2
      ),
      color: Utils.mixColor(treePointGroup.parts[0].color, treePointGroup.parts[1].color)
    }
  }

  renderTree(returnOptions) {
    this.parseTree(this.options.tree)
    this.treePoint.reverse()

    let treePointGroups = [],
      treePointGroup = null,
      breakGroups = []

    this.treePoint.forEach((p) => {
      if (p) {
        if (!p.x1 && !p.x2) {
          let lastTreePointGroup = breakGroups[breakGroups.length - 2],
            lastBreakGroup = breakGroups[breakGroups.length - 1]

          treePointGroup = {
            top: {
              x: lastTreePointGroup.center.x,
              y: lastTreePointGroup.center.y,
              color: lastTreePointGroup.center.color,
              y1: p.y1
            },
            bottom: {
              x: lastBreakGroup.center.x,
              y: lastBreakGroup.center.y,
              color: lastBreakGroup.center.color,

              y1: p.y2
            }
          }

          breakGroups.length -= 2
        } else {
          if (treePointGroup && p.x1 && p.x2) {
            breakGroups.push(treePointGroups[treePointGroups.length - 1])
            // lastTreeBreakGroup = treePointGroups[treePointGroups.length - 1];
          }

          let lastTreePointGroup = treePointGroup
            ? treePointGroups[treePointGroups.length - 1]
            : null

          treePointGroup = {
            top: null,
            center: null,
            bottom: null
          }

          if (p.x1) {
            treePointGroup.top = {
              x: this.treeColor[p.x1].index,
              color: this.treeColor[p.x1].color,
              y: 0,
              y1: p.y1
            }
          } else {
            treePointGroup.top = {
              x: lastTreePointGroup.center.x,
              color: lastTreePointGroup.center.color,
              y: lastTreePointGroup.center.y,
              y1: p.y1
            }
          }

          if (p.x2) {
            treePointGroup.bottom = {
              x: this.treeColor[p.x2].index,
              color: this.treeColor[p.x2].color,
              y: 0,
              y1: p.y2
            }
          } else {
            treePointGroup.bottom = {
              x: lastTreePointGroup.center.x,
              color: lastTreePointGroup.center.color,
              y: lastTreePointGroup.center.y,
              y1: p.y2
            }
          }
        }

        treePointGroup.center = {
          x: this.getCenter(treePointGroup.top.x, treePointGroup.bottom.x),
          y: this.calcY(
            treePointGroup.top.y,
            treePointGroup.top.y1,
            treePointGroup.bottom.y,
            treePointGroup.bottom.y1
          ),
          color: Utils.mixColor(treePointGroup.top.color, treePointGroup.bottom.color)
        }

        treePointGroups.push(treePointGroup)
      } else {
        breakGroups.push(treePointGroups[treePointGroups.length - 1])
      }
    })

    let treeData = [],
      colors = [],
      series = {
        type: 'tree',
        names: this.groupNames,
        groupColors: this.groupColors,
        yAxis: 0,
        xAxis: 0,
        dashStyle: this.treeOptions.dashStyle,
        width: this.treeOptions.lineWidth
      }

    treePointGroups.forEach((t) => {
      treeData.push([t.top.x, t.top.y])
      treeData.push([t.top.x, t.center.y])
      treeData.push([t.center.x, t.center.y])
      colors.push(t.top.color)

      treeData.push([t.bottom.x, t.bottom.y])
      treeData.push([t.bottom.x, t.center.y])
      treeData.push([t.center.x, t.center.y])
      colors.push(t.bottom.color)
    })

    series.data = treeData
    series.colors = colors
    if (returnOptions) {
      return series
    } else {
      this.options.series.push(series)
    }
  }

  parseTree(tree) {
    let node = {
        y1: tree[1],
        y2: tree[3]
      },
      isObjFrom = typeof tree[0] === 'object',
      isObjTo = typeof tree[2] === 'object'

    if (!isObjFrom) {
      node.x1 = tree[0]
    }

    if (!isObjTo) {
      node.x2 = tree[2]
    }

    this.treePoint.push(node)

    if (isObjFrom && isObjTo) {
      this.treePoint.push(null)
    }

    if (isObjFrom) {
      this.parseTree(tree[0])
    }

    if (isObjTo) {
      this.parseTree(tree[2])
    }
  }
  setOptions(options, isDefaultOptions) {
    this.translate(options)
    super.setOptions(options, isDefaultOptions)
    this.renderTree()
    // console.log(this.options, 'this.options:::::')
  }
  update(key, value, isDefaultOptions) {
    if (key === 'tree') {
      if (!value) {
        return false
      }

      let update = {}

      if (value.treeLineWidth) {
        this.options.treeLineWidth = value.treeLineWidth
        this.treeOptions.lineWidth = value.treeLineWidth

        update.width = value.treeLineWidth
      }

      if (value.treeLineDashStyle) {
        this.options.treeLineDashStyle = value.treeLineDashStyle
        this.treeOptions.dashStyle = value.treeLineDashStyle
        update.dashStyle = value.treeLineDashStyle
      }

      if (value.names) {
        update.names = value.names
      }

      var isDeepUpdate = false
      if (value.treeColor) {
        let colorReplacement = {}
        for (let i = 0; i < this.groupColors.length; i++) {
          colorReplacement[this.groupColors[i]] = value.treeColor[i]
        }
        this.groupColors = value.treeColor

        for (let key in this.treeColor) {
          this.treeColor[key].color = colorReplacement[this.treeColor[key].color]
        }

        update.groupColors = value.treeColor
        update = this.renderTree(true)
        isDeepUpdate = true
      }

      this.chart.series.forEach((s) => {
        if (s.type === 'tree') {
          if (isDeepUpdate) {
            s.remove(false)
            this.chart.addSeries(update, true, false)
          } else {
            s.update(update)
          }
        }
      })
    } else if (key === 'remove-tree') {
      // this.chart.yAxis[0].remove(false);

      // this.chart.yAxis[1].update({
      //    left: undefined,
      //    width: undefined,
      //    reversedStacks: false
      // }, false);

      this.hasTree = false

      let treeSerieIndex = null
      for (let i = 0; i < this.chart.series.length; i++) {
        if (this.chart.series[i].type === 'tree') {
          // console.log(i)
          treeSerieIndex = i
          break
        }
        // this.chart.series[i].update({
        //    yAxis: 0
        // }, false);
      }

      this.chart.series[treeSerieIndex].remove(false)

      this.chart.xAxis[0].update(
        {
          left: undefined
        },
        false
      )

      this.chart.yAxis[0].remove(false)

      this.chart.yAxis[0].update(
        {
          left: undefined,
          width: undefined
        },
        false
      )

      this.chart.series.forEach((s) => {
        s.userOptions.yAxis = 0
      })

      this.chart.update({
        chart: {
          marginLeft: undefined
        }
      })

      return false
    } else {
      this.chart.update(key)
      // return super.update(key, value, isDefaultOptions)
    }
  }
}

export default Upgma
