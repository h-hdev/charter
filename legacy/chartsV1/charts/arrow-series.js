export default (H) => {
  H.AST.allowedAttributes.push('markerUnits')
  H.AST.allowedAttributes.push('viewBox')
  H.AST.allowedAttributes.push('transform')
  function getArrowPath(x, y) {
    return [
      'M',
      2 + x,
      2 + y,
      'L',
      10 + x,
      6 + y,
      'L',
      2 + x,
      10 + y,
      'L',
      8 + x,
      6 + y,
      'L',
      2 + x,
      2 + y
    ]
  }
  if (!H.LegendSymbolMixin) {
    H.LegendSymbolMixin = {}
  }
  H.LegendSymbolMixin.drawArrow = function (legend) {
    var options = this.options,
      markerOptions = options.marker,
      radius,
      legendSymbol,
      symbolWidth = legend.symbolWidth,
      symbolHeight = legend.symbolHeight,
      generalRadius = symbolHeight / 2,
      renderer = this.chart.renderer,
      legendItemGroup = this.legendGroup,
      verticalCenter = legend.baseline - Math.round(legend.fontMetrics.b * 0.3),
      attr = {}
    // Draw the line
    if (!this.chart.styledMode) {
      attr = {
        'stroke-width': options.lineWidth || 0
      }
      if (options.dashStyle) {
        attr.dashstyle = options.dashStyle
      }
    }
    this.legendLine = renderer
      .path(
        ['M', 0, verticalCenter, 'L', symbolWidth, verticalCenter].concat(
          getArrowPath(symbolWidth - 6, verticalCenter - 6)
        )
      )
      .addClass('highcharts-graph')
      .attr(attr)
      .add(legendItemGroup)
    // Draw the marker
    if (markerOptions && markerOptions.enabled !== false && symbolWidth) {
      // Do not allow the marker to be larger than the symbolHeight
      radius = Math.min(H.pick(markerOptions.radius, generalRadius), generalRadius)
      // Restrict symbol markers size
      if (this.symbol.indexOf('url') === 0) {
        markerOptions = H.merge(markerOptions, {
          width: symbolHeight,
          height: symbolHeight
        })
        radius = 0
      }
      this.legendSymbol = legendSymbol = renderer
        .symbol(
          this.symbol,
          symbolWidth / 2 - radius,
          verticalCenter - radius,
          2 * radius,
          2 * radius,
          markerOptions
        )
        .addClass('highcharts-point')
        .add(legendItemGroup)
      legendSymbol.isMarker = true
    }
  }

  H.seriesType(
    'arrow',
    'scatter',
    {
      lineWidth: 1,
      marker: null,
      center: [0, 0]
    },
    {
      markerAttribs: H.noop,
      getSymbol: H.noop,
      drawGraph: H.noop,
      drawLegendSymbol: H.LegendSymbolMixin.drawArrow,
      pointAttribs: function (point, state) {
        var options = this.options,
          stroke = point.color || this.color,
          strokeWidth = this.options.lineWidth,
          dashStyle = this.options.dashStyle || 'Solid'

        if (state) {
          stroke = options.states[state].color || stroke
          strokeWidth =
            (options.states[state].lineWidth || strokeWidth) +
            (options.states[state].lineWidthPlus || 0)
        }
        return {
          stroke: stroke,
          'stroke-width': strokeWidth,
          dashstyle: dashStyle
        }
      },

      drawPoints: function () {
        if (this.options.arrow && !this.arrowSymbol) {
          this.arrowSymbol = this.chart.renderer.definition({
            tagName: 'marker',
            id: 'link-marker-end',
            markerUnits: 'strokeWidth',
            markerWidth: 12,
            markerHeight: 12,
            viewBox: '0 0 12 12',
            refX: 9,
            refY: 6,
            orient: 'auto',
            transform: 'translate(-6, -6)',
            children: [
              {
                tagName: 'path',
                fill: this.color,
                d: ['M', '2', '2', 'L', '10', '6', 'L', '2', '10', 'L', '6', '6', 'Z'].join(' ')
              }
            ]
          })
        }
        var chart = this.chart,
          centerX = this.xAxis.translate(this.options.center[0], 0, 0, 0, 1),
          centerY = this.yAxis.translate(this.options.center[1], 0, 1, 0, 1)

        this.points.forEach(function (point) {
          var plotX = point.plotX,
            plotY = point.plotY,
            attrs = null
          if (this.options?.clip === false || chart.isInsidePlot(plotX, plotY, chart.inverted)) {
            if (!point.graphic) {
              point.graphic = this.chart.renderer
                .path()
                .add(this.markerGroup)
                .addClass(
                  'highcharts-point ' +
                    'highcharts-color-' +
                    H.pick(point.colorIndex, point.series.colorIndex)
                )
            }
            attrs = {
              d: ['M', centerX, centerY, 'L', plotX, plotY]
            }
            if (this.arrowSymbol) {
              attrs['marker-end'] = 'url(#link-marker-end)'
            }
            point.graphic.attr(attrs)
            if (!this.chart.styledMode) {
              let attrs = this.pointAttribs(point)
              point.graphic.attr(attrs)
            }
          } else if (point.graphic) {
            point.graphic = point.graphic.destroy()
          }
        }, this)

        // if(this.legendLine) {
        //    this.legendLine.attr({
        //       'marker-end': 'url(#link-marker-end)'
        //    });
        // }
      }
    }
  )
}
