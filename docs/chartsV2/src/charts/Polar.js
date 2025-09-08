import Chart from './Chart'
import Highcharts from 'highcharts'

class Polar extends Chart {
  beforeInit() {
    this.size = [0.4, 0.3, 0.3]
    let _this = this
    this.defaultOptions = {
      chart: {
        polar: true,
        type: 'area'
      },
      title: {
        style: { color: '#333333', fontSize: '18px' },
        y: 30
      },
      plotOptions: {
        series: {
          states: {
            inactive: false
          },
          events: {
            legendItemClick: function () {
              return false
            }
          }
        },
        area: {
          marker: {
            enabled: false
          }
        },
        polar: {
          sizeByAbsoluteValue: true,
          maxSize: 30,
          minSize: 3,
          dataLabels: {
            fixOpacity: 0.8,
            style: {
              color: '#333',
              fontWeight: 'bold',
              fontSize: '11px'
            }
          }
        }
      },

      xAxis: {
        minPadding: 0,
        lineWidth: 0,
        labels: {
          enabled: true,
          allowOverlap: true,
          style: { color: '#666666', cursor: 'default', fontSize: '11px' }
        },
        showLastLabel: true,
        tickPositioner: function () {
          let tickPositions = this.tickPositions
          if (tickPositions[tickPositions.length - 1] > this.dataMax) {
            tickPositions.length--
          }
          return tickPositions
        },
        tickmarkPlacement: 'on'
      },
      yAxis: {
        minPadding: 0,
        gridLineWidth: 0,
        labels: {
          enabled: false
        },
        tickPositioner: function () {
          let tickPositions = this.tickPositions,
            max = tickPositions[tickPositions.length - 1],
            range = max / _this.size[1]

          return [-range * _this.size[2], range * (1 - _this.size[2])]
        }
      },
      legend: {
        enabled: true,
        layout: 'vertical',
        align: 'center',
        verticalAlign: 'middle',
        y: -10,
        floating: true,
        itemStyle: {
          color: '#333333',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'bold'
        }
      },
      tooltip: {
        formatter: function () {
          let point = this.point,
            series = this.series,
            seriesName = series.name

          if (series.type === 'polar' && point.negative) {
            // console.log(series)
            // console.log(point)
            seriesName = series.chart.userOptions.names[3]
          }
          return `<span style="font-size: 10px">${
            this.key
          }</span><br/><span style="color:${
            point.color
          }">\u25CF</span> ${seriesName}: <b>${
            series.type === 'polar' ? point.z : point.y
          }</b><br/>`
        }
      }
    }
  }

  exportChart(filename, type = 'png') {
    let point = null,
      opacity = 0
    if (type !== 'svg') {
      point = this.chart.series[2].points[0]
      opacity = point.dlLabels[0].opacity
      if (opacity === 0) {
        point = null
      } else {
        point.dlLabels.forEach((label) => {
          label.attr({
            opacity: 1
          })
        })
      }
    }

    let typeMaps = {
      png: 'image/png',
      jpg: 'image/jpeg',
      pdf: 'application/pdf',
      svg: 'image/svg+xml'
    }

    // Highcharts.post('https://export.highcharts.com.cn', {
    // 	filename: filename,
    // 	type: typeMaps[type],
    // 	svg: this.chart.renderer.box.outerHTML,
    // });
    Highcharts.post('/highcharts-export', {
      filename: filename,
      type: typeMaps[type],
      svg: this.chart.renderer.box.outerHTML
    })
    // super.exportChart(filename, type);

    if (point) {
      point.dlLabels.forEach((label) => {
        label.attr({
          opacity: opacity
        })
      })
    }
  }

  update(key, value, isDefaultOptions) {
    if (typeof key === 'object') {
      let keys = Object.keys(key)
      if (keys.length === 1) {
        if (keys[0] === 'abundanceColor') {
          let colors = key['abundanceColor']

          colors.forEach((c, i) => {
            this.chart.userOptions.colors[i] = c
            this.options.series[i].color = c
            this.chart.series[i].update(
              {
                color: c
              },
              i === colors.length - 1
            )
          })
          return true
        } else if (keys[0] === 'polarColor') {
          let colors = key['polarColor']

          colors.forEach((c, i) => {
            this.chart.userOptions.colors[i + 2] = c
          })

          this.options.series[2].color = colors[0]
          this.options.series[2].negativeColor = colors[1]
          this.chart.series[2].update({
            color: colors[0],
            negativeColor: colors[1]
          })
          return true
        } else if (keys[0] === 'chart') {
          if (key[keys[0]].spacing !== undefined) {
            this.originSpacing = key[keys[0]].spacing
          }
        } else if (
          keys[0] === 'xAxis' &&
          key[keys[0]].labels &&
          key[keys[0]].labels.enabled !== undefined
        ) {
          console.log(
            key[keys[0]].labels.enabled,
            this.chart.userOptions.chart.spacing
          )
          if (!key[keys[0]].labels.enabled) {
            this.originSpacing = this.chart.userOptions.chart.spacing
          }

          key.chart = {
            spacing: key[keys[0]].labels.enabled
              ? this.originSpacing
              : [10, 10, 15, 10]
          }
        }
      }
    }
    super.update(key, value, isDefaultOptions)
  }

  setOptions(options, isDefaultOptions) {
    if (options.data) {
      let series = [],
        categories = []
      for (let i = 0; i < 3; i++) {
        series.push({
          data: []
        })
      }
      series[series.length - 1].type = 'polar'
      if (options.names) {
        let colors = options.colors
        series.forEach((s, i) => {
          s.name = options.names[i]
          if (colors) {
            s.color = colors[i]
            if (i === 2) {
              s.negativeColor = colors[i + 1]
            }
          }
        })
      }

      options.data.forEach((d) => {
        categories.push(d[0])
        series[0].data.push(d[2])
        series[1].data.push(d[3])
        series[2].data.push([0, d[1]])
        // series[d[1] > 0 ? 3 : 2].data.push(null);
      })

      options.series = series
      if (!options.xAxis) {
        options.xAxis = {}
      }
      options.xAxis.categories = categories
      options.xAxis.min = 0
      options.xAxis.max = categories.length

      let startAngle = -180 / categories.length
      if (options.pane) {
        options.pane.startAngle = startAngle
      } else {
        options.pane = {
          startAngle: startAngle
        }
      }
    }
    super.setOptions(options, isDefaultOptions)
  }
}

export default Polar
