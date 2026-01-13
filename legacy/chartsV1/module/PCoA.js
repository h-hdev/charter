import Utils from '../Utils/Utils'
import Chart from './Chart'
class PCOA extends Chart {
  beforeInit() {
    /**
     * 当前关联的数据列,用于同步切换显示,格式为:
     * {
     *  主下标: [关联下标1, 关联下标2]
     * }
     * ex: {
     *  1: [3, ]
     * }
     *  */
    this.linkedSeries = {}
    /**
     * 置信圈中心点与其他点的连线
     */
    this.linkSeries = []
    this.value = {
      confidence: true,
      links: false,
      name: false,
      inverted: false
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
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },
      plotOptions: {
        series: {
          states: {
            inactive: false
          },
          events: {
            hide: (series) => this.seriesToggle(series, true),
            show: (series) => this.seriesToggle(series)
          }
        }
      }
    }
  }
  translate(options) {
    const newSeries = []
    const colors = options?.colors || this.options?.colors || Utils.colors
    options.series.forEach((series, i) => {
      series.keys = ['name', 'x', 'y']
      series.zIndex = 2
      series.id = i + ''
      if (!series.color) {
        series.color = colors[i % colors.length]
      }
      // series.color = colors[i % colors.length]
      newSeries.push({
        name: series.name + '-linked-circle',
        color: series.color,
        data: series.confidence,
        showInLegend: false,
        enableMouseTracking: false,
        lineWidth: series.lineWidth || 1,
        dashStyle: series.dashStyle || 'Solid',
        marker: {
          enabled: false
        },
        dataLabels: {
          enabled: false
        },
        zIndex: 1,
        linkedTo: i + ''
      })
      // delete series.confidence
      delete series.lineWidth
      delete series.dashStyle
      this.linkSeries['circle'] = true
    })
    newSeries.forEach((s) => {
      options.series.push(s)
    })
  }
  setOptions(options, isDefaultOptions) {
    // 因全局启用Boost,会导致多数据情况下自动屏蔽标签显示， 这里需释放boost
    options.boost.enabled = false;
    super.setOptions(options, isDefaultOptions)
    let isFormat = true
    isFormat = !options.series.some((item) => item.name.includes('-linked-'))
    isFormat && this.translate(this.options)
  }
  seriesToggle(series, isHide) {
    // const index = series.index,
    //   linkedSeries = this.linkedSeries[index]
    //   linkedSeries && linkedSeries.forEach((s) => {
    //   this.chart.series[s].update(
    //     {
    //       visible: isHide ? false : true
    //     },
    //     false
    //   )
    // })
    let name = series.name,
      seriesToUpdate = []
    for (let i = 0; i < this.chart.series.length; i++) {
      if (
        this.chart.series[i].name === name ||
        this.chart.series[i].name.startsWith(name + '-linked-')
      ) {
        seriesToUpdate.push(this.chart.series[i])
      }
    }

    seriesToUpdate.forEach((series) => {
      series.update(
        {
          visible: isHide ? false : true
        },
        false
      )
    })
    this.chart.redraw()
  }
  // eslint-disable-next-line no-unused-vars
  update(key, isDefaultOptions) {
    const keys = Object.keys(key)
    for(let i = 0, len = keys.length; i < len; i++) {
      const prop = keys[i]
      if (this.value[prop] !== undefined) {
        switch (prop) {
          case 'links':
            if (key[prop] === false && !this.linkSeries['links']) {
              return false
            }
            if (this.linkSeries['links']) {
              // show
              let i = 0,
                total = this.chart.series.length
              for (; i < total; i++) {
                if (this.chart.series[i].name.includes('-linked-arrow')) {
                  this.chart.series[i].update(
                    {
                      visible: key[prop]
                    },
                    false
                  )
                } else if (!this.chart.series[i].name.includes('-linked-')) {
                  // 如果没有置信区间 跳过
                  if (this.chart.series[i].userOptions.confidence.length <= 1) {
                    continue
                  }
                  let points = this.chart.series[i].points
                  points[points.length - 1].update(
                    {
                      visible: key[prop]
                    },
                    false
                  )
                }
              }
            } else {
              // add
              let i = 0,
                series = null,
                total = this.chart.series.length
              for (; i < total; i++) {
                series = this.chart.series[i]
                // 追加的数据 或者 没有置信区间的数据不需要连线
                if (series.name.includes('-linked-') || series.userOptions.confidence.length <= 1) {
                  continue
                }
                let data = Utils.JSONCopy(series.userOptions.data),
                  center = series.userOptions.center,
                  linkData = []
                data.forEach((d) => {
                  linkData.push([d[1], d[2]])
                })
                let userOptions = series.userOptions
                series.addPoint(
                  {
                    name: 'center_mock',
                    x: center[0],
                    y: center[1],
                    dataLabels: {
                      enabled: false
                    },
                    marker: {
                      radius: 0
                    },
                    color: userOptions.linkColor || userOptions.color
                  },
                  false
                )
                this.chart.addSeries(
                  {
                    type: 'arrow',
                    name: series.name + '-linked-arrow',
                    lineWidth: userOptions.linkWidth || 1,
                    color: userOptions.linkColor || '#000',
                    dashStyle: userOptions.linkDashStyle || 'Dash',
                    data: linkData,
                    zIndex: 0,
                    center: center,
                    showInLegend: false,
                    dataLabels: {
                      enabled: false
                    },
                    visible: series.visible
                  },
                  false
                )
              }
              this.linkSeries['links'] = true
            }
            this.chart.redraw()
            break
          case 'name':
            this.chart.update({
              plotOptions: {
                series: {
                  dataLabels: key[prop]
                    ? { enabled: true, format: '{point.name}', allowOverlap: true }
                    : { enabled: false }
                }
              }
            })
            break
          case 'confidence':
            this.value.confidence = key[prop]
            for (let i = 0; i < this.chart.series.length; i++) {
              if (this.chart.series[i].name.includes('-linked-circle')) {
                this.chart.series[i].update(
                  {
                    visible: this.value.confidence
                  },
                  false
                )
              }
            }
            this.chart.redraw()
            break
          case 'inverted':
            this.chart.update({
              chart: {
                inverted: key[prop]
              }
            })
            break
        }
        this.value[prop] = key[prop]
        return true
      }
      // 处理颜色
      if (prop === 'colors') {
        const len = this.chart.series.filter(item => !item.name.includes('-linked-')).length;
        this.chart.series.forEach((s, index) => {
          const _idx = index % len;
          s.update({
            color: key[prop][_idx]
          }, false)
        })
        this.chart.redraw();
        return true;
      }
    }
    this.chart.update(key)
  }
}

export default PCOA
