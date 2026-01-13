import Utils from '../Utils/Utils'
export default (H) => {
  H.seriesType(
    'venns',
    'venn',
    {
      // series: {
      //   states: {
      //     inactive: {
      //       enabled: true,
      //       // opacity: 0.8
      //     },
      //     hover: {
      //       opacity: 0.8
      //     }
      //   }
      // },
      states: {
        inactive: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: true,
        def: false,
        format: '{point.index}',
        allowOverlap: true,
        style: {
          textOutline: 'none'
        }
      }
    },
    {
      // eslint-disable-next-line no-unused-vars
      alignDataLabel: function (point, dataLabel, options, alignTo, isNew) {
        let bbox = dataLabel.getBBox()
        dataLabel.attr({
          x: point.plotX - bbox.width / 2,
          y: point.plotY - bbox.height / 2
        })
      },

      render: function () {
        H.seriesTypes.venn.prototype.render.call(this)
        // console.log('render');
        this.applyScale()
      },

      drawPoints: function () {
        let series = this,
          chart = series.chart

        this.points.forEach((p) => {
          if (p.options.name) {
            let legendItemAttr = {
                text: p.options.name,
                x: 0,
                y: 0,
                translateX: p.options.position[0],
                translateY: p.options.position[1],
                rotation: 0
              },
              legendItemStyle = chart.options.legend.itemStyle

            legendItemStyle['text-anchor'] = p.options.position[2]
            legendItemStyle['dominant-baseline'] = p.options.position[3]

            if (legendItemStyle['dominant-baseline'] === 'auto') {
              legendItemAttr.translateY -= 5
            }

            if (p.options.position.length > 4) {
              legendItemAttr.rotation = p.options.position[4]
            }
            if (p.legendText) {
              p.legendText.attr(legendItemAttr).css(legendItemStyle)
              for (let key in legendItemStyle) {
                p.legendText.element.style[key] = legendItemStyle[key]
              }
            } else {
              p.legendText = chart.renderer
                .text()
                .attr(legendItemAttr)
                .css(legendItemStyle)
                .add(series.group)
            }
          } else if (p.legendText) {
            p.legendText = p.legendText.destroy()
          }

          if (p.graphic) {
            p.graphic.attr({
              fill: p.options.color,
              d: p.options.path.split(',')
            })
          } else {
            p.graphic = chart.renderer
              .path(p.options.path.split(','))
              .attr({
                fill: p.options.color
              })
              .add(series.group)
          }

          let bbox = p.graphic.getBBox()
          p.plotX = bbox.x + bbox.width / 2
          p.plotY = bbox.y + bbox.height / 2
          p._plotX = p.plotX
          p._plotY = p.plotY
        })
      },

      getGroupAttr() {
        if (!this._groupScale) {
          let plotSize = [this.chart.plotWidth, this.chart.plotHeight],
            viewBox = this.options._viewBox,
            scale = [plotSize[0] / viewBox[0], plotSize[1] / viewBox[1]]
          this._groupScale = Utils.min(scale[0], scale[1])
        }
      },

      applyScale() {
        this.getGroupAttr()
        this.group.attr({
          scaleX: this._groupScale,
          scaleY: this._groupScale
        })

        this.dataLabelsGroup.attr({
          scaleX: this._groupScale,
          scaleY: this._groupScale
        })

        let groupReact = this.group.element.getBoundingClientRect(),
          plotRect = this.chart.plotBackground.element.getBoundingClientRect(),
          diff = {
            translateX:
              plotRect.x +
              plotRect.width / 2 -
              groupReact.x -
              groupReact.width / 2 +
              this.group.translateX,
            translateY:
              plotRect.y +
              plotRect.height / 2 -
              groupReact.y -
              groupReact.height / 2 +
              this.group.translateY
          }

        this.points.forEach((p) => {
          // p.plotX = p._plotX + diff.translateX;
          // p.plotY = p._plotY +diff.translateY;

          // console.log(p.plotX, p.plotY);
          let bbox = p.graphic.getBBox()
          p.plotX = bbox.x + bbox.width / 2
          p.plotY = bbox.y + bbox.height / 2
        })
        this.group.attr(diff)
        this.dataLabelsGroup.attr(diff)
      }
    },
    {
      destroyElements: function (kinds) {
        if (this.legendText) {
          this.legendText = this.legendText.destroy()
        }
        H.seriesTypes.venn.prototype.pointClass.prototype.__proto__.destroyElements.call(
          this,
          kinds
        )
      }
    }
  )
}
