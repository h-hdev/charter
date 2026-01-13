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
        allowOverlap: true,
        style: {
          color: "#333",
          textOutline: "none",
        },
      },
      states: {
        inactive: {
          enabled: false,
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
      //add 1: update dataLabel text-anchor base on point.angle
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
        dataLabel.attr({
          opacity: this.options.dataLabels.enabled === false ? 0 : 1,
        });
        // console.log(dataLabel);
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

      renderSubNode(offset, level, subNodeCount, nodeWidth) {
        const series = this,
          options = series.options,
          renderer = series.chart.renderer,
          startAngle = (options.startAngle - 90) * deg2rad,
          factor =
            (2 * Math.PI) / (series.chart.plotHeight + series.getNodePadding()),
          isLast = level == subNodeCount;

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

        if (isLast && options.tick.enabled !== false) {
          this.nodes.forEach((node) => {
            this.renderTicks(node, offset, nodeWidth);
          });
        }
      },

      _calcTicks(rad, value) {
        let tickAmout = Math.ceil(((rad / Math.PI) * 180) / 5);
        if (tickAmout > 10) {
          tickAmout = 10;
        }

        // function customRound(number) {
        //   // 取绝对值并计算数量级
        //   const absNumber = Math.abs(number);
        //   const magnitude = Math.pow(10, Math.floor(Math.log10(absNumber)) - 1);

        //   // 计算基数
        //   const base =
        //     absNumber < 5 * magnitude * 10 ? 5 * magnitude : 10 * magnitude;

        //   // 计算取整结果
        //   const rounded = Math.floor(absNumber / base) * base;

        //   // 处理负数情况
        //   return number < 0 ? -rounded : rounded;
        // }
        //
        function customRound(number) {
          // 取绝对值并计算数量级
          const absNumber = Math.abs(number);
          const magnitude = Math.pow(10, Math.floor(Math.log10(absNumber)));

          // 计算基数
          const base =
            absNumber < 5 * magnitude * 10 ? 5 * magnitude : 10 * magnitude;

          // 计算取整结果
          const rounded = Math.ceil(absNumber / base) * base;

          // 处理负数情况
          return number < 0 ? -rounded : rounded;
        }

        let _tickInterval = customRound(value / tickAmout);

        // console.log(value, _tickInterval);

        // return [
        //   [0, 0],
        //   [value, rad],
        // ];

        let ticks = [];

        let tick = 0,
          tickInterval = _tickInterval,
          radStep = (rad / value) * tickInterval;

        while (tick <= value) {
          ticks.push([tick, (radStep * tick) / tickInterval]);
          tick += tickInterval;
        }

        if (ticks.length && ticks[ticks.length - 1][0] < value) {
          if (
            ticks.length > 1 &&
            value - ticks[ticks.length - 1][0] < tickInterval
          ) {
            ticks[ticks.length - 1] = [value, rad];
          } else {
            ticks.push([value, rad]);
          }
        }

        return [ticks, tickInterval];
      },

      _renderTick(
        text,
        tickOptions,
        rad,
        r,
        centerX,
        centerY,
        tickLength,
        options,
        group,
        ticks,
      ) {
        let pos = {
          x: centerX + (Math.cos(rad) * r) / 2,
          y: centerY + (Math.sin(rad) * r) / 2,
        };

        let startPos = {
          x: centerX + (Math.cos(rad) * (r - tickLength)) / 2,
          y: centerY + (Math.sin(rad) * (r - tickLength)) / 2,
        };

        let rotation = (rad / Math.PI) * 180;
        let textAnchor = "start";
        let dominantBaseLine = "central";
        if (rotation > 90) {
          rotation -= 180;
        }

        if (tickOptions.isFirst) {
          dominantBaseLine = "ideographic";
        } else if (tickOptions.isLast) {
          dominantBaseLine = "hanging";
        }

        if (rad > Math.PI / 2 && rad < Math.PI * 1.5) {
          textAnchor = "end";
        } else if (dominantBaseLine !== "central") {
          dominantBaseLine =
            dominantBaseLine === "hanging" ? "ideographic" : "hanging";
        }

        let tick;
        if (ticks.length > tickOptions.index) {
          tick = ticks[tickOptions.index];
        } else {
          tick = {};
        }

        let label, line;
        if (text) {
          let style = {
            ...options.style,
          };

          if (tick.label) {
            tick.label
              .attr({
                text,
                x: pos.x,
                y: pos.y,
                rotation,
                "text-anchor": textAnchor,
                "dominant-baseline": dominantBaseLine,
              })
              .css(style);
          } else {
            label = this.chart.renderer
              .text(text, pos.x, pos.y)
              .attr({
                rotation,
                "text-anchor": textAnchor,
                "dominant-baseline": dominantBaseLine,
              })
              .css(style)
              .add(group);
          }
        } else if (tick.label) {
          tick.label.destroy();
        }

        if (tick.line) {
          tick.line.attr({
            d: ["M", startPos.x, startPos.y, "L", pos.x, pos.y],
            stroke: options.tickColor,
            "stroke-width": options.tickWidth,
          });
        } else {
          line = this.chart.renderer
            .path(["M", startPos.x, startPos.y, "L", pos.x, pos.y])
            .attr({
              stroke: options.tickColor,
              "stroke-width": options.tickWidth,
            })
            .add(this.group);
        }

        if (!tick.line) {
          tick = {
            line,
            label,
          };
          ticks.push(tick);
        }
      },

      removeTick(tick) {
        if (!tick) return;
        if (tick.label) {
          tick.label.destroy();
        }
        if (tick.line) {
          tick.line.destroy();
        }
        return null;
      },

      renderTicks(point, offset, nodeWidth, subNodeLevesLength) {
        if (!point) return;

        let shapeArgs = point.shapeArgs,
          start = point.shapeArgs.start,
          end = point.shapeArgs.end,
          total = end - start,
          center = this.getCenter(),
          centerX = center[0],
          centerY = center[1],
          rad = (total / Math.PI) * 180,
          tickCount =
            subNodeLevesLength === 1
              ? 0
              : rad > 30
                ? 10
                : rad > 20
                  ? 5
                  : rad > 10
                    ? 2
                    : 1,
          step = total / tickCount,
          options = this.options.tick,
          showLabels = true,
          tickLength = 40; //options.tickLength * 2;

        if (rad < 2) {
          showLabels = 0;
        }

        offset += nodeWidth;

        let ticks = point.ticks;
        if (!ticks) {
          ticks = point.ticks = [];
        }

        if (tickCount > 0) {
          if (tickLength > 20) {
            tickLength = 20;
          } else if (tickLength < 0) {
            tickLength = 0;
          }

          for (let i = 0; i <= tickCount; i++) {
            this._renderTick(
              showLabels ? 100 * (i / tickCount).toFixed(2) + "%" : "",
              {
                isFirst: i === 0,
                isLast: i === tickCount,
                index: i,
              },
              start + step * i,
              shapeArgs.r + shapeArgs.innerR + offset * 2,
              centerX,
              centerY,
              tickLength,
              options,
              this.group,
              ticks,
            );
          }
        }

        let mainTicks = [],
          tickInterval;
        if (showLabels) {
          [mainTicks, tickInterval] = this._calcTicks(total, point.sum);

          mainTicks.forEach((tick, i) => {
            this._renderTick(
              tick[0].toFixed(tickInterval > 100 ? 0 : 2), //.replace(".00", ""),
              {
                isFirst: i === 0,
                isLast: i === mainTicks.length - 1,
                index: tickCount ? tickCount + i + 1 : i,
              },
              start + tick[1],
              shapeArgs.r + shapeArgs.innerR + nodeWidth + tickLength,
              centerX,
              centerY,
              tickLength,
              options,
              this.group,
              ticks,
            );
          });
        }

        let minus = point.ticks.length - mainTicks.length - tickCount;
        if (minus > 1) {
          while (minus) {
            this.removeTick(point.ticks[point.ticks.length - 1]);
            point.ticks.length--;
            minus--;
          }
        }
      },

      getSubNodeCount() {
        let count = 0;
        if (this.options.subNode.enabled !== false) {
          count = this.options.subNode.count;
          if (count < 0) {
            count = 0;
          } else if (count > 2) {
            count = 2;
          }
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
          dlOffset = this.getSubNodeSize(nodeWidth, subNodeCount) * 2 + 20;

        let shapeArgs = undefined;

        options.tick = H.merge(
          {
            enabled: true,
            style: {
              fontSize: "8px",
              color: "#555",
            },
            tickLength: 5,
            tickWidth: 1,
            tickColor: "#555",
          },
          this.userOptions.tick,
        );

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

        this.renderSubNodes(nodeWidth, subNodeCount, options);
      },

      renderSubNodes(nodeWidth, subNodeCount, options) {
        let subNodeLeves = [-nodeWidth - 0.5];

        if (subNodeCount) {
          subNodeLeves.push(options.subNode.offset);
          if (subNodeCount > 1) {
            subNodeLeves.push(options.subNode.offset + nodeWidth * 2);
          }
        }

        this.points.forEach((p) => {
          subNodeLeves.forEach((offset, i) => {
            this._renderSubNode(p, offset, i, subNodeCount, nodeWidth);
          });
        });
        this.clearSubNodes(subNodeLeves.length);

        if (this.options.tick.enabled === false) {
          this.nodes.forEach((node) => {
            if (node.ticks) {
              node.ticks.forEach((tick) => {
                tick.line.destroy();
                if (tick.label) {
                  tick.label.destroy();
                }
              });
              node.ticks = null;
            }
          });
        } else {
          this.nodes.forEach((node) => {
            this.renderTicks(
              node,
              subNodeLeves[subNodeLeves.length - 1],
              nodeWidth,
              subNodeLeves.length,
            );
          });
        }
      },

      _renderSubNode(point, offset, level, subNodeCount, nodeWidth) {
        const from = point.fromNode;
        const shapeArgs = point.shapeArgs;

        if (!shapeArgs) return;

        const series = this,
          options = series.options,
          renderer = series.chart.renderer,
          startAngle = (options.startAngle - 90) * deg2rad,
          factor =
            (2 * Math.PI) / (series.chart.plotHeight + series.getNodePadding()),
          isLast = level == subNodeCount;

        let linkBaseIndex = -1;

        ["from", "to"].forEach((nodeType, i) => {
          let node = point[nodeType + "Node"];
          let linkedNode = point[(i === 0 ? "to" : "from") + "Node"];

          let args = {
            ...node.shapeArgs,
            r: node.shapeArgs.r + offset,
            innerR: node.shapeArgs.innerR + offset,
            start: startAngle + point.linkBase[++linkBaseIndex] * factor,
            end: startAngle + point.linkBase[++linkBaseIndex] * factor,
            fill: linkedNode.color,
          };

          let subNode = point[nodeType + "SubNodes"];
          if (!subNode) {
            subNode = point[nodeType + "SubNodes"] = [];
          }
          if (subNode.length > level) {
            subNode[level].attr(args);
          } else {
            subNode.push(renderer.arc({}).attr(args).add(series.group));
          }
        });
      },

      clearSubNodes(subNodeCount) {
        this.points.forEach((p) => {
          ["from", "to"].forEach((subNodeType) => {
            let subNode = p[subNodeType + "SubNodes"];
            if (subNode && subNode.length > subNodeCount) {
              let diff = subNode.length - subNodeCount;
              for (let i = 0; i < diff; i++) {
                subNode[subNode.length - 1].destroy();
                subNode.length--;
              }
              // subNode.length = subNodeCount;
            }
          });
        });

        let dlEnabled = this.options.dataLabels.enabled === false;
        if (dlEnabled) {
          this.nodes.forEach((node) => {
            if (node.dataLabel) {
              node.dataLabel = node.dataLabel.destroy();
              node.dataLabels = [];
            }
            // node.dataLabel.attr({
            //   opacity: 0,
            // });
          });
        }
      },
    },
  );
};
