export default (H) => {
  // render ellipse
  if (!H.SVGRenderer.prototype.ellipse) {
    H.SVGRenderer.prototype.ellipse = function (cx, cy, rx, ry) {
      var attribs = H.isObject(cx)
          ? cx
          : typeof cx === 'undefined'
          ? {}
          : {
              cx: cx,
              cy: cy,
              rx: rx,
              ry: ry
            },
        wrapper = this.createElement('ellipse')

      // Setting x or y translates to cx and cy
      wrapper.xSetter = wrapper.ySetter = function (value, key, element) {
        element.setAttribute('c' + key, value)
      }

      return wrapper.attr(attribs)
    }
  }

  H.seriesType(
    'petal',
    'pie',
    {
      showInLegend: true,
      opacity: 0.8,
      borderWidth: 0,
      dataLabels: {
        connectorWidth: 0,
        distance: -30
      }
    },
    {
      updateTotals: H.noop,

      getCenter: function () {
        let pointCount = this.points.length,
          center = H.seriesTypes.pie.prototype.getCenter.call(this),
          rx = center[2] / 4,
          ry =
            pointCount <= 3
              ? rx / (pointCount - 1)
              : rx * Math.tan((1 / this.points.length) * Math.PI) //rx * Math.tan((360 / this.points.length / 2) / 180 * Math.PI);

        if (ry > rx / 2) {
          ry = rx / 2
        }
        // console.log(rx, ry);
        // 4
        center.push(rx)
        // 5
        center.push(ry)

        return center
      },

      drawPoints: function () {
        // console.log('drawPoins')
        var renderer = this.chart.renderer,
          // eslint-disable-next-line no-unused-vars
          center = this.center,
          series = this,
          chart = series.chart,
          position = null,
          style = chart.userOptions.labelsStyle[1],
          align = null
        this.points.forEach(function (point) {
          // When updating a series between 2d and 3d or cartesian and
          // polar, the shape type changes.
          if (point.graphic && point.hasNewShapeType()) {
            point.graphic = point.graphic.destroy()
            if (point.text) {
              point.text = point.text.destroy()
            }
          }

          position = series.calcLabelPosition(point, 10)
          if (!point.graphic) {
            // point.shapeArgs.fill = point.options.color;
            point.graphic = renderer[point.shapeType](point.shapeArgs).add(point.series.group)
            point.delayedRendering = true

            align = 'middle'
            if (point.custom.rotation < 90 || point.custom.rotation > 270) {
              align = 'start'
            } else if (point.custom.rotation >= 135 && point.custom.rotation <= 225) {
              align = 'end'
            }

            style['text-anchor'] = align

            if (style.color === null) {
              style.fill = point.color
            }

            point.text = renderer
              .text(point.name, position.x, position.y)
              .css(style)
              .add(point.series.group)
          } else {
            point.graphic.attr(point.shapeArgs)
            point.text.attr({
              text: point.name,
              x: position.x,
              y: position.y
            })
            // .css(style).add(point.series.group);
          }
        })

        let centerStyle = H.merge({}, chart.userOptions.labelsStyle[0]),
          fill = centerStyle.fill
        delete centerStyle.fill
        if (!this.centerCircle) {
          this.centerCircle = this.chart.renderer
            .circle(this.center[0], this.center[1], this.center[5] * 0.7)
            .attr({
              fill: fill || '#fff'
            })
            .add(this.group)

          this.seriesNameText = this.chart.renderer
            .text(this.name, this.center[0], this.center[1])
            .css(centerStyle)
            .add(this.group)
        } else {
          this.centerCircle.attr({
            cx: this.center[0],
            cy: this.center[1],
            r: this.center[5] * 0.7
          })
          this.seriesNameText
            .attr({
              text: this.name,
              x: this.center[0],
              y: this.center[1]
            })
            .css(centerStyle)
        }
      },

      redrawPoints: null,

      translate: function (positions) {
        // console.log('translate')
        this.generatePoints()
        var series = this,
          options = series.options,
          points = series.points,
          angle,
          radiusX,
          radiusY,
          // the x component of the radius vector for a given point
          labelDistance = options.dataLabels.distance,
          i,
          len = points.length,
          point

        if (!positions) {
          series.center = positions = series.getCenter()
        }

        let r = positions[4]

        // Calculate the geometry for each point
        for (i = 0; i < len; i++) {
          point = points[i]
          point.shapeType = 'ellipse'
          point.shapeArgs = {
            cx: positions[0] + r,
            cy: positions[1],
            rx: r,
            ry: positions[5],
            opacity: series.options.opacity,
            rotationOriginX: positions[0],
            rotationOriginY: positions[1],
            rotation: point.options.custom.rotation,
            fill: point.color,
            stroke: point.borderColor || this.options.borderColor,
            'stroke-width':
              point.borderWidth === undefined ? this.options.borderWidth : point.borderWidth
          }

          //  console.log(point);
          // Used for distance calculation for specific point.
          point.labelDistance = H.pick(
            point.options.dataLabels && point.options.dataLabels.distance,
            labelDistance
          )
          // Compute point.labelDistance if it's defined as percentage
          // of slice radius (#8854)
          point.labelDistance = H.relativeLength(point.labelDistance, positions[0] + 2 * r)

          // Saved for later dataLabels distance calculation.
          series.maxLabelDistance = Math.max(series.maxLabelDistance || 0, point.labelDistance)
          // The angle must stay within -90 and 270 (#2645)
          angle = (point.options.custom.rotation / 180) * Math.PI
          if (angle > 1.5 * Math.PI) {
            angle -= 2 * Math.PI
          } else if (angle < -Math.PI / 2) {
            angle += 2 * Math.PI
          }

          // set the anchor point for tooltips
          radiusX = Math.cos(angle) * (positions[2] / 2)
          radiusY = Math.sin(angle) * (positions[2] / 2)

          point.radiusX = radiusX
          point.radiusY = radiusY
          point.half = angle < -Math.PI / 2 || angle > Math.PI / 2 ? 1 : 0
          point.angle = angle
          // Set the anchor point for data labels. Use point.labelDistance
          // instead of labelDistance // #1174
          // finalConnectorOffset - not override connectorOffset value.
          // finalConnectorOffset = Math.min(connectorOffset, point.labelDistance / 5); // #1678
          point.labelPosition = {
            natural: series.calcLabelPosition(point, point.labelDistance),
            final: {
              // used for generating connector path -
              // initialized later in drawDataLabels function
              // x: undefined,
              // y: undefined
            },
            // left - pie on the left side of the data label
            // right - pie on the right side of the data label
            // center - data label overlaps the pie
            alignment: 'center'
          }
        }
        H.fireEvent(series, 'afterTranslate')
      },

      calcLabelPosition(point, offset) {
        let center = this.center,
          angle = point.angle
        return {
          x: center[0] + point.radiusX + Math.cos(angle) * offset,
          y: center[1] + point.radiusY + Math.sin(angle) * offset
        }
      }
    }
  )
}
