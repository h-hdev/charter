import { chart } from "highcharts";

export default (H) => {
  const ScatterProto = H.seriesTypes.scatter.prototype;

  H.seriesType(
    "arcarea",
    "arctree",
    {
      keys: ["x", "y", "x1", "y1"],
      animation: false,
      enableMouseTracking: false,
      states: {
        inactive: false,
      },
      dataLabels: {
        enabled: false,
        // inside: true,
        crop: false,
        allowOverlap: true,
        format: "{point.name}",
        style: {
          textOutline: "none",
        },
        // y: -20
      },
      showInLegend: false,
      boostThreshold: 1,
      // turboThreshold: 1,
      marker: {
        enabled: true,
        radius: 1,
        states: {
          hover: {
            enabled: false,
          },
        },
      },
    },
    {
      // plotGroup: function (prop, name, visibility, zIndex, parent) {
      //   let group = H.seriesTypes.scatter.prototype.plotGroup.call(
      //     this,
      //     prop,
      //     name,
      //     visibility,
      //     zIndex,
      //     parent,
      //   );

      //   if (prop === "dataLabelsGroup") {
      //     group.attr({
      //       translateX: 0,
      //       translateY: 0,
      //     });
      //   }

      //   return group;
      // },

      // alignDataLabel(point, dataLabel, options, alignTo, isNew) {
      //   ScatterProto.alignDataLabel.call(
      //     this,
      //     point,
      //     dataLabel,
      //     options,
      //     alignTo,
      //     isNew,
      //   );

      //   let attr = {
      //     rotation: 0,
      //     anchor: "middle",
      //   };

      //   if (options.position) {
      //     // Position function call
      //     attr = options.position.call(this, point);
      //   } else if (options.autoRotation) {
      //     // autoRotation
      //     let rotation = 0;
      //     rotation = (point.xAngle / Math.PI) * 180;
      //     if (rotation > 90) {
      //       rotation -= 180;
      //     }
      //     attr.rotation = rotation;
      //   }

      //   dataLabel.text.attr({
      //     "text-anchor": attr.anchor,
      //   });
      //   dataLabel.attr(attr);
      // },

      getAreaPath: function (p) {
        // x, y, x1,
        const chart = this.chart,
          yAxis = this.yAxis,
          xAxis = this.xAxis,
          center = xAxis.pane.center,
          left = chart.plotLeft,
          top = chart.plotTop,
          innerR = this._toYPixels(p.y),
          r = p.yLength ? innerR + p.yLength : this._toYPixels(p.y1);

        const path = chart.renderer.symbols.arc(
          left + center[0],
          top + center[1],
          r,
          r,
          {
            start: xAxis.startAngleRad + xAxis.translate(p.x), //this._getXAngle(x1),
            end: xAxis.startAngleRad + xAxis.translate(p.x1),
            open: true,
            innerR: innerR,
          },
        );

        // M -> L
        path[2][0] = "L";

        // add Z
        path[3].push("Z");

        return path;

        // x,y,
        // return [
        // 	this.getYLinkPath(p.options.x, p.options.y, p.options.y1),
        // 	...this.getXLinkPath(p.options.y1, p.options.x, p.options.x1),
        // 	this.getYLinkPath(p.options.x1, p.options.y1, p.options.y),
        // 	...this.getXLinkPath(p.options.y, p.options.x2, p.options.x)
        // ]

        // return p.options.x1 === p.options.x ?
        // 	this.getYLinkPath(p.options.x, p.options.y, p.options.y1) :
        // 	this.getXLinkPath(p.options.y, p.options.x, p.options.x1)
      },

      // destroy: function () {
      //   let treePaths = this.treePaths,
      //     treeGroup = this.treeGroup;

      //   if (treePaths) {
      //     treePaths.forEach((p) => p.destroy());
      //     this.treePaths = undefined;
      //     treeGroup.destroy();

      //     this.treeGroup = undefined;
      //   }

      //   //   this.treeLegend = null
      //   H.seriesTypes.scatter.prototype.destroy.call(this);
      // },

      _getDataLabelX: function (p, dataLabels) {
        let align = dataLabels.align;

        let x = p.x;

        if (align === "center") {
          x += (p.x1 - p.x) / 2;
        } else if (align === "right") {
          x += p.x1;
        }

        return x;
      },

      _getDataLabelY: function (p, dataLabels) {
        let align = dataLabels.verticalAlign;
        let y = p.y1;
        if (align === "middle") {
          y = p.y + (p.y1 - p.y) / 2;
        } else if (align === "bottom") {
          y = p.y;
        }

        return y;
      },

      translate: function () {
        this.generatePoints();

        let series = this,
          points = series.points,
          xAxis = series.xAxis,
          yAxis = series.yAxis,
          chart = series.chart,
          center = xAxis.pane.center,
          xOffset = series.options.xOffset || 0,
          yOffset = series.options.yOffset || 0,
          dataLabels; //series.options.dataLabels;

        points.forEach((p) => {
          p.x = p.options.x - xOffset;
          p.x1 = p.options.x1 + xOffset;
          p.y = p.options.y - yOffset;
          p.y1 = p.options.y1 + yOffset;

          dataLabels = series.options.dataLabels;
          if (p.options.dataLabels) {
            dataLabels = {
              ...dataLabels,
              ...p.options.dataLabels,
            };
          }
          // if (p.options.dataLabels) {
          //   dataLabels = { ...p.options.dataLabels };
          // }

          const _x = this._getXAngle(
            this._getDataLabelX(p, dataLabels, xAxis.dataMin),
          );
          const xAngle = this._getXAngle(
            this._getDataLabelX(p, dataLabels, xAxis.min),
          );
          // +((dataLabels.ofsetX / 180) * Math.PI || 0); //+ (p.x1 - p.x) / 2);
          let pos = xAxis.postTranslate(
            xAngle,
            this._toYPixels(
              this._getDataLabelY(p, dataLabels) + (dataLabels.offsetY || 0),
            ) + dataLabels.y,
          );

          p.plotX = pos.x + (dataLabels.x || 0);
          p.plotY = pos.y;

          p.xAngle = xAngle;

          // p.options.dataLabels = {
          //   enabled: false,
          //   x: 0,
          //   y: 0,
          //   rotation: p.xAngle,
          // };
        });
      },

      getLinkerPaths: function (points) {
        let lastPoint = null;
        let paths = [];
        for (let i = 0; i < points.length; i++) {
          if (lastPoint) {
            let path = this.getPaths(points[i], lastPoint);
            paths.push(Array.isArray(path[0]) ? path.flat() : path);
          }
          lastPoint = points[i];
        }

        return paths;
      },

      drawPoints: function () {
        if (this.color !== this.chart.options.colors[this.colorIndex]) {
          this.color = this.chart.options.colors[this.colorIndex];
        }

        const points = this.points,
          xAxis = this.xAxis,
          yAxis = this.yAxis,
          chart = this.chart,
          renderer = chart.renderer,
          parentSeries = this.linkedParent,
          options = this.options,
          markerOptions =
            (parentSeries && parentSeries.options.marker) ||
            this.options.marker,
          strokeWidth = markerOptions.borderWidth || 1,
          opacity = markerOptions.fillOpacity || 1;

        let treePaths = this.treePaths,
          treeGroup = this.tracker;

        if (!treeGroup) {
          this.tracker = treeGroup = renderer.g("tree").add();
          this.treePaths = treePaths = [];
        } else {
          this.treePaths.forEach((p) => {
            p.destroy();
          });
          this.treePaths = treePaths = [];
        }

        points.forEach((p) => {
          let path = this.getAreaPath(p);

          treePaths.push(
            renderer
              .path(path)
              .attr({
                fill: p.options.color || this.color,
                opacity: 0.5,
                stroke: options.borderColor,
                "stroke-width": options.borderWidth,
              })
              .add(treeGroup),
          );

          if (!p.options.dataLabels || p.options.dataLabels.enabled !== false) {
            let attr = {
              rotation: 0,
              anchor: "middle",
            };
            if (this.options.dataLabels) {
              if (this.options.dataLabels.position) {
                // Position function call
                attr = this.options.dataLabels.position.call(this, p);
              } else if (this.options.dataLabels.autoRotation) {
                // autoRotation
                let rotation = 0;
                rotation = (p.xAngle / Math.PI) * 180;
                if (rotation > 90) {
                  rotation -= 180;
                }
                attr.rotation = rotation;
              }
            }

            const dataLabel = renderer
              .text(p.name)
              .attr({
                class: "highcharts-label highcharts-data-label",
                x: p.plotX,
                y: p.plotY,
                rotation: attr.rotation,
              })
              .css({
                ...this.options.dataLabels.style,
                "text-anchor": attr.anchor,
                "dominant-baseline": "central",
              })
              .add(treeGroup);

            dataLabel.element.point = p;

            p.arclabel = dataLabel;

            treePaths.push(dataLabel);
          }

          if (p.options.linker) {
            let linkerPath = this.getLinkerPaths(p.options.linker);
            treePaths.push(
              renderer
                .path(linkerPath)
                .attr({
                  fill: "none", //p.color || this.color,
                  // opacity: 0.5,
                  stroke: p.options.color || this.color,
                  "stroke-width": options.borderWidth,
                })
                .add(treeGroup),
            );
          }
        });

        // if (this.options.colorMainSeries && this.linkedParent) {
        //   console.log(this);

        //   let pointNames = this.data.map((d) => d.name);

        //   this.linkedParent.data.forEach((p) => {
        //     if (pointNames.includes(p.name)) {
        //       console.log(p);
        //     }
        //   });
        // }
      },
    },
  );
};
