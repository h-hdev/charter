import Utils from '../Utils/Utils'

class TernaryAxis {
  constructor(chart) {
    this.chart = chart
    this.renderer = chart.renderer
    this.xAxis = this.chart.xAxis[0]

    this.init()
  }

  init() {
    this.tickAmount = 5
    this.group = this.renderer.g('ternary-axis').add(this.xAxis.group)
    this.ticks = [[], [], []]
    this.title = []
    this.hasRender = false
    this.render()
  }

  getShapeArgs() {
    let ternary = this.chart.ternaryArgs,
      tickAmount = this.tickAmount,
      width = ternary.width / tickAmount,
      height = ternary.height / tickAmount,
      axisLinePath = ['M'],
      axisGridPath = [],
      axisPoints = [],
      calcPoint = function (axis, j) {
        //points[0].push([ternary.points[0][0] + width * i, ternary.points[0][1]]);
        // points[1].push([ternary.points[0][0] + width * (0.5 * i + 2.5), ternary.points[0][1] - height * (5 - i)]);
        // points[2].push([ternary.points[0][0] + width * (0.5 * i), ternary.points[0][1] - height * i]);
        let x = j,
          y = 0
        if (axis === 1) {
          x = 0.5 * j + 2.5
          y = tickAmount - j
        } else if (axis === 2) {
          x = 0.5 * j
          y = j
        }

        return [ternary.points[0][0] + width * x, ternary.points[0][1] - height * y]
      }

    /**
     *                   /\
     *                  /  \
     *                 /    \
     *                /      \
     *            0  /        \   2
     *              /          \
     *             /            \
     *            /              \
     *            -----------------
     *                   1
     */

    for (let i = 0; i < ternary.points.length; i++) {
      if (i === 1) {
        axisLinePath.push('L')
      }
      axisLinePath.push(ternary.points[i][0])
      axisLinePath.push(ternary.points[i][1])

      axisPoints.push([])

      for (let j = 1; j < tickAmount; j++) {
        // calcPoint
        axisPoints[i].push(calcPoint(i, j))
      }

      this.renderTitle(i, ternary.points[i])

      // this.renderer.circle(ternary.points[i][0], ternary.points[i][1], 2)
      //    .attr({
      //       fill: i === 0 ? 'red': '#000'
      //    }).add(this.group);

      // this.renderer.circle(ternary.points[])
    }
    // this.renderer.circle(ternary.points[0][0] + ternary.width / 2, ternary.points[0][1] - ternary.height, 3)
    //    .attr({
    //       fill: 'green'
    //    }).add(this.group)

    axisLinePath.push('Z')

    axisPoints.forEach((points, i) => {
      points.forEach((p, j) => {
        if (i === 0) {
          axisGridPath = axisGridPath.concat([
            'M',
            axisPoints[0][3 - j][0],
            axisPoints[0][3 - j][1],
            'L',
            axisPoints[1][3 - j][0],
            axisPoints[1][3 - j][1],
            axisPoints[2][j][0],
            axisPoints[2][j][1],
            p[0],
            p[1]
          ])
        }

        this.renderTick(i, j, p)
      })
    })

    return {
      line: axisLinePath,
      grid: axisGridPath,
      points: axisPoints
    }
  }

  renderTitle(axis, position) {
    let //categoriesMap = [1, 2, 0],
      attr = {
        text: this.xAxis.userOptions.categories[axis],
        x: position[0],
        y: position[1]
      },
      css = Utils.extends(
        {
          fontSize: '14px',
          fontWeight: 'bold',
          'text-anchor': 'middle'
        },
        this.xAxis.userOptions.title.style
      )

    if (axis === 2) {
      attr.y -= 10
    } else {
      css['dominant-baseline'] = 'hanging'
      attr.y += 10
    }

    if (!this.hasRender) {
      this.title.push(this.renderer.text(attr.text, attr.x, attr.y).css(css).add(this.group))
    } else {
      this.title[axis].attr(attr).css(css)
    }
  }

  renderTick(axis, index, position) {
    let attr = {
        x: position[0],
        y: position[1],
        text: index
      },
      css = Utils.extends(
        {
          fontSize: '12px'
        },
        this.xAxis.userOptions?.labels?.style
      )

    if (axis === 0) {
      css['text-anchor'] = 'middle'
      css['dominant-baseline'] = 'hanging'
      attr.y += 10
      attr.text = ((this.tickAmount - 1 - index) * 0.2).toFixed(1)
    } else {
      css['dominant-baseline'] = 'central'
      attr.text = ((index + 1) * 0.2).toFixed(1)
      if (axis === 1) {
        css['text-anchor'] = 'start'
        attr.x += 10
      } else {
        css['text-anchor'] = 'end'
        attr.x -= 10
      }
    }

    if (!this.hasRender) {
      this.ticks[axis].push(this.renderer.text(attr.text, attr.x, attr.y).css(css).add(this.group))
    } else {
      this.ticks[axis][index].attr(attr).css(css)
    }
  }

  render() {
    let shapeArgs = this.getShapeArgs(),
      lineAttrs = {
        stroke: this.xAxis.options.lineColor,
        'stroke-width': this.xAxis.options.lineWidth
      },
      gridLineAttr = {
        stroke: this.xAxis.options.gridLineColor || this.xAxis.options.lineColor,
        'stroke-width': this.xAxis.options.gridLineWidth || this.xAxis.options.lineWidth,
        dashstyle: this.xAxis.options.gridLineStyle || 'Dash'
      }

    if (!this.axisLine) {
      lineAttrs.class = 'axis-line'
      this.axisLine = this.renderer.path(shapeArgs.line).attr(lineAttrs).add(this.group)

      lineAttrs.class = 'axis-grid'
      lineAttrs.dashstyle = 'Dash'
      this.axisGrid = this.renderer.path(shapeArgs.grid).attr(gridLineAttr).add(this.group)
    } else {
      lineAttrs.d = shapeArgs.line
      this.axisLine.attr(lineAttrs)
      lineAttrs.d = shapeArgs.grid
      this.axisGrid.attr(lineAttrs)
    }

    this.hasRender = true
  }

  reflow() {
    // TODO:
  }
}

export default TernaryAxis
