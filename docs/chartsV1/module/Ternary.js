import Chart from './Chart'
// import Utils from '../Utils/Utils'
// import TernaryAxis from "./TernaryAxis";

class Ternary extends Chart {
  beforeInit() {
    this.defaultOptions = {
      title: {
        text: null
      },
      chart: {
        margin: [10, 40, 10, 40]
      },
      legend: {
        y: 30,
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top'
      },
      tooltip: {
        pointFormatter: function () {
          let str = '',
            point = this,
            series = point.series
          series.options.custom.forEach((d) => {
            str += '<b>' + d.name + '：</b>' + d.value + '<br>'
          })
          return str
        }
      }
    }
  }

  // afterInit() {
  //    if (this.ternaryAxis) {
  //       this.ternaryAxis.render();
  //    } else {
  //       this.ternaryAxis = new TernaryAxis(this.chart);
  //    }
  // }
  translate(options) {
    let categories = [],
      data = [],
      axis = {
        min: 0,
        max: 1,
        title: {
          text: null
        },
        visible: false
      }

    options.series.forEach((d) => {
      data.push(this.calc(d))
    })

    options.series[0].value.forEach((v) => {
      categories.push(v.name)
    })

    axis.categories = categories
    options.series = data
    options.chart.type = 'ternary'
    options.xAxis = axis
    options.yAxis = axis
  }
  calc(serie) {
    /**
     *
     *  ref: https://www.ternaryplot.com/explain
     *
     *               A
     *            100   0
     *
     *         b             c
     *
     *     0                      190
     *    B 100      a            0 C
     */

    let result = {
        name: serie.name,
        data: [],
        custom: {}
      },
      sum = serie.value.reduce((v, d) => v + d.value, 0),
      coords = []

    result.custom = serie.value

    // eslint-disable-next-line no-unused-vars
    serie.value.forEach((d, i) => {
      coords.push(d.value / sum)
    })

    // eslint-disable-next-line no-unused-vars
    let [a, b, c] = coords

    result.data.push({
      x: 1 - a - c * Math.sin(Math.PI / 6),
      y: c,
      z: sum
    })

    if (serie.marker) {
      result.marker = serie.marker
    }

    return result
  }
  setOptions(options, isDefaultOptions) {
    if (!Object.hasOwn(options.series[0], 'custom')) {
      this.translate(options)
    }
    super.setOptions(options, isDefaultOptions)
  }
  update(key) {
    if (key?.chart?.width || key?.chart?.height) {
      const size = key?.chart?.width ?? key?.chart?.height
      let xAxis = this.chart.xAxis[0],
        yAxis = this.chart.yAxis[0],
        triangularWidth = size - this.chart.plotLeft * 2,
        height = (triangularWidth / 2) * Math.tan(Math.PI / 3)
      let offset = (yAxis.height - height) / 2,
        xAxisY = this.chart.plotTop + xAxis.height - offset

      this.chart.ternaryArgs.width = triangularWidth
      this.chart.ternaryArgs.height = height
      this.chart.ternaryArgs.offset = offset
      this.chart.ternaryArgs.points = [
        [xAxis.left, xAxisY],
        [xAxis.left + triangularWidth, xAxisY],
        [xAxis.left + triangularWidth / 2, xAxisY - height]
      ]
      this.chart.ternaryAxis.render()
    }
    this.chart.update(key)
  }
}

export default Ternary
