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
      subNode: {
        enabled: true,
        offset: 100,
        tick: {
          enabled: true,
        },
        count: 2,
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
          opacity: this.options.dataLabels.enabled === false ? 0 : 1,
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
          this.options.dataLabels.enabled === false
            ? 0
            : Math.ceil(
                Math.max(
                  ...SVGHelper.getTextWidth(
                    Object.keys(nodesNames),
                    {
                      fontSize: options.dataLabels.style.fontSize,
                      fontFamily: options.dataLabels.style.fontFamily,
                      fontWeight: options.dataLabels.style.fontWeight,
                    },
                    undefined,
                    this.chart.renderer.box,
                  ),
                ),
              ) + 20; // 20 为标签两侧间距

        const subNodeSize = this.getSubNodeSize(nodeWidth);
        center[2] -= (maxDataLabelLength + subNodeSize) * 2; // center[2] 为 pane 外环直径
        return center;
      },

      renderSubNodes(offset, level) {
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

          let fromSubNodeAttr = {
            ...from.shapeArgs,
            r: from.shapeArgs.r + offset,
            innerR: from.shapeArgs.innerR + offset, // + options.borderWidth * 2,
            ...fromArgs,
            fill: p.toNode.color,
          };

          if (!p.fromSubNodes) {
            p.fromSubNodes = [];
          }

          if (p.fromSubNodes.length > level) {
            p.fromSubNodes[level].attr(fromSubNodeAttr);
          } else {
            p.fromSubNodes.push(
              renderer.arc({}).attr(fromSubNodeAttr).add(series.group),
            );
          }

          const to = p.toNode;

          let toSubNodeAttr = {
            ...to.shapeArgs,
            r: to.shapeArgs.r + offset,
            innerR: to.shapeArgs.innerR + offset, // + options.borderWidth * 2,
            ...toArgs,
            fill: p.fromNode.color,
          };

          if (!p.toSubNodes) {
            p.toSubNodes = [];
          }

          if (p.toSubNodes.length > level) {
            p.toSubNodes[level].attr(toSubNodeAttr);
          } else {
            p.toSubNodes.push(
              renderer.arc({}).attr(toSubNodeAttr).add(series.group),
            );
          }
        });
      },

      getSubNodeCount() {
        let count = 0;
        if (this.options.subNode.enabled !== false) {
          count = this.options.subNode.count;
        }
        return count;
      },

      getSubNodeSize(nodeWidth, subNodeCount) {
        const options = this.options;
        if (nodeWidth === undefined) {
          nodeWidth = options.nodeWidth === "auto" ? 20 : options.nodeWidth;
        }
        if (subNodeCount === undefined) {
          subNodeCount = this.getSubNodeCount();
        }

        if (!subNodeCount) {
          return nodeWidth * 2;
        }

        const subNodeOptions = options.subNode;

        return (
          subNodeOptions.offset +
          nodeWidth * subNodeCount * 2 +
          (this.options.subNode.tick ? 2 : 0)
        );
      },

      translate() {
        // if (this.options.dataLabels.enabled === false) {
        //   this.options.dataLabels.nodeFormatter = function () {
        //     return null;
        //   };
        // }
        DependencyWheelProto.translate.call(this);
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
          subNodeCount = this.getSubNodeCount(),
          dlOffset = this.getSubNodeSize(nodeWidth, subNodeCount) * 2;

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

        this.renderSubNodes(-nodeWidth - 0.5, 0);

        if (!subNodeCount) {
          return;
        }
        this.renderSubNodes(options.subNode.offset, 1);
        if (subNodeCount > 1) {
          this.renderSubNodes(options.subNode.offset + nodeWidth * 2, 2);
        }

        this.clearSubNodes();
      },
      clearSubNodes() {
        let subNodeCount = this.getSubNodeCount() + 1;
        this.points.forEach((p) => {
          if (p.fromSubNodes && p.fromSubNodes.length > subNodeCount) {
            let diff = p.fromSubNodes.length - subNodeCount;
            for (let i = 0; i < diff; i++) {
              p.fromSubNodes[p.fromSubNodes.length - i - 1].destroy();
            }
            p.fromSubNodes.length = subNodeCount;
          }

          if (p.toSubNodes && p.toSubNodes.length > subNodeCount) {
            let diff = p.toSubNodes.length - subNodeCount;
            for (let i = 0; i < diff; i++) {
              p.toSubNodes[p.toSubNodes.length - i - 1].destroy();
            }
            p.toSubNodes.length = subNodeCount;
          }
        });

        let dlEnabled = this.options.dataLabels.enabled === false;
        if (dlEnabled) {
          this.nodes.forEach((node) => {
            node.dataLabel.attr({
              opacity: 0,
            });
          });
        }
      },
    },
  );
};
