import Utils from '../Utils/Utils'
import Chart from './Chart'
import Highcharts from 'highcharts'

/**
 *
 * TODO:
 *
 * 1. x y 轴筛选
 * 2. 排序
 *
 */
class HeatMap extends Chart {
  afterRedraw(chart) {
    let xAxis = chart.yAxis[1],
      renderer = chart.renderer,
      legend = chart.legend,
      colorAxis = chart.colorAxis,
      group = xAxis.labelMarkerGroup,
      identityGroup = legend.identityGroup,
      identityTitle = legend.identityTitle,
      tickRects = xAxis.tickRects,
      tickRectGrid = xAxis.tickRectGrid,
      top = legend.legendHeight + legend.symbolHeight,
      identityLegendSymbol = legend.identityLegendSymbol,
      isUpdate = true

    if (!group) {
      group = xAxis.labelMarkerGroup = renderer
        .g()
        .attr({
          class: 'label-marker'
        })
        .add(xAxis.labelGroup)

      identityGroup = legend.identityGroup = renderer
        .g()
        .attr({
          class: 'identity'
        })
        .add(legend.group)

      identityTitle = legend.identityTitle = renderer
        .text(legend.options.title.identity, 0, top)
        .css(legend.title.text.styles)
        .add(identityGroup)

      tickRects = xAxis.tickRects = []

      identityLegendSymbol = legend.identityLegendSymbol = []

      tickRectGrid = xAxis.tickRectGrid = renderer
        .path([])
        .attr({
          stroke: '#fff',
          'stroke-width': 1,
          zIndex: 1
        })
        .add(group)
      isUpdate = false
    }

    if (isUpdate) {
      identityTitle.attr({
        x: 0,
        y: top
      })
    }

    let lastTick = 0,
      nextTick = null,
      lastX = xAxis.toPixels(xAxis.min - 0.5)

    // renderer.text('Identity', 0, top).css(legend.title.text.styles).add(identityGroup)

    let markerRadius = 4,
      halfMarkerRadius = markerRadius / 2,
      xAxisTop = xAxis.top - chart.plotTop

    let gridLinePaths = []

    let diff = tickRects.length - xAxis.tickPositions.length
    while (diff > 0) {
      tickRects[tickRects.length - 1] = tickRects[tickRects.length - 1].destroy()
      identityLegendSymbol[identityLegendSymbol.length - 1] =
        identityLegendSymbol[identityLegendSymbol.length - 1].group.destroy()
      tickRects.length -= 1
      diff--
    }

    xAxis.tickPositions.forEach((tick, i) => {
      let color = legend.options.colors[i % legend.options.colors.length]

      top += legend.fontMetrics.h + markerRadius

      nextTick = lastTick + (tick - lastTick) * 2

      if (i === xAxis.tickPositions.length - 1) {
        nextTick += 0.5
      }
      let x = xAxis.toPixels(nextTick),
        tickReactAttr = {
          x: lastX,
          y: chart.plotTop - 20,
          width: x - lastX,
          height: 10,
          fill: color
        },
        legendMarkerAttr = {
          cx: legend.symbolWidth - halfMarkerRadius,
          cy: top,
          r: markerRadius,
          fill: color
        },
        legendTextAttr = {
          text: xAxis.options._categories[i],
          x: legend.symbolWidth - halfMarkerRadius + legend.padding + 10,
          y: top + halfMarkerRadius
        }

      if (i >= tickRects.length) {
        tickRects.push(renderer.rect().attr(tickReactAttr).add(group))

        let identitySymbolGroup = renderer.g().add(identityGroup)

        let styles = Utils.extend({}, colorAxis[0].options.labels.style)
        styles['dominant-baseline'] = 'middle'

        identityLegendSymbol.push({
          group: identitySymbolGroup,
          marker: renderer.circle().attr(legendMarkerAttr).add(identitySymbolGroup),
          text: renderer.text().attr(legendTextAttr).css(styles).add(identitySymbolGroup)
        })
      } else {
        tickRects[i].attr(tickReactAttr)
        identityLegendSymbol[i].marker.attr(legendMarkerAttr)
        identityLegendSymbol[i].text.attr(legendTextAttr)
      }

      gridLinePaths = gridLinePaths.concat([
        'M',
        x,
        chart.plotTop - 20,
        'L',
        x,
        chart.plotTop + chart.plotHeight
      ])

      lastTick = nextTick
      lastX = x
    })

    tickRectGrid.attr({
      d: gridLinePaths
    })

    // 对齐 Legend
    let bbox = legend.group.getBBox()

    let offsetY = (chart.plotHeight - bbox.height) / 2

    legend.group.attr({
      translateY: offsetY + chart.plotTop
    })

    if (chart.colorAxis && chart.colorAxis.length) {
      let color = chart.colorAxis[0].toColor(
        chart.colorAxis[0].min > 0 ? chart.colorAxis[0].min : 0
      )

      chart.plotBackground.attr({
        fill: color
      })
    }
  }

