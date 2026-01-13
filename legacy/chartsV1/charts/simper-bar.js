export default (H) => {
  H.seriesType(
    'simper-bar',
    'column',
    {},
    {
      drawPoints: function () {
        H.seriesTypes.column.prototype.drawPoints.call(this)

        let rectAttr = {
          x: this.chart.plotLeft + this.chart.plotWidth * 0.6,
          y: this.chart.plotTop,
          width: this.chart.plotWidth * 0.4 + 2,
          height: this.chart.plotHeight,
          fill: this.chart.chartBackground.attr('fill')
        }

        if (this.background) {
          this.background.attr(rectAttr)
        } else {
          this.background = this.chart.renderer
            .rect(rectAttr.x, rectAttr.y, rectAttr.width, rectAttr.height)
            .attr({
              fill: rectAttr.fill
            })
            .add(this.chart.seriesGroup)
        }
      }
    }
  )
}
