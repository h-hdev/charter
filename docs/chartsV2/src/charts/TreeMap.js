import Chart from './Chart'
import Highcharts from 'highcharts'
import Utils from '../Utils/Utils'
class TreeMap extends Chart {
  beforeInit() {
    this.defaultOptions = {
      chart: {
        type: 'heatmap',
        animation: false,
        // renderTo: 'canvas'
      },
      boost: {
        enabled: true,
        useGPUTranslations: true,
        usePreAllocated: true,
        // seriesThreshold: 1
      },
      colorAxis: {
        gridLineWidth: 0,
        labels: {
          x: 3,
          style: {
            fontSize: '10px'
          }
        },
        reversed: false
      },
      title: {
        margin: 5,
        style: { color: '#333333', fontSize: '18px' }
      },
      legend: {
        enabled: true,
        align: 'right',
        layout: 'vertical',
        // margin: 2,
        verticalAlign: 'top',
        // width: 25,
        // symbolWidth: 10,
        // symbolHeight: 200
      },
      yAxis: {
        type: 'category',
        opposite: true,
        title: {
          text: null
        },
        gridLineWidth: 0,
        labels: {
          format: '{value}',
          style: {
            color: '#666666',
            cursor: 'default',
            fontSize: '11px',
            overflow: 'none'
          }
        },
        endOnTick: false,
        startOnTick: false,
        min:0,
      },
      xAxis: {
        type: 'category',
        offset: 0,
        gridLineWidth: 0,
        labels: {
          allowOverlap: true,
          format: '{value}',
          style: { color: '#666666', cursor: 'default', fontSize: '11px' }
        }
      },
      plotOptions: {
        series: {
          animation: false,
          // turboThreshold: 1,
          // boostThreshold: 1
        },
        heatmap: {
          animation: false,
          // enableMouseTracking: false,
          // boostThreshold: 1,
          // marker: {
          //   lineColor: '#aaa',
          //   lineWidth: 1
          // },
          dataLabels: {
            format: '{point.value:.2f}',
            style: {
              textOutline: false
            }
          }
        },
        stree: {
          animation: false,
          enableMouseTracking: false,
          pointPlacement: 'on',
          borderWidth: 1,
          borderColor: '#aaa',
          colorAxis: false,
          turboThreshold: 1,
          boostThreshold: 1
        }
      }
    }
    this.treeArgs = {
      xAxis: {
        width: 20,
        index: 0,
        options: {
          reversed: true,
          offset: 0,
          margin: 0,
          labels: {
            enabled: false
          },
          lineWidth: 0,
          tickWidth: 0,
          gridLineWidth: 0
        }
      },
      yAxis: {
        height: 20,
        index: 0,
        options: {
          gridLineWidth: 0,
          title: {
            text: null
          },

          labels: {
            enabled: false
          },
          margin: 0,
          offset: 0
        }
      },
      visible: true
    }
  }

  toggleTree(enabled, force) {
    if (force === undefined) {
      if (this.treeArgs.visible === enabled) {
        return false
      }
    }

    this.treeArgs.visible = enabled
    this.chart.series.forEach((series) => {
      if (series.options.type === 'stree') {
        series.update(
          {
            visible: enabled
          },
          false
        )
      }
    })

    this.chart.xAxis.forEach((xAxis, index) => {
      if (index === 0) {
        xAxis.update(
          {
            visible: enabled,
            width: this.treeArgs.xAxis.width + '%'
          },
          false
        )
      } else {
        xAxis.update(
          enabled
            ? {
              left: this.treeArgs.xAxis.width + '%',
              width: 100 - this.treeArgs.xAxis.width + '%'
            }
            : { left: undefined, width: undefined },
          false
        )
      }
    })

    this.chart.yAxis.forEach((xAxis, index) => {
      if (index === 0) {
        xAxis.update(
          {
            top: '0%',
            visible: enabled,
            height: this.treeArgs.yAxis.height + '%'
          },
          false
        )
      } else {
        xAxis.update(
          enabled
            ? {
              top: this.treeArgs.yAxis.height + '%',
              height: 100 - this.treeArgs.yAxis.height + '%'
            }
            : {
              top: undefined,
              height: undefined
            },
          false
        )
      }
    })

    // if (this.treeArgs.visible) {
    // 	this.chart.series.forEach(s => {
    // 		if (s.type === 'tree') {
    // 			// console.log(s);
    // 			// s.update(undefined, false)
    // 			s.isDirty = true;
    // 		}
    // 	});
    // }

    this.chart.redraw(true, false)
  }

