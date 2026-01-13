export default (H) => {
  const customColors = [
    ...H.getOptions().colors,
    '#B41431',
    '#E7BBBC',
    '#785228',
    '#F2A84A',
    '#CA503C',
    '#C8E8E8',
    '#B0BAB5',
    '#383F68',
    '#CED29C',
    '#F2A84B',
    '#F34D4D',
    '#4DAE7D',
    '#925EA1',
    '#4DA8A6',
    '#D04D64',
    '#8F88B9',
    '#BE4D89',
    '#E6B1D7',
    '#F7B7C0']
  H.seriesType(
    'stree',
    'scatter',
    {
      animation: false,
      enableMouseTracking: false,
      states: {
        inactive: false
      },
      showInLegend: false,
      boostThreshold: 1,
      // turboThreshold: 1,
      marker: {
        enabled: true,
        radius: 1,
        states: {
          hover: {
            enabled: false
          }
        }
      }
    } ,
    {
      destroy: function () {
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

        if (this.treeGroup) {
          this.treeGroup.groups.forEach((group) => {
            this.removeTreeGroup(group)
          })
          this.treeGroup.group.destroy()
          this.treeGroup = null
        }

        if (this.treeGroupLegend) {
          this.treeGroupLegend.group.destroy()
          this.treeGroupLegend = null
        }

        this.treeLegend = null
        H.seriesTypes.scatter.prototype.destroy.call(this)
      },

      drawPoints: function () {
        // H.seriesTypes.scatter.prototype.drawPoints.call(this);
        // return false;

        // console.log('draw')

        let points = this.points,
          series = this,
          total = points.length,
          chart = this.chart,
          pointPaths = series.pointPaths,
          pointPathGroup = series.pointPathGroup,
          isFirstRender = false,
          paths = []
        if (!pointPathGroup) {
          isFirstRender = true
          pointPaths = series.pointPaths = []
          pointPathGroup = series.pointPathGroup = chart.renderer.g('tree').add(this.group)
        }

        for (let i = 0; i < total; i += 3) {
          const path = {
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
            stroke: this.options.borderColor || '#555',
            // stroke: colors[counter],
            'stroke-width': this.options.borderWidth || 1,
            dashstyle: this.options.dashStyle || 'Solid'
          }
          paths.push(path)
        }

        // if (isFirstRender) {
        //   paths.forEach((path) => {
        //     pointPaths.push(chart.renderer.path().attr(path).add(pointPathGroup))
        //   })
        // } else {
        //   paths.forEach((path, i) => {
        //     pointPaths[i].attr(path)
        //   })
        // }
        paths.forEach((path, i) => {
          isFirstRender ? pointPaths.push(chart.renderer.path().attr(path).add(pointPathGroup)) : pointPaths[i].attr(path)
        })

        if (this.userOptions.groups) {
          this.group.attr({
            // translateY: 28
            translateY: this.yAxis.top - 10
          })

          let isFirstRender = this.treeGroup === undefined
          // console.log('TreeSeries: ', this)
          this.renderGroup(this.userOptions.groups, isFirstRender)

          this.renderGroupLegend(this.userOptions.groups, isFirstRender)
        }
      },

      // eslint-disable-next-line no-unused-vars
      renderGroup(groups, isFirstRender) {
        let chart = this.chart,
          renderer = chart.renderer,
          xAxis = this.xAxis,
          yAxis = this.yAxis
        if (!this.treeGroup) {
          this.treeGroup = {
            group: renderer.g('tree-groups').add(),
            groups: []
          }
        } else {
          // minus
          let minus = this.treeGroup.groups.length - groups.length
          if (minus > 0) {
            while (minus) {
              let minusGroups = this.treeGroup.groups[this.treeGroup.groups.length - 1]
              this.removeTreeGroup(minusGroups)
              this.treeGroup.groups.length--
              minus--
            }
          }
        }

        groups.forEach((group, i) => {
          if (i >= this.treeGroup.groups.length) {
            let treeGroup = {
              symbols: []
            }

            group.x.forEach((x) => {
              treeGroup.symbols.push(
                this.addTreeGroupSymbol(x, group.color || customColors[i], xAxis, yAxis)
              )
            })

            this.treeGroup.groups.push(treeGroup)
          } else {
            let treeGroup = this.treeGroup.groups[i]
            let symbolMinus = group.x.length - treeGroup.symbols.length
            if (symbolMinus > 0) {
              while (symbolMinus) {
                treeGroup.symbols[treeGroup.symbols.length - 1].destroy()
                treeGroup.symbols.length--
                symbolMinus--
              }
            }

            group.x.forEach((x, j) => {
              if (j >= treeGroup.symbols.length) {
                treeGroup.symbols.push(
                  this.addTreeGroupSymbol(x, group.color || customColors[i], xAxis, yAxis)
                )
              } else {
                treeGroup.symbols[j].attr({
                  x: xAxis.toPixels(x - 0.5),
                  y: yAxis.top + yAxis.height - 10,
                  width: xAxis.transA
                })
              }
            })
          }
        })
      },

      addTreeGroupSymbol(x, color, xAxis, yAxis) {
        return this.chart.renderer
          .rect(xAxis.toPixels(x - 0.5), yAxis.top + yAxis.height - 10, xAxis.transA, 10)
          .attr({
            fill: color,
            stroke: '#fff',
            'stroke-width': 0.5
          })
          .add(this.treeGroup.group)
      },

      removeTreeGroup(group) {
        group.symbols.forEach((symbol) => {
          symbol.destroy()
        })
        group = null
      },

      renderGroupLegend(groups, isFirstRender) {
        let renderer = this.chart.renderer

        if (isFirstRender) {
          this.treeGroupLegend = {
            group: renderer.g('tree-legend').add(),
            items: []
          }

          this.treeGroupLegend.title = renderer
            .text('Group', 0, 0)
            .css({
              fontSize: '12px',
              fontWeight: 'bold'
            })
            .add(this.treeGroupLegend.group)
        }
        // let symbolMinus = this.treeGroupLegend.items.length - groups.length // 原来的symbolMinus 数量逻辑有误差， 只要大于零就清空
        let symbolMinus = this.treeGroupLegend.items.length
        if (symbolMinus > 0) {
          while (symbolMinus) {
            let item = this.treeGroupLegend.items[this.treeGroupLegend.items.length - 1]
            item.symbol.destroy()
            item.text.destroy()
            item = null
            this.treeGroupLegend.items.length--
            symbolMinus--
          }
        }

        let top = 8,
          height = 20,
          x = this.chart.legend.padding,
          width = this.chart.legend.symbolWidth
        if (this.chart.legend.options.layout === "horizontal") {
          groups.forEach((group, i) => {
            this.treeGroupLegend.items.push({
              symbol: renderer
                .rect(x, top, width, height)
                .attr({
                  fill: group.color || customColors[i]
                })
                .add(this.treeGroupLegend.group),
              text: renderer
                // .text(group.name, x + width / 2, top + height + 6)
                // .css({ fontSize: '10px', 'dominant-baseline': 'central' })
                .text(group.name, 20 , top - height * (i+1))
                .css({ fontSize: '10px', transform: 'rotate(90deg)' })
                .add(this.treeGroupLegend.group)
            })
            x += width
          })
          this.treeGroupLegend.group.attr({
            display: this.chart.legend?.display ? 'block' : 'none',
            translateX: (this.chart.legend.group?.translateX ?? 0) - x,
            translateY: this.chart.legend.group?.translateY ?? 0,
            zIndex: 10
          })
        } else {
          groups.forEach((group, i) => {
            this.treeGroupLegend.items.push({
              symbol: renderer
                .rect(x, top, width, height)
                .attr({
                  fill: group.color || customColors[i]
                })
                .add(this.treeGroupLegend.group),
              text: renderer
                .text(group.name, x + width + 3, top + height / 2)
                .css({ fontSize: '10px', 'dominant-baseline': 'central' })
                .add(this.treeGroupLegend.group)
            })
            top += height
          })
          this.treeGroupLegend.group.attr({
            display: this.chart.legend?.display ? 'block' : 'none',
            translateX: this.chart.legend.group?.translateX ?? 0,
            translateY:
              (this.chart.legend.group?.translateY ?? 0) + this.chart.legend.legendHeight + 10,
            zIndex: 10
          })
        }


        if (this.chart.legend.options.verticalAlign === 'bottom') {
          let height = this.treeGroupLegend.group.getBBox().height
          this.chart.legend.group.attr({
            translateY: this.chart.legend.group.alignAttr.translateY - height
          })
          this.treeGroupLegend.group.attr({
            translateY: this.treeGroupLegend.group.translateY - height
          })
        }
        if (this.chart.legend.options.align === 'left') {
          let width = this.treeGroupLegend.group.getBBox().width
          this.chart.legend.group.attr({
            translateX: this.chart.legend.group.alignAttr.translateX + width
          })
          this.treeGroupLegend.group.attr({
            translateX: this.treeGroupLegend.group.translateX + width
          })
        }
      }
    }
  )
}
