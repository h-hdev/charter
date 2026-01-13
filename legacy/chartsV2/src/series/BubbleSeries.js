export default (H) => {
  H.seriesType(
    'bub',
    'bubble',
    {},
    {
      parallelArrays: ['x', 'y', 'z', 'padj', 'name'],
      // pointArrayMap: ['x', 'y', 'z', 'padj'],
      pointArrayMap: ['y', 'z', 'padj'],
      drawPoints: function () {
        H.seriesTypes.bubble.prototype.drawPoints.call(this)
        this.adjustLegend()
      },

      adjustLegend() {
        let legend = this.chart.legend
        // let bubbleLegend = legend.allItems[1],
        // 	symbols = bubbleLegend ? bubbleLegend.symbols : undefined,
        // 	ranges = bubbleLegend ? bubbleLegend.ranges : undefined,
        // 	top = 0,
        // 	y
        let bubbleLegend = legend.bubbleLegend,
          symbols = bubbleLegend?.symbols,
          ranges = bubbleLegend?.ranges,
          top = 0,
          y
        // 按 age 升序排序
        ranges.sort((a, b) => a.value - b.value);
        symbols.labels.sort((m, n) => m.textStr - n.textStr);
        symbols.bubbleItems.reverse()
        // console.log(legend);
        // bubbleLegend && bubbleLegend.legendGroup &&
        // 	bubbleLegend.legendGroup.attr({
        // 		translateY: legend.titleHeight - 20
        // 	})
        // console.log("thisChart: ", this.chart.userOptions.series[0].data)
        // 当仅有两种p值时，gene number 示例 去掉一个重复（默认展示三个）
        const _geneNumberSize = new Set()
        this.chart.userOptions.series[0].data.forEach(p => _geneNumberSize.add(p.z))

        bubbleLegend &&
          bubbleLegend.legendItem &&
          bubbleLegend.legendItem.group.attr({
            // translateY: legend.titleHeight - 20
            translateY: legend.titleHeight - 35
          })
        symbols &&
          symbols.bubbleItems.forEach((item, i) => {
            if (i === 0) {
              if (_geneNumberSize.size === 2) {
                item.css({
                  'display': 'none'
                })
                symbols.labels[i]
                  .css({
                    'display': 'none'
                  })
              } else {
                // top = ranges[i].radius * 3
                top = ranges.at(-1).radius * 3
                symbols.labels[i]
                  .attr({
                    y: ranges[i].center
                  })
                  .css({
                    'dominant-baseline': 'central'
                  })
              }
            } else {
              y = top + ranges[i].radius

              item.attr({
                cy: y
              })

              symbols.labels[i]
                .css({
                  'dominant-baseline': 'central',
                  'display': 'block'
                })
                .attr({
                  y: y
                })

              top += ranges[i].radius * 3
            }

            symbols.labels[i].element.style['dominant-baseline'] = 'central'
          })

        this.legendTitle = this.chart.renderer
          .text(legend.options?.title?.identity || 'padj', 0, -12)
          .css(legend.itemStyle)
          .add(legend.allItems[0].axisGroup)

        if (legend.options.verticalAlign === 'bottom') {
          legend.group.attr({
            translateY: legend.group.alignAttr.translateY - 80
          })
        }
      }
    }
  )
}