  // eslint-disable-next-line no-unused-vars
  update(key, value, isDefaultOptions) {
    if (typeof key === 'object') {
      let keys = Object.keys(key)
      // 单个属性更新
      if (keys.length === 1) {
        let target = keys[0]
        if (/(x|y)Axis(\[\d\])?/.test(target)) {
          let match = target.match(/\[(\d)\]/)
          if (match) {
            let index = parseInt(match[1])
            let obj = target.replace(match[0], '')
            this.chart[obj][index].update(key[target])
          } else {
            this.chart[target][1].update(key[target])
          }
          return true
        } else if (target === 'tree') {
          if (key[target].enabled !== undefined) {
            this.toggleTree(key[target].enabled)
          } else {
            let size = key[target].size
            if (!size || size.length !== 2) {
              return false
            }

            this.treeArgs.xAxis.width = size[0]
            this.treeArgs.yAxis.height = size[1]
            this.toggleTree(this.treeArgs.visible, true)
          }
          return true
        }
      }
      this.chart.update(key)
      return true
    }
  }

  setOptions(options, isDefaultOptions) {
    super.setOptions(options, isDefaultOptions)
    // 针对treeMap表全黑颜色不渲染问题
    let min = Infinity,
      max = -Infinity

    this.options.series[0].data.forEach((d) => {
      if (d[2] > max) {
        max = d[2]
      }

      if (d[2] < min) {
        min = d[2]
      }
    })

    this.options.colorAxis.min = min
    this.options.colorAxis.max = max
    // 防止重复添加tree
    this.options.series = this.options.series.slice(0, 1)
    // xAxis
    let hasXTree = this.options.xAxis.tree
    let xAxis = Utils.JSONCopy(this.treeArgs.xAxis.options)
    xAxis.width = this.treeArgs.xAxis.width

    this.options.xAxis.left = xAxis.width + '%'
    this.options.xAxis.width = 100 - xAxis.width + '%'
    xAxis.width += '%'

    this.options.series[0].xAxis = 1
    this.options.series[0].yAxis = 1

    if (hasXTree) {
      this.options.series.push({
        type: 'stree',
        xAxis: 1,
        yAxis: 0,
        data: this.getTreeData(this.options.xAxis.tree, this.options.xAxis.categories),
        groups: this.options.xAxis.treeGroup,
        boostThreshold: 1
      })
    }

    // else {
    // 	xAxis.width = '0%';
    // 	xAxis.visible = false;
    // 	this.options.xAxis.width = '100%';
    // }

    // yAxis
    let hasYTree = this.options.yAxis.tree
    let yAxis = Utils.JSONCopy(this.treeArgs.yAxis.options)
    yAxis.height = this.treeArgs.yAxis.height

    this.options.yAxis.top = yAxis.height + '%'
    this.options.yAxis.height = 100 - yAxis.height + '%'

    yAxis.height += '%'

    if (hasYTree) {
      this.options.series.push({
        type: 'stree',
        xAxis: 0,
        yAxis: 1,
        keys: ['y', 'x'],
        data: this.getTreeData(this.options.yAxis.tree, this.options.yAxis.categories, true),
        boostThreshold: 1
      })
    }

    // else {
    // 	yAxis.height = '0%';
    // 	yAxis.visible = false;
    // 	this.options.yAxis.height = '100%'
    // }

    if (!hasXTree) {
      yAxis.height = '0%'
      yAxis.visible = false
      this.options.yAxis.height = undefined
      this.options.yAxis.top = undefined
    }

    if (!hasYTree) {
      xAxis.width = '0%'
      xAxis.visible = false
      this.options.xAxis.width = undefined
      this.options.xAxis.left = undefined
    }

    this.options.xAxis = [xAxis, this.options.xAxis]
    this.options.yAxis = [yAxis, this.options.yAxis]

    // console.log(this.options);
  }

