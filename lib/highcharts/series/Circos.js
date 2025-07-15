import SVGHelper from "@/utils/svg";

export default (H) => {
  const deg2rad = H.deg2rad;
  const relativeLength = H.relativeLength;

  const SankeyProto = H.seriesTypes.sankey.prototype;
  const DependencyWheelProto = H.seriesTypes.dependencywheel.prototype;

  H.seriesType(
    "circos",
    "dependencywheel",
    {
      // size: "50%",
      borderRadius: 0,
      borderWidth: 1,
      borderColor: "#000",
      dataLabels: {
        style: {
          color: "#333",
          textOutline: "none",
        },
      },

      keys: ["from", "to", "weight"],
    },
    {
      // add 1: update dataLabel text-anchor base on point.angle
      alignDataLabel(point, dataLabel, options, alignTo, isNew) {
        DependencyWheelProto.alignDataLabel.call(
          this,
          point,
          dataLabel,
          options,
          alignTo,
          isNew,
        );

        dataLabel.text.attr({
          "text-anchor":
            point.angle > Math.PI / 2 && point.angle < Math.PI * 1.5
              ? "end"
              : "start",
        });
      },

      /**
       *
       * @returns
       */
      getCenter() {
        let center = DependencyWheelProto.getCenter.call(this);

        // 获取 Node 名字列表（注：执行 getCenter 时， this.nodes 对象还未生成，固需要自行计算）
        // 注意：如果用户的数据配置不是 [from, to, weight] 数组形式，而是 {from: '', to: '', weight: } 对象形式，则取值需调整
        let nodesNames = {};
        this.userOptions.data.forEach((d) => {
          if (!nodesNames[d[0]]) {
            nodesNames[d[0]] = true;
          }
          if (!nodesNames[d[1]]) {
            nodesNames[d[1]] = true;
          }
        });

        const options = this.options;
        const nodeWidth = options.nodeWidth === "auto" ? 20 : options.nodeWidth;
        // 计算文字标签的最大宽度。
        // TODO: fontSize、fontFamily 需从配置中获取，同时需要支持 fontWeight、fontStyle
        const maxDataLabelLength =
          Math.ceil(
            Math.max(
              ...SVGHelper.getTextWidth(Object.keys(nodesNames), {
                fontSize: options.dataLabels.style.fontSize,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
              }),
            ),
          ) + 20; // 20 为标签两个间距

        // subNodeOffset 为主环与副环间距
        // 默认是 2 道副环，加上间隔，就是 4 倍的副环宽度
        // TODO: 由于第 2 道副环可以配置是否展示，所以这里的 *4 需根据实际情况调整
        const subNodeSize = options.subNodeOffset + nodeWidth * 4;
        center[2] -= (maxDataLabelLength + subNodeSize) * 2; // center[2] 为 pane 外环直径
        return center;
      },

      renderSubNodes(offset) {
        const series = this,
          options = series.options,
          renderer = series.chart.renderer,
          startAngle = (options.startAngle - 90) * deg2rad,
          factor =
            (2 * Math.PI) / (series.chart.plotHeight + series.getNodePadding());

        this.points.forEach((p) => {
          const from = p.fromNode;
          const shapeArgs = p.shapeArgs;
          if (!shapeArgs) return;

          const fromArgs = {
              start: startAngle + p.linkBase[0] * factor,
              end: startAngle + p.linkBase[1] * factor,
            },
            toArgs = {
              start: startAngle + p.linkBase[2] * factor,
              end: startAngle + p.linkBase[3] * factor,
            };

          let fromSubNode = renderer
            .arc({})
            .attr({
              ...from.shapeArgs,
              r: from.shapeArgs.r + offset,
              innerR: from.shapeArgs.innerR + offset, // + options.borderWidth * 2,
              ...fromArgs,
              fill: p.toNode.color,
            })
            .add(series.group);

          const to = p.toNode;

          let toSubNode = renderer
            .arc({})
            .attr({
              ...to.shapeArgs,
              r: to.shapeArgs.r + offset,
              innerR: to.shapeArgs.innerR + offset, // + options.borderWidth * 2,
              ...toArgs,
              fill: p.fromNode.color,
            })
            .add(series.group);
        });
      },

      /**
       * @param {*} points
       */
      drawPoints(points) {
        const options = this.options,
          nodeWidth = options.nodeWidth === "auto" ? 20 : options.nodeWidth,
          nodeOffset = nodeWidth,
          center = this.getCenter(),
          centerX = center[0],
          centerY = center[1],
          dlOffset = (options.subNodeOffset + nodeWidth * 5) * 2;

        let shapeArgs = undefined;

        this.nodes.forEach((node) => {
          shapeArgs = node.shapeArgs;

          // 1. add Node offset
          shapeArgs.r = shapeArgs.r + nodeOffset;
          shapeArgs.innerR = shapeArgs.innerR + nodeOffset;

          // 2. add rotation to DataLabel
          let rotation = (node.angle / Math.PI) * 180;
          if (rotation > 90) {
            rotation -= 180;
          }
          node.dlOptions.rotation = rotation;

          // 3. add DataLabel Offset
          node.dlBox = {
            x:
              centerX +
              (Math.cos((shapeArgs.start + shapeArgs.end) / 2) *
                (shapeArgs.r + shapeArgs.innerR + dlOffset)) /
                2,
            y:
              centerY +
              (Math.sin((shapeArgs.start + shapeArgs.end) / 2) *
                (shapeArgs.r + shapeArgs.innerR + dlOffset)) /
                2,
            width: 1,
            height: 1,
          };
        });

        DependencyWheelProto.drawPoints.call(this, points);

        this.renderSubNodes(-nodeWidth - 0.5);

        this.renderSubNodes(options.subNodeOffset);
        this.renderSubNodes(options.subNodeOffset + nodeWidth * 2);
      },
    },
  );
};
