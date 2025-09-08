import Utils from '../Utils/Utils'
import Chart from './Chart'

class TTest extends Chart {
  afterInit() {
    super.afterInit()
    this.renderPlotBands()
  }

  renderPlotBands() {
    let chart = this.chart,
      xAxis = chart.xAxis[0],
      min = xAxis.min,
      max = xAxis.max,
      y = 0,
      yAxisPlotBandSize = chart.plotWidth * 0.1,
      x = chart.plotLeft + chart.plotWidth / 2,
      plotBands = [
        {
          d: [],
          stroke: '#f5f5f5',
          'stroke-width': xAxis.toPixels(1) - xAxis.toPixels(0)
        },
        {
          d: ['M', x, chart.plotTop, 'L', x, chart.plotTop + chart.plotHeight],
          stroke: '#fff',
          'stroke-width': yAxisPlotBandSize
        }
      ]

    for (let i = min; i <= max; i += 2) {
      y = xAxis.toPixels(i)
      plotBands[0].d = plotBands[0].d.concat([
        'M',
        chart.plotLeft,
        y,
        'L',
        chart.plotLeft + chart.plotWidth,
        y
      ])
    }

    if (this.plotBands) {
      this.plotBands.forEach((p, i) => {
        p.attr(plotBands[i])
      })
    } else {
      this.plotBands = []
      plotBands.forEach((p) => {
        this.plotBands.push(chart.renderer.path([]).attr(p).add())
      })
    }
  }

  // eslint-disable-next-line no-unused-vars
  columnVisibleChange(column, isHide) {
    // eslint-disable-next-line no-unused-vars
    let visible = column.visible,
      color = column.color,
      pointsToRemove = [],
      seriesLength = this.chart.series.length - 1

    this.chart.series[seriesLength].points.forEach((point, i) => {
      if (point.color === color) {
        pointsToRemove.push(point)

        pointsToRemove.push(this.chart.series[seriesLength - 1].points[i])
      }
    })

    for (let i = 0; i < pointsToRemove.length; i++) {
      pointsToRemove[i].remove(false)
    }
    column.remove()
    // this.chart.redraw();
    return false
  }

  beforeInit() {
    //
    this.addAxisLabelEvent = true
    let _this = this
    this.defaultOptions = {
      chart: {
        inverted: true
      },
      title: {
        text: null
      },
      // colors: [
      //   '#7cb5ec',
      //   '#434348',
      //   '#90ed7d',
      //   '#f7a35c',
      //   '#8085e9',
      //   '#f15c80',
      //   '#e4d354',
      //   '#2b908f',
      //   '#f45b5b',
      //   '#91e8e1'
      // ],
      plotOptions: {
        series: {
          findNearestPointBy: 'xy',
          states: {
            inactive: false
          }
        },
        scattter: {
          findNearestPointBy: 'xy',
          stickyTracking: true
        },
        column: {
          events: {
            hide: function () {
              _this.columnVisibleChange(this, true)
            }
            // show: function () {
            //    _this.columnVisibleChange(this, false);
            // }
          },
          borderColor: '#000',
          findNearestPointBy: 'xy',
          pointPadding: 0
        }
      },
      legend: {
        squareSymbol: false,
        symbolRadius: 0,
        align: 'left',
        verticalAlign: 'top'
      }
    }
    delete this.defaultOptions.groups
    delete this.defaultOptions.body
    delete this.defaultOptions.xAxis
    delete this.defaultOptions.yAxis
  }
  translate(options) {
    let defaultAxis = {
      yAxis: [
        {
          lineWidth: 2,
          lineColor: '#000',
          tickWidth: 1,
          tickLength: 5,
          tickColor: '#000',
          tickPosition: 'inside',
          offset: 10,
          gridLineWidth: 0,
          title: {
            text: 'Means in groups'
          },
          width: '45%',
          labels: {
            rotation: 0,
            style: {
              fontWeight: 'bold'
            }
          }
        },
        {
          lineWidth: 2,
          lineColor: '#000',
          tickWidth: 1,
          tickLength: 5,
          tickColor: '#000',
          tickPosition: 'inside',
          offset: 10,
          title: {
            text: 'Difference between groups'
          },
          gridLineWidth: 0,
          left: '55%',
          width: '45%',
          // offset: 0,
          labels: {
            style: {
              fontSize: '16px',
              color: '#000'
            }
          },
          plotLines: [
            {
              value: 0,
              lineWidth: 1,
              color: '#000',
              dashStyle: 'Dash'
            }
          ]
        },
        {
          linkedTo: 2,
          opposite: true,
          left: '55%',
          width: '45%',
          title: {
            text: '95% confidence intervals'
          },
          offset: 10
        }
      ],
      xAxis: [
        {
          lineWidth: 0,
          categories: []
        },
        {
          lineWidth: 0,
          opposite: true,
          type: 'category',
          categories: [],
          title: {
            text: 'P_value'
          }
        }
      ]
    }

    if (options.xAxis) {
      options.xAxis.forEach((axis, i) => {
        defaultAxis.xAxis[i] = Utils.merge(defaultAxis.xAxis[i], axis)
      })
    }

    if (options.yAxis) {
      options.yAxis.forEach((axis, i) => {
        defaultAxis.yAxis[i] = Utils.merge(defaultAxis.yAxis[i], axis)
      })
    }
    options.xAxis = defaultAxis.xAxis
    options.yAxis = defaultAxis.yAxis
    let columnSeries = [],
      errorBar = [
        {
          type: 'errorbar',
          data: [],
          xAxis: 1,
          yAxis: 1,
          linkedTo: 'scatter'
        },
        {
          id: 'scatter',
          yAxis: 1,
          xAxis: 1,
          type: 'scatter',
          data: [],
          showInLegend: false
        }
      ],
      pValueLabel = null

    if (options.groups) {
      options.groups.forEach((g) => {
        columnSeries.push({
          type: 'column',
          name: g,
          data: [],
          xAxis: 0,
          yAxis: 0
        })
      })
    }
    if (options.body) {
      options.body.forEach((b, j) => {
        options.xAxis[0].categories.push(b.name)
        columnSeries.forEach((c, i) => {
          c.data.push(b.groups[i])
        })
        errorBar[1].data.push({
          x: j,
          y: b.groups[0] - b.groups[1],
          color: options.colors[b.groups[1] > b.groups[0] ? 1 : 0]
        })
        errorBar[0].data.push([j, b['interval_lower'], b['interval_upper']])

        // pValueLabel = b['p.value'].toFixed(3);
        pValueLabel = b['p.value'] ? b['p.value'].toFixed(3) : b['p.value']

        if (b['p.value'] <= 0.05) {
          pValueLabel += '*'
          if (b['p.value'] <= 0.01) {
            pValueLabel += '*'
          }
        }
        options.xAxis[1].categories.push(pValueLabel)
      })
    }
    options.series = columnSeries.concat(errorBar)
  }
  setOptions(options, isDefaultOptions) {
    this.translate(options)
    super.setOptions(options, isDefaultOptions)
  }
  update(options) {
    if (options?.colors) {
      this.options.series.forEach((item) => {
        if (item.type === 'scatter') {
          item.data.forEach((d) => {
            d.color = options.colors[d.y < 0 ? 1 : 0]
          })
        }
      })
    }
    this.chart.update(options)
  }
}

export default TTest
