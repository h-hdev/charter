export default (H) => {
  H.seriesType(
    'polar',
    'bubble',
    {
      dataLabels: {
        decimals: 3,
        fixOpacity: 0.8,
        style: {
          color: '#333',
          fontWeight: 'bold',
          fontSize: '11px',
          'text-anchor': 'middle',
          'dominant-baseline': 'central',
          textOutline: 'none'
          // stroke: '#333',
          // 'stroke-width': 0.5
        }
      }
    },
    {
      toXY: function (point) {
        var xy,
          chart = this.chart,
          xAxis = this.xAxis,
          yAxis = this.yAxis,
          plotX = point.plotX,
          plotY = point.plotY,
          series = point.series,
          inverted = chart.inverted,
          pointY = yAxis.max,
          radius = inverted ? plotX : yAxis.len - this.options.maxSize, // - plotY, // fixed: 1
          clientX

        // Corrected y position of inverted series other than column
        if (inverted && series && !series.isRadialBar) {
          point.plotY = plotY =
            typeof pointY === 'number' ? yAxis.translate(pointY) || 0 : 0
        }

        // Save rectangular plotX, plotY for later computation
        // point.rectPlotX = plotX
        // point.rectPlotY = plotY

        if (yAxis.center) {
          radius += yAxis.center[3] / 2
        }

        // Find the polar plotX and plotY
        xy = inverted
          ? yAxis.postTranslate(point.rectPlotY, radius)
          : xAxis.postTranslate(point.rectPlotX, radius)
        point.plotX = point.polarPlotX = xy.x - chart.plotLeft
        point.plotY = point.polarPlotY = xy.y - chart.plotTop

        // If shared tooltip, record the angle in degrees in order to align X
        // points. Otherwise, use a standard k-d tree to get the nearest point
        // in two dimensions.
        if (this.kdByAngle) {
          clientX =
            ((plotX / Math.PI) * 180 + xAxis.pane.options.startAngle) % 360
          if (clientX < 0) {
            // #2665
            clientX += 360
          }
          point.clientX = clientX
        } else {
          point.clientX = point.plotX
        }
      },

      render: function () {
        for(let i = this.points.length - 1; i >= 0; i--) {
          this.toXY(this.points[i])
        }
        H.seriesTypes.bubble.prototype.render.call(this)
        if (this.clipCircle) {
          this.clipCircle.attr({
            r: this.yAxis.pane.center[2] / 2 + this.options.maxSize
          })
        }
      },

      destroy: function () {
        if (this.dlLabels) {
          this.dlLabels.forEach((dl) => {
            dl = dl.destroy()
          })
          this.dlLabels = null
        }

        if (this.dlGroup) {
          this.dlGroup = this.dlGroup.destroy()
        }

        if (this.subLegend) {
          this.subLegend.parentNode.removeChild(this.subLegend)
          this.subLegend = null
        }

        H.seriesTypes.bubble.prototype.destroy.call(this)
      },

      drawPoints: function () {
        H.seriesTypes.bubble.prototype.drawPoints.call(this)

        let center = this.chart.pane[0].center
        let size = Math.abs(
          this.yAxis.toPixels(0, true) -
          this.yAxis.toPixels(this.yAxis.min, true)
        )
        if (this.centerCircle) {
          this.centerCircle.attr({
            cx: center[0] + this.chart.plotLeft,
            cy: center[1] + this.chart.plotTop,
            r: size
          })
        } else {
          this.centerCircle = this.chart.renderer
            .circle(
              center[0] + this.chart.plotLeft,
              center[1] + this.chart.plotTop,
              size
            )
            .attr({
              fill: '#fff',
              zIndex: 6
            })
            .add()
        }

        let points = this.points,
          xAxis = this.xAxis,
          chart = this.chart,
          renderer = this.chart.renderer,
          series = chart.series,
          isFirstRender = false
        if (!this.dlGroup) {
          this.dlGroup = this.chart.renderer
            .g('polar-datalabels')
            .attr({ zIndex: 8 })
            .css(this.options.dataLabels.style)
            .add(this.group)
          isFirstRender = true
        }
        let decimals = this.options.dataLabels.decimals || 3
        // this.options.dataLabels.style.stroke = this.options.dataLabels.style.color;
        points.forEach((p, i) => {
          this.fixXAxisGrid(p, xAxis)
          if (isFirstRender) {
            p.dlLabels = []
          }
          this.renderDataLabels(
            p,
            [
              p.z.toFixed(decimals),
              series[0].points[i].y.toFixed(decimals),
              series[1].points[i].y.toFixed(decimals)
            ],
            isFirstRender
          )
        })
        this.fixLegend()
      },

      renderDataLabels: function (point, texts, isFirstRender) {
        let rotation =
          90 + ((point.rectPlotX + this.xAxis.startAngleRad) / Math.PI) * 180
        let position
        let attr
        if (rotation > 90 && rotation < 270) {
          rotation = rotation - 180
        }
        [1, 0.7, 0.6].forEach((pos, i) => {
          position = this.xAxis.postTranslate(
            point.rectPlotX,
            this.yAxis.len * pos
          )

          position.x -= this.chart.plotLeft
          position.y -= this.chart.plotTop

          attr = {
            rotationOriginX: position.x,
            rotationOriginY: position.y,
            rotation: rotation,
            opacity:
              point.x === 0 &&
              this.options.dataLabels.style.fontWeight === 'bold'
                ? this.options.dataLabels.fixOpacity
                : 1
          }

          if (isFirstRender) {
            point.dlLabels.push(
              this.chart.renderer
                .text(texts[i], position.x, position.y)
                .attr(attr)
                .add(this.dlGroup)
            )
          } else {
            attr.x = position.x
            attr.y = position.y
            attr.text = texts[i]

            point.dlLabels[i].attr(attr)
          }
        })
      },

      fixXAxisGrid: function (point, xAxis) {
        let gridLine = xAxis.ticks[point.x].gridLine,
          paths = gridLine.d.split(' '),
          chart = this.chart

        paths[4] = chart.plotLeft + point.polarPlotX
        paths[5] = chart.plotTop + point.polarPlotY
        gridLine.attr({
          d: paths
        })
        // if (point.x === 0 || point.x === Math.ceil((xAxis.max - xAxis.min) / 2) - 1) {
        if (point.x === 0 && xAxis.ticks[point.x].label) {
          xAxis.ticks[point.x].label.element.style['text-anchor'] = 'middle'
        }
      },

      fixLegend: function () {
        // change 1: legendGroup -> legendItem; 2: legendGroup.element -> legendItem.group
        if (this.subLegend || !this.legendItem) {
          return false
        }
        let legendItem = this.legendItem
        let el = (this.subLegend = this.legendItem.group.element.cloneNode(true))
        this.legendItem.group.element.parentNode.appendChild(el)

        el.setAttribute(
          'transform',
          `translate(${legendItem.group.translateX},${
            legendItem.group.translateY + this.itemHeight
          })`
        )
        el.children[1].setAttribute('fill', this.chart.userOptions.colors[3])
        el.children[1].setAttribute('stroke', this.chart.userOptions.colors[3])
        el.children[2].innerHTML = this.chart.userOptions.names[3]
      }
    }
  )
}
