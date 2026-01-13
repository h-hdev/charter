import Utils from '../Utils/Utils'
import Chart from './Chart'

class ROC extends Chart {
  constructor(el, options) {
    super(el, options)
  }

  beforeInit() {
    this.addAxisLabelEvent = true
    this.defaultOptions = {
      chart: {
        type: 'bar'
      },
      plotOptions: {
        bar: {
          groupPadding: 0,
          pointPadding: 0,
          borderColor: '#000'
        }
      },
      legend: {
        enabled: false
      }
    }
  }
  translate(options) {
    let series = [],
      xAxis = [],
      yAxis = [],
      categories = null,
      data = null
    options.namedata.forEach((namedata, i) => {
      data = []
      namedata.data.forEach((d) => {
        data.push({
          name: d.name,
          y: d.data
        })
      })

      data = data.sort((a, b) => {
        return b.y - a.y
      })

      categories = []
      data.forEach((d) => {
        categories.push(d.name)
        delete d.name
      })

      series.push({
        name: namedata.name,
        xAxis: i,
        yAxis: i,
        data: data
      })

      xAxis.push({
        lineWidth: 1,
        lineColor: '#000',
        opposite: i !== 0,
        type: 'category',
        categories: categories
      })

      yAxis.push({
        left: i === 0 ? '0%' : '55%',
        width: '45%',
        reversed: i !== 0,
        gridLineWidth: 0,
        lineWidth: 1,
        lineColor: '#000',
        tickLength: 5,
        tickWidth: 1,
        tickColor: '#000',
        offset: 0,
        title: {
          text: namedata.name
        }
      })
    })

    if (options.yAxis) {
      options.yAxis.forEach((axis, i) => {
        yAxis[i] = Utils.merge(yAxis[i], axis)
      })
      delete options.yAxis
    }

    if (options.xAxis) {
      if (Utils.isArray(options.xAxis)) {
        options.xAxis.forEach((axis, i) => {
          xAxis[i] = Utils.merge(yAxis[1], axis)
        })
      } else {
        xAxis.forEach((axis, i) => {
          xAxis[i] = Utils.merge(axis, options.xAxis)
        })
      }
      delete options.xAxis
    }
    options.series = series
    options.xAxis = xAxis
    options.yAxis = yAxis
    delete options.namedata
  }
  setOptions(options, isDefaultOptions) {
    options?.namedata && this.translate(options)
    super.setOptions(options, isDefaultOptions)
  }
  // eslint-disable-next-line no-unused-vars
  update(key, value, isDefaultOptions) {
    this.chart.update(key)
    // super.update(key, value, isDefaultOptions)
  }
}

export default ROC