  getCenter(x, x2) {
    let diff = x2 - x
    return (diff > 0 ? x : x2) + Math.abs(diff) / 2
  }

  calcY(a, b, c, d) {
    const e = a + b,
      f = c + d,
      g = a + d,
      h = c + b

    if (Math.abs(e - f) < Math.abs(g - h)) {
      return e
    } else {
      return g
    }
  }

  getTreeData(tree, categories, reversed) {
    let treePoints = []
    this.parseTree(tree, treePoints, reversed)
    treePoints.reverse()

    let treePointGroups = [],
      treePointGroup,
      breakGroups = []

    treePoints.forEach((p) => {
      if (p) {
        if (!p.x1 && !p.x2) {
          let lastTreePointGroup = breakGroups[breakGroups.length - 2],
            lastBreakGroup = breakGroups[breakGroups.length - 1]

          treePointGroup = {
            top: {
              x: lastTreePointGroup?.center?.x,
              y: lastTreePointGroup?.center?.y,
              y1: p.y1
            },
            bottom: {
              x: lastBreakGroup?.center?.x,
              y: lastBreakGroup?.center?.y,
              y1: p.y2
            }
          }
          if (breakGroups.length > 0) {
            breakGroups.length -= 2
          }
        } else {
          if (treePointGroup && p.x1 && p.x2) {
            breakGroups.push(treePointGroups[treePointGroups.length - 1])
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
              x: categories.indexOf(p.x1), //this.treeColor[p.x1].index,
              y: 0,
              y1: p.y1
            }
          } else {
            treePointGroup.top = {
              x: lastTreePointGroup?.center?.x,
              y: lastTreePointGroup?.center?.y,
              y1: p.y1
            }
          }

          if (p.x2) {
            treePointGroup.bottom = {
              x: categories.indexOf(p.x2), // this.treeColor[p.x2].index,
              y: 0,
              y1: p.y2
            }
          } else {
            treePointGroup.bottom = {
              x: lastTreePointGroup?.center?.x,
              y: lastTreePointGroup?.center?.y,
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
          )
        }
        treePointGroups.push(treePointGroup)
      } else {
        breakGroups.push(treePointGroups[treePointGroups.length - 1])
      }
    })

    let treeData = []

    treePointGroups.forEach((t) => {
      treeData.push([t.top.x, t.top.y])
      treeData.push([t.top.x, t.center.y])
      treeData.push([t.center.x, t.center.y])
      treeData.push([t.bottom.x, t.bottom.y])
      treeData.push([t.bottom.x, t.center.y])
      treeData.push([t.center.x, t.center.y])
    })

    return treeData
  }

  /**
   *
   * @param {*} tree [x1, y1, x2, y2]
   * @param {*} treePoints
   * @param reversed
   */
  parseTree(tree, treePoints, reversed = false) {
    const node = {
      y1: tree[1],
      y2: tree[3]
    };
    const x1Index = reversed ? 2 : 0;
    const x2Index = reversed ? 0 : 2;
    const isObjFrom = typeof tree[x1Index] === 'object';
    const isObjTo = typeof tree[x2Index] === 'object';

    if (!isObjFrom) {
      node.x1 = tree[x1Index]
    }

    if (!isObjTo) {
      node.x2 = tree[x2Index]
    }

    treePoints.push(node)

    if (isObjFrom && isObjTo) {
      treePoints.push(null)
    }

    if (isObjFrom) {
      this.parseTree(tree[x1Index], treePoints)
    }

    if (isObjTo) {
      this.parseTree(tree[x2Index], treePoints)
    }
  }
  exportChart(filename, type = 'png') {
    let typeMaps = {
      png: 'image/png',
      jpg: 'image/jpeg',
      pdf: 'application/pdf',
      svg: 'image/svg+xml'
    }

    Highcharts.post(import.meta.env.VITE_CHART_EXPORT_SERVER + '/' + filename, {
      filename: filename,
      type: typeMaps[type],
      svg: this.chart.getSVG(),
      width: this.size.width
      // scale: 0.8
    })
  }
}

export default TreeMap
