import TernaryAxis from '../charts/TernaryAxis'

export default (H) => {
  H.Chart.prototype.renderTernaryAxis = function () {
    if (this.ternaryAxis) {
      this.ternaryAxis.render()
    } else {
      this.ternaryAxis = new TernaryAxis(this)
    }
  }

  // H.wrap(H.Chart.prototype, 'render', function(proceed) {
  //    proceed.apply(this, Array.prototype.slice.call(arguments, 1));
  //    console.log('redraw');
  // });
  let clamp = function (value, min, max) {
      return value > min ? (value < max ? value : max) : min
    },
    correctFloat = H.correctFloat,
    isArray = H.isArray,
    pick = H.pick,
    isNumber = H.isNumber,
    defined = H.defined,
    extend = H.extend,
    fireEvent = H.fireEvent

  H.wrap(H.Chart.prototype, 'renderSeries', function (proceed) {
    let isTernary = this.options.chart && this.options.chart.type === 'ternary'
    // calculate Offset
    if (isTernary) {
      let xAxis = this.xAxis[0],
        yAxis = this.yAxis[0],
        height = (xAxis.width / 2) * Math.tan(Math.PI / 3)

      // console.log(height < yAxis.height);

      // if (height < yAxis.height) {
      let offset = (yAxis.height - height) / 2,
        xAxisY = this.plotTop + xAxis.height - offset
      this.ternaryArgs = {
        width: xAxis.width,
        height: height,
        offset: [0, offset],
        points: [
          [xAxis.left, xAxisY],
          [xAxis.left + xAxis.width, xAxisY],
          [xAxis.left + xAxis.width / 2, xAxisY - height]
        ]
      }
    }

    proceed.apply(this, Array.prototype.slice.call(arguments, 1))

    if (isTernary) {
      this.renderTernaryAxis()
    }
  })

  H.seriesType(
    'ternary',
    'bubble',
    {
      // radius: 5,
      stickyTracking: false,
      states: {
        inactive: false
      },
      // colorByPoint: true,
      findNearestPointBy: 'xy'
      // marker: {
      //    symbol: 'circle'
      // }
    },
    {},
    {
      // translate: function () {
      //    H.seriesTypes.scatter.prototype.translate.call(this);

      //    // Add Offset
      //    // console.log(this.userOptions)
      //    let data = this.userOptions.data,
      //       ternaryArgs = this.chart.ternaryArgs;
      //    for (let i = 0; i < this.points.length; i++) {
      //       // let [a, b, c] = data[i],
      //       //    y = a,
      //       //    x = 1 - b - a * Math.sin(Math.PI / 6);
      //       console.log(data[i])
      //       this.points[i].plotX = ternaryArgs.points[0][0] + data[i].x * ternaryArgs.width - this.chart.plotLeft;
      //       this.points[i].plotY = ternaryArgs.points[1][1] - data[i].y * ternaryArgs.height - this.chart.plotTop;
      //    }
      // }

      beforeTranslate() {
        if (!this.processedXData) {
          // hidden series
          this.processData()
        }
        this.generatePoints()
        var series = this,
          options = series.options,
          stacking = options.stacking,
          xAxis = series.xAxis,
          categories = xAxis.categories,
          enabledDataSorting = series.enabledDataSorting,
          yAxis = series.yAxis,
          points = series.points,
          dataLength = points.length,
          hasModifyValue = !!series.modifyValue,
          i,
          pointPlacement = series.pointPlacementToXValue(), // #7860
          dynamicallyPlaced = Boolean(pointPlacement),
          threshold = options.threshold,
          stackThreshold = options.startFromThreshold ? threshold : 0,
          plotX,
          lastPlotX,
          stackIndicator,
          zoneAxis = this.zoneAxis || 'y',
          closestPointRangePx = Number.MAX_VALUE
        /**
         * Plotted coordinates need to be within a limited range. Drawing
         * too far outside the viewport causes various rendering issues
         * (#3201, #3923, #7555).
         * @private
         */
        function limitedRange(val) {
          return clamp(val, -1e5, 1e5)
        }
        // Translate each point

        var ternaryArgs = this.chart.ternaryArgs,
          plotLeft = this.chart.plotLeft,
          plotTop = this.chart.plotTop
        for (i = 0; i < dataLength; i++) {
          var point = points[i],
            xValue = point.x,
            yValue = point.y,
            yBottom = point.low,
            stack =
              stacking &&
              yAxis.stacking &&
              yAxis.stacking.stacks[
                (series.negStacks && yValue < (stackThreshold ? 0 : threshold) ? '-' : '') +
                  series.stackKey
              ],
            pointStack,
            stackValues
          if (
            (yAxis.positiveValuesOnly && !yAxis.validatePositiveValue(yValue)) ||
            (xAxis.positiveValuesOnly && !xAxis.validatePositiveValue(xValue))
          ) {
            point.isNull = true
          }
          // Get the plotX translation
          // fixed: 0
          point.plotX = plotX = ternaryArgs.points[0][0] + point.x * ternaryArgs.width - plotLeft

          // correctFloat(// #5236
          //    limitedRange(xAxis.translate(// #3923
          //       xValue, 0, 0, 0, 1, pointPlacement, this.type === 'flags')) // #3923
          // );
          // Calculate the bottom y value for stacked series
          if (stacking && series.visible && stack && stack[xValue]) {
            stackIndicator = series.getStackIndicator(stackIndicator, xValue, series.index)
            if (!point.isNull) {
              pointStack = stack[xValue]
              stackValues = pointStack.points[stackIndicator.key]
            }
          }
          if (isArray(stackValues)) {
            yBottom = stackValues[0]
            yValue = stackValues[1]
            if (yBottom === stackThreshold && stackIndicator.key === stack[xValue].base) {
              yBottom = pick(isNumber(threshold) && threshold, yAxis.min)
            }
            // #1200, #1232
            if (yAxis.positiveValuesOnly && yBottom <= 0) {
              yBottom = null
            }
            point.total = point.stackTotal = pointStack.total
            point.percentage = pointStack.total && (point.y / pointStack.total) * 100
            point.stackY = yValue
            // Place the stack label
            // in case of variwide series (where widths of points are
            // different in most cases), stack labels are positioned
            // wrongly, so the call of the setOffset is omited here and
            // labels are correctly positioned later, at the end of the
            // variwide's translate function (#10962)
            if (!series.irregularWidths) {
              pointStack.setOffset(series.pointXOffset || 0, series.barW || 0)
            }
          }
          // Set translated yBottom or remove it
          point.yBottom = defined(yBottom)
            ? limitedRange(yAxis.translate(yBottom, 0, 1, 0, 1))
            : null
          // general hook, used for Highstock compare mode
          if (hasModifyValue) {
            yValue = series.modifyValue(yValue, point)
          }
          // Set the the plotY value, reset it for redraws
          // #3201
          // fixed: 1
          point.plotY = ternaryArgs.points[1][1] - point.y * ternaryArgs.height - plotTop

          // ((typeof yValue === 'number' && yValue !== Infinity) ?
          //    limitedRange(yAxis.translate(yValue, 0, 1, 0, 1)) :
          //    void 0);
          point.isInside = this.isPointInside(point)
          // Set client related positions for mouse tracking
          point.clientX = dynamicallyPlaced
            ? correctFloat(xAxis.translate(xValue, 0, 0, 0, 1, pointPlacement))
            : plotX // #1514, #5383, #5518
          // Negative points. For bubble charts, this means negative z
          // values (#9728)
          point.negative = point[zoneAxis] < (options[zoneAxis + 'Threshold'] || threshold || 0)
          // some API data
          point.category =
            categories && typeof categories[point.x] !== 'undefined' ? categories[point.x] : point.x
          // Determine auto enabling of markers (#3635, #5099)
          if (!point.isNull && point.visible !== false) {
            if (typeof lastPlotX !== 'undefined') {
              closestPointRangePx = Math.min(closestPointRangePx, Math.abs(plotX - lastPlotX))
            }
            lastPlotX = plotX
          }
          // Find point zone
          point.zone = this.zones.length && point.getZone()
          // Animate new points with data sorting
          if (!point.graphic && series.group && enabledDataSorting) {
            point.isNew = true
          }
        }
        series.closestPointRangePx = closestPointRangePx
        fireEvent(this, 'afterTranslate')
      },

      translate: function () {
        this.beforeTranslate()

        var i,
          data = this.data,
          point,
          radius,
          radii = this.radii
        // Run the parent method
        // H.seriesTypes.scatter.prototype.translate.call(this);
        // Set the shape type and arguments to be picked up in drawPoints
        i = data.length
        while (i--) {
          point = data[i]
          radius = radii ? radii[i] : 0 // #1737
          if (isNumber(radius) && radius >= this.minPxSize / 2) {
            // Shape arguments
            point.marker = extend(point.marker, {
              radius: radius,
              width: 2 * radius,
              height: 2 * radius
            })
            // Alignment box for the data label
            point.dlBox = {
              x: point.plotX - radius,
              y: point.plotY - radius,
              width: 2 * radius,
              height: 2 * radius
            }
          } else {
            // below zThreshold
            // #1691
            point.shapeArgs = point.plotY = point.dlBox = void 0
          }
        }
      }
    }
  )
}
