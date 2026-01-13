export default (H) => {
  H.seriesType(
    'upgma',
    'bar',
    {
      stacking: 'normal',
      groupPadding: 0.05,
      clip: false,
      states: {
        inactive: false
      }
    },
    {
      drawPoints: function () {
        H.seriesTypes.bar.prototype.drawPoints.call(this)
        let points = this.points,
          linkerAttr = {
            d: ['M'],
            stroke: this.options.borderColor,
            'stroke-width': this.options.borderWidth || 1
          }

        points.forEach((point, i) => {
          if (i === 1) {
            linkerAttr.d.push('L')
          }

          linkerAttr.d.push(point.shapeArgs.x + point.shapeArgs.width)
          linkerAttr.d.push(point.shapeArgs.y)
          linkerAttr.d.push(point.shapeArgs.x)
          linkerAttr.d.push(point.shapeArgs.y)
        })

        if (this.linker) {
          this.linker.attr(linkerAttr)
        } else {
          this.linker = this.chart.renderer.path([]).attr(linkerAttr).add(this.group)
        }
      }
    }
  )
}
