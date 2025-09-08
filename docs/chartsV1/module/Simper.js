import Utils from '../Utils/Utils'
import Chart from './Chart'

class Simper extends Chart {
  removePoints(category) {
    this.chart.xAxis.forEach((xAxis) => {
      xAxis.categories.splice(category, 1)
      xAxis.update(
        {
          categories: xAxis.categories
        },
        false
      )
    })

    this.chart.series.forEach((series, j) => {
      if (j === category) {
        return
      }

      if (series.type === 'bubble') {
        series.points.forEach((point) => {
          if (point.x > category) {
            point.update(
              {
                x: point.x - 1
              },
              false
            )
          }
        })
      } else {
        series.points.forEach((point, i) => {
          if (i > category) {
            point.update(
              {
                x: i - 1
              },
              false
            )
          }
        })
        series.points[category].remove(false)
      }
    })
    this.chart.series[category].remove()
  }

  beforeInit() {
    this.addAxisLabelEvent = true
    this.defaultOptions = Utils.merge(
      {
        chart: {
          type: 'bubble',
          plotBackgroundColor: '#ebebeb',
          inverted: true
        },
        legend: {
          enabled: true
        },
        plotOptions: {
          bubble: {
            maxSize: 20,
            minSize: 5
          }
        }
      },
      ['body', 'name']
    )
  }
  translate(options) {
    let series = [],
      serie = null,
      xCategoies = [],
      yCategoies = [],
      barSeries = {
        type: 'simper-bar',
        yAxis: 1,
        data: [],
        colorByPoint: true,
        showInLegend: false
      }
    for (let key in options.body[0]) {
      if (key === 'name' || key === 'Contribution') {
        continue
      }
      yCategoies.push(key)
    }
    options.body.forEach((body, i) => {
      serie = {
        name: body.name,
        data: []
      }
      xCategoies.push(body.name)
      for (let j = 0; j < yCategoies.length; j++) {
        serie.data.push({
          x: i,
          y: j,
          // z: body[yCategoies[j]],
          z: body[yCategoies[j]] < 0.0001 ? 0.0001 : body[yCategoies[j]]
        })
      }
      barSeries.data.push(body.Contribution)
      series.push(serie)
    })
    let defaultAxis = {
      xAxis: {
        type: 'category',
        tickInterval: 1,
        categories: xCategoies,
        reversed: false,
        lineWidth: 0,
        gridLineWidth: 1,
        gridLineColor: '#fff',
        tickmarkPlacement: 'on',
        tickWidth: 1,
        tickLength: 5,
        tickColor: '#000'
      },
      yAxis: [
        {
          type: 'category',
          tickInterval: 1,
          categories: yCategoies,
          tickmarkPlacement: 'on',
          min: 0,
          max: yCategoies.length - 1,
          title: {
            text: 'Simple'
          },
          width: '60%',
          gridLineColor: '#fff',
          tickWidth: 1,
          tickLength: 5,
          tickColor: '#000'
        },
        {
          left: '65%',
          width: '35%',
          offset: 0,
          tickWidth: 1,
          tickLength: 5,
          tickColor: '#000',
          labels: {
            style: {
              textOverflow: 'none'
            }
          },
          title: {
            text: 'Contribution'
          }
        }
      ]
    }

    if (options.xAxis) {
      defaultAxis.xAxis = Utils.merge(defaultAxis.xAxis, options.xAxis)
      delete options.xAxis
    }

    if (options.yAxis) {
      options.yAxis.forEach((axis, i) => {
        defaultAxis.yAxis[i] = Utils.merge(defaultAxis.yAxis[i], axis)
      })
      delete options.yAxis
    }
    options.xAxis = defaultAxis.xAxis
    options.yAxis = defaultAxis.yAxis

    series.push(barSeries)
    options.series = series
  }
  setOptions(options, isDefaultOptions) {
    this.translate(options)
    super.setOptions(options, isDefaultOptions)
  }
  // eslint-disable-next-line no-unused-vars
  update(key, value, isDefaultOptions) {
    this.chart.update(key)
    // super.update(key, value, isDefaultOptions)
  }
}

export default Simper
