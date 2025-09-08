import Chart from './Chart'

class CCA extends Chart {
  beforeInit() {
    this.value = {
      arrow: true,
      name: true
    }
    this.defaultOptions = {
      chart: {
        type: 'scatter',
        plotBorderWidth: 1,
        plotBorderColor: '#555'
      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#555',
        tickLength: 5,
        tickWidth: 1,
        tickColor: '#333',
        plotLines: [
          {
            value: 0,
            width: 1,
            dashStyle: 'ShortDash'
          }
        ]
      },
      xAxis: {
        showLastlabel: true,
        tickLength: 5,
        tickWidth: 1,
        tickColor: '#333',
        lineColor: '#555',
        gridLineWidth: 0,
        plotLines: [
          {
            value: 0,
            width: 1,
            dashStyle: 'ShortDash'
          }
        ]
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: '{point.name}'
          },
          states: {
            inactive: false
          }
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      }
    }
  }
  translate(options) {
    options.series.forEach((series) => {
      if (series.type === 'arrow') {
        series.showInLegend = false
        series.lineWidth = 1
        series.arrow = true
      }
    })
    const lastSeries = options.series[options.series.length - 1]
    if (lastSeries && !Object.hasOwn(lastSeries, 'symbol')) {
      lastSeries.marker = {}
    }
    lastSeries.marker['symbol'] = 'circle'
  }
  setOptions(options, isDefaultOptions) {
    this.translate(options)
    super.setOptions(options, isDefaultOptions)
  }

  // eslint-disable-next-line no-unused-vars
  update(key, value, isDefaultOptions) {
    // if (this.value[key]) {
    //   switch (key) {
    //     case 'arrow':
    //       this.chart.series.forEach((series) => {
    //         if (series.type === 'arrow') {
    //           const options = {}
    //           if (value.color) {
    //             options.color = value.color
    //           }
    //           if (value.width) {
    //             options.lineWidth = value.width
    //           }
    //           if (Object.keys(options).length) {
    //             series.update(options)
    //           }
    //         }
    //       })
    //       break
    //     case 'name':
    //       this.chart.update({
    //         plotOptions: {
    //           series: {
    //             dataLabels: {
    //               enabled: value
    //             }
    //           }
    //         }
    //       })
    //       break
    //   }
    //   this.value[key] = value
    //   return true
    // }
    if (key?.colors) {
      this.chart.series.forEach((series, index) => {
        const options = { color: key.colors[index] }
        series.type !== 'arrow' && series.update(options)
      })
      return true
    }
    if (key?.series) {
      this.chart.series.forEach((series, index) => {
        const options = { color: key.series[index].color }
        series.type !== 'arrow' && series.update(options)
      })
      return true
    }
    this.chart.update(key)
  }
}

export default CCA
