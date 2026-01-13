export default (H) => {
  H.seriesType(
    'tree',
    'scatter',
    {
      enableMouseTracking: false,
      states: {
        inactive: false
      },
      showInLegend: false,
      marker: {
        enabled: true,
        radius: 1,
        states: {
          hover: {
            enabled: false
          }
        }
      }
    },
    {
      destroy: function () {
        if (this.treeLegend) {
          this.treeLegend.forEach((legend) => {
            legend.symbol = legend.symbol.destroy()
            legend.text = legend.text.destroy()
            legend = null
          })
        }

        if (this.pointPaths) {
          this.pointPaths.forEach((p) => {
            // eslint-disable-next-line no-unused-vars
            p = p.destroy()
          })

          this.pointPaths = null
        }

        if (this.pointPathGroup) {
          this.pointPathGroup = this.pointPathGroup.destroy()
        }

        this.treeLegend = null

        H.seriesTypes.scatter.prototype.destroy.call(this)
      },

      drawPoints: function () {
        // H.seriesTypes.scatter.prototype.drawPoints.call(this);

        let points = this.points,
          series = this,
          i = 0,
          total = points.length,
          // eslint-disable-next-line no-unused-vars
          pointGroup = [],
          chart = this.chart,
          pointPaths = series.pointPaths,
          pointPathGroup = series.pointPathGroup,
          isFirstRender = false,
          path = null,
          paths = [],
          colors = this.options.colors,
          counter = 0

        if (!pointPathGroup) {
          isFirstRender = true
          pointPaths = series.pointPaths = []
          pointPathGroup = series.pointPathGroup = chart.renderer.g('tree').add(this.group)
        }

        for (; i < total; i += 3) {
          path = {
            d: [
              'M',
              points[i].plotX,
              points[i].plotY,
              'L',
              points[i + 1].plotX,
              points[i + 1].plotY,
              points[i + 2].plotX,
              points[i + 2].plotY
            ],
            stroke: colors[counter],
            'stroke-width': this.options.width || 1,
            dashstyle: this.options.dashStyle || 'Solid'
          }
          counter++
          paths.push(path)
        }

        if (isFirstRender) {
          paths.forEach((path) => {
            pointPaths.push(chart.renderer.path().attr(path).add(pointPathGroup))
          })
        } else {
          paths.forEach((path, i) => {
            pointPaths[i].attr(path)
          })
        }
        this.renderLegend(isFirstRender)
      },

      renderLegend(isFirstRender) {
        // eslint-disable-next-line no-unused-vars
        let chart = this.chart
        if (isFirstRender) {
          let color = null,
            width = this.options.width,
            y = 0

          this.treeLegend = []
          this.options.names.forEach((name, i) => {
            color = this.options.groupColors[i]

            y = this.chart.plotTop + i * 20
            this.treeLegend.push({
              symbol: this.chart.renderer
                .path(['M', 0, 0, 'L', 30, 0])
                .attr({
                  translateX: 10,
                  translateY: y,
                  stroke: color,
                  'stroke-width': width,
                  dashstyle: this.options.dashStyle || 'Solid'
                })
                .add(),
              text: this.chart.renderer
                .text(name, 45, y + 5)
                .css(this.chart.legend.itemStyle)
                .add()
            })
          })
        } else {
          let color = null,
            width = this.options.width,
            y = 0
          this.options.names.forEach((name, i) => {
            color = this.options.groupColors[i]
            y = this.chart.plotTop + i * 20

            this.treeLegend[i].symbol.attr({
              translateX: 10,
              translateY: y,
              stroke: color,
              'stroke-width': width,
              dashstyle: this.options.dashStyle || 'Solid'
            })
            this.treeLegend[i].text.attr({
              text: name,
              x: 45,
              y: y + 5
            })
          })
        }
      }
    }
  )
}
