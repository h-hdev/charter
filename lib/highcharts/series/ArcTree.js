export default (H) => {
  H.seriesType(
    "arctree",
    "scatter",
    {
      keys: ["x", "y", "x1", "y1", "color"],
      animation: false,
      enableMouseTracking: false,
      states: {
        inactive: false,
      },
      // showInLegend: false,
      boostThreshold: 1,
      // color: "#000",
      // turboThreshold: 1,
      marker: {
        enabled: true,
        radius: 0,
        states: {
          hover: {
            enabled: false,
          },
        },
      },
    },
    {
      _toYPixels: function (y) {
        let yAxis = this.yAxis;
        return y === yAxis.min ? 0 : yAxis.translate(y);
      },

      _getXAngle: function (x) {
        // return this.xAxis.angleRad +

        return this.xAxis.translate(x);
      },

      getYLinkPath: function (x, y1, y2) {
        const xAxis = this.xAxis;

        const xAngle = this._getXAngle(x);

        const pos1 = xAxis.postTranslate(xAngle, this._toYPixels(y1));
        const pos2 = xAxis.postTranslate(xAngle, this._toYPixels(y2));

        return ["M", pos1.x, pos1.y, "L", pos2.x, pos2.y];
      },

      getXLinkPath: function (y, x1, x2) {
        const chart = this.chart,
          yAxis = this.yAxis,
          xAxis = this.xAxis,
          center = xAxis.pane.center,
          left = chart.plotLeft,
          top = chart.plotTop,
          r = this._toYPixels(y);

        // let start = xAxis.postTranslate(this._getXAngle(x1), r);
        // let end = xAxis.postTranslate(this._getXAngle(x2), r);

        // console.log(this._getXAngle(x2) -this._getXAngle(x1));

        // let flag = x2 < x1;
        // // if(flag > 2 * Math.PI) {
        // // 	flag = true;
        // // } else {
        // // 	flag =false;
        // // }

        // return [
        // 	'M',
        // 	start.x,
        // 	start.y,
        // 	'A',
        // 	r,
        // 	r,
        // 	0,
        // 	flag ? 1: 0,
        // 	flag ? 0: 1,
        // 	end.x, end.y
        // ]

        if (x1 > x2) {
          let tmp = x1;
          x1 = x2;
          x2 = tmp;
        }

        const path = chart.renderer.symbols.arc(
          left + center[0],
          top + center[1],
          r,
          r,
          {
            start: xAxis.startAngleRad + xAxis.translate(x1), //this._getXAngle(x1),
            end: xAxis.startAngleRad + xAxis.translate(x2),
            open: true,
            innerR: 0,
          },
        );

        return path;
      },

      getPaths: function (p1, p2) {
        return p1[0] === p2[0]
          ? this.getYLinkPath(p1[0], p1[1], p2[1])
          : this.getXLinkPath(p1[1], p1[0], p2[0]);
      },

      getTreePath: function (p) {
        return p.options.x1 === p.options.x
          ? this.getYLinkPath(p.options.x, p.options.y, p.options.y1)
          : this.getXLinkPath(p.options.y, p.options.x, p.options.x1);
      },

      destroy: function () {
        let treePaths = this.treePaths,
          treeGroup = this.treeGroup;

        if (treePaths) {
          treePaths.forEach((p) => p.destroy());
          this.treePaths = undefined;
          treeGroup && treeGroup.destroy();

          this.treeGroup = undefined;
        }

        //   this.treeLegend = null
        H.seriesTypes.scatter.prototype.destroy.call(this);
      },

      drawPoints: function () {
        const points = this.points,
          xAxis = this.xAxis,
          yAxis = this.yAxis,
          chart = this.chart,
          renderer = chart.renderer,
          parentSeries = this.linkedParent,
          markerOptions =
            (parentSeries && parentSeries.options.marker) ||
            this.options.marker,
          strokeWidth = markerOptions.borderWidth || 1,
          opacity = markerOptions.fillOpacity || 1;

        let treePaths = this.treePaths,
          treeGroup = this.tracker;

        // renderer
        //   .circle(
        //     chart.plotLeft + yAxis.pane.center[0],
        //     chart.plotTop + yAxis.pane.center[1],
        //     2,
        //   )
        //   .attr({
        //     fill: "red",
        //   })
        //   .add();

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
          treePaths.push(
            renderer
              .path(this.getTreePath(p))
              .attr({
                stroke:
                  p.color || (parentSeries && parentSeries.color) || this.color,
                "stroke-width": strokeWidth,
                opacity: opacity,
              })
              .add(treeGroup),
          );
        });
      },
    },
  );
};