  beforeInit() {
    let _this = this
    this.filter = null
    this.defaultOptions = {
      chart: {
        type: 'heatmap',
        inverted: true,
        plotBackgroundColor: '#000',
        events: {
          load: function () {
            _this.afterRedraw(this)
          }
        },
        spacingRight: 80
      },

      boost: {
        useGPUTranslations: true
      },

      credits: {
        enabled: false
      },
      title: {
        text: null
      },

      colorAxis: {
        stops: [
          [0, '#fafa04'],
          [0.5, '#000'],
          [1, '#f000f0']
        ],
        layout: 'vertical',
        startOnTick: false,
        endOnTick: false
      },
      exporting: {
        enabled: false
      },

      legend: {
        // layout: 'vertical',
        verticalAlign: 'middle',
        align: 'right',
        colors: Highcharts.getOptions().colors,
        title: {
          identity: 'Cluster',
          text: 'Expression'
        }
      },
      plotOptions: {
        heatmap: {
          boostThreshold: 100,
          nullColor: '#EFEFEF',
          colsize: 1, // one day
          borderWidth: 0,
          turboThreshold: Number.MAX_VALUE // #3404, remove after 4.0.5 release
        }
      }
    }
  }

  addEvents() {
    Highcharts.addEvent(this.chart, 'redraw', () => {
      this.afterRedraw(this.chart)
    })
  }

  update(key, value, isDefaultOptions) {
    if (typeof key === 'object') {
      let keys = Object.keys(key)
      // 单个属性更新
      if (keys.length === 1) {
        if (keys[0] === 'legend' && key.legend.colors) {
          this.options.legend.colors = key.legend.colors
          this.afterRedraw(this.chart)
          return true
        } else if (keys[0] === 'filter') {
          this.filter = key[keys[0]] ? Utils.extend(this.filter, key[keys[0]]) : null
          let options = this.setData(this._data, this._cluster)
          this.setOptions(options, false)
          this.render()
          return true
        }
      }
    }
    super.update(key, value, isDefaultOptions)
  }

  setData(data, cluster, dataFilter) {
    let clusterGroup = {},
      tickPositions = [],
      clusterIndxMap = {},
      dataHeadaer = data[0]

    cluster.forEach((c, i) => {
      if (i === 0) {
        return
      }

      if (this.filter && this.filter.y && this.filter.y.includes(c[1])) {
        return
      }

      if (!clusterGroup[c[1]]) {
        clusterGroup[c[1]] = []
      }
      clusterGroup[c[1]].push(c[0])
    })

    let startTickPosition = 0
    tickPositions.push(startTickPosition)

    for (let key in clusterGroup) {
      clusterGroup[key].forEach((c, i) => {
        clusterIndxMap[c] = startTickPosition
        startTickPosition++
      })
      tickPositions.push(startTickPosition - 0.5)
    }

    tickPositions[tickPositions.length - 1] -= 0.5

    dataHeadaer.forEach((clu, i) => {
      if (i === 0) {
        return
      }
      dataHeadaer[i] = {
        value: clusterIndxMap[clu],
        cluster: clu
      }
    })

    let category = []
    let seriesData = []
    let maxDataLength = 0
    let hasIgnoreData = false
    data.forEach((d, i) => {
      if (i === 0) {
        return
      }

      if (this.filter && this.filter.x && this.filter.x.includes(d[0])) {
        return
      }

      category.push(d[0])

      if (d.length > maxDataLength) {
        maxDataLength = d.length
      }

      d.forEach((dd, j) => {
        if (dataFilter !== undefined && dd === dataFilter) {
          if (!hasIgnoreData) {
            hasIgnoreData = true
            seriesData.push([category.length - 1, dataHeadaer[j].value, dd])
          }
          return
        }

        seriesData.push([category.length - 1, dataHeadaer[j].value, dd])
      })
    })

    let yAxisTickPostions = []

    let lastTick = undefined
    tickPositions.forEach((t) => {
      if (lastTick !== undefined) {
        yAxisTickPostions.push(lastTick + (t - lastTick) / 2)
      }
      lastTick = t
    })

    let options = {}

    options.series = [
      {
        data: seriesData
      }
    ]

    options.xAxis = {
      categories: category,
      gridLineWidth: 0
    }

    options.yAxis = [
      {
        // max: maxDataLength - 2,
        tickPositions: tickPositions,
        min: -0.5,
        minPadding: 0,
        gridLineWidth: 0,
        labels: {
          enabled: false
        },
        title: {
          text: null
        }
      },
      {
        // max: maxDataLength - 2,
        minRange: 0,
        minPadding: 0,
        tickPositions: yAxisTickPostions,
        // category: Object.keys(clusterGroup),
        _categories: Object.keys(clusterGroup),
        min: 0,
        // startOnTick: true,
        title: {
          text: null
        },
        gridLineWidth: 0,
        linkedTo: 0,
        opposite: true,
        offset: 20,
        // tickPlacement: 'on',
        labels: {
          rotation: -45,
          formatter: function () {
            let index = this.axis.tickPositions.indexOf(this.pos)
            return this.axis.options._categories[index]
          }
        }
      }
    ]

    return options
  }

  setOptions(options, isDefaultOptions) {
    if (options.data) {
      this._data = options.data
      this._cluster = options.cluster

      this.filter = null

      let data = options.data,
        cluster = options.cluster

      options = Utils.extend(options, this.setData(data, cluster, options.dataFilter))

      delete options.data
      delete options.cluster
    }

    super.setOptions(options, isDefaultOptions)
  }
}

export default HeatMap
