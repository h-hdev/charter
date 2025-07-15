/**
 * 系统发育树
 * ref:
 * * https://www.jasondavies.com/tree-of-life/
 * * https://observablehq.com/@d3/tree-of-life
 *
 */

import { IChartOptions } from "@/Charter";
import { Highcharter } from "./Highcharter";
import { TreeLayout } from "@/TreeLayout";
import SVGHelper from "@/utils/svg";

export type NodeInput = [string | undefined, string, number];

export interface Node {
  name: string;
  value: number;
  children?: Node[];
  [key: string]: any;
}

export interface NodeWithPosition extends Node {
  x: number;
  y: number;
  width: number;
}

type Point = {
  x: number;
  y: number;
  name: string;
  z: number;
  isLeaf?: boolean;
  color?: string;
};

type Leaf = {
  x: number;
  y: number;
  name: string;
  linkedTo: number;
};

type LeafNameMap = Record<string, Leaf>;

// Link Data: [x, y, x1, y1]
type Link = [number, number, number, number, string?];
export default class GenusTree extends Highcharter {
  afterRender() {
    // const chart = this.chart;
    // if (!chart) return;
    // (chart as any).pane.forEach((pane) => {
    //   const center = pane.center;
    //   chart.renderer
    //     .circle(
    //       center[0] + chart.plotLeft,
    //       center[1] + chart.plotTop,
    //       center[2] / 2,
    //     )
    //     .attr({
    //       fill: center[3] === 0 ? "rgba(255, 0, 0, 0.5)" : "none",
    //       stroke: "#000",
    //     })
    //     .add();
    //   if (center[3]) {
    //     chart.renderer
    //       .circle(
    //         center[0] + chart.plotLeft,
    //         center[1] + chart.plotTop,
    //         center[3] / 2,
    //       )
    //       .attr({
    //         fill: "none",
    //         stroke: "#000",
    //       })
    //       .add();
    //   }
    // });
  }
  static parseNodes(nodes: any) {
    let _treeLayout: TreeLayout = new TreeLayout({
      nodeSpacing: 0.5,
      levelSpacing: 1,
      nodeSize: 0.5,
    });

    const nodeGroups = nodes;

    let series: {}[] = [];

    let categories: string[] = [];

    let leafs: LeafNameMap = {};

    nodeGroups.forEach((nodeGroup: any) => {
      let points: Point[] = [];
      let links: Link[] = [];
      let point: Point | undefined;

      _treeLayout?.calculateLayout(
        nodeGroup,
        (node: any, layout: TreeLayout, parent: any) => {
          let xOffset = layout._x.min < 0 ? Math.abs(layout._x.min) : 0;

          if (node.y === 0) {
            point = {
              x: node.x + xOffset,
              y: node.y,
              name: node.name,
              z: node.value,
              isLeaf: node.children && node.children.length ? false : true,
            };
            points.push(point);
            return;
          }

          // if (node.y === 1) {
          // links.push([node.x + xOffset, -1, node.x + xOffset, -1]);
          // }

          if (node.children && node.children.length > 1) {
            // y Link
            links.push([
              node.children[0].x + xOffset,
              node.y + 1,
              node.children[node.children.length - 1].x + xOffset,
              node.y + 1,
            ]);
          }

          point = {
            x: node.x + xOffset,
            y: node.y,
            name: node.name,
            z: node.value,
            isLeaf: node.children && node.children.length ? false : true,
          };
          points.push(point);

          if (!point.isLeaf) {
            // x link
            links.push([
              node.x + xOffset,
              parent && node.y === parent.stats.y.max
                ? parent.stats.y.min
                : node.y,
              node.x + xOffset,
              node.y + 1,
            ]);
          } else {
            let leafName = point.name.replace(/\'/g, "");
            categories.push(leafName);

            leafs[leafName] = {
              ...point,
              name: point.name.replace(/\'/g, ""),
              y: point.y + 1,
              linkedTo:
                parent && node.y === parent.stats.y.max
                  ? parent.stats.y.min
                  : node.y,
            };
          }

          if (parent && parent.y === 0) {
            links.push([
              node.x + xOffset,
              layout._y.min,
              node.x + xOffset,
              node.y,
            ]);
          }
        },
        (node: any, layout: TreeLayout) => {
          if (node.isLeaf) {
            node.y = layout._y.max;
            // layout._calcExtremes(node.y, node.states._y);
          } else {
            if (node.y !== layout._y.min) {
              // let min = Infinity;
              let es = { ...TreeLayout.initalExtremes };
              node.children.forEach((child: any) => {
                layout._calcExtremes(child.y, es);
              });
              node.stats.y = es;
              node.y = node.stats.y.min - 1;
            }
          }
        },
      );

      // series.push({
      //   type: "scatter",
      //   data: points,
      //   pane: 0,
      //   // colorIndex: i,
      //   marker: {
      //     radius: 5,
      //     fillOpacity: 0.5,
      //     borderWidth: 1,
      //   },
      // });

      series.push({
        type: "arctree",
        data: links,
        color: "#000",
        pane: 0,
        showInLegend: false,
        // linkedTo: ":previous",
      });

      // series.push({
      //   type: "scatter",
      //   data: leafs,
      //   marker: {
      //     radius: 5,
      //   },
      //   pane: 0,
      //   dataLabels: {
      //     enabled: true,
      //     format: "{point.name}",
      //   },
      // });

      // series.push({
      //   type: "arcarea",
      //   dataLabels: {
      //     y: 0.5,
      //     style: {
      //       fontWeight: "normal",
      //     },
      //     position: function (p: any) {
      //       const series: any = this,
      //         xAxis = series.xAxis,
      //         x = p.x + 0.5,
      //         xAxisMid = xAxis.min + (xAxis.max - xAxis.min) / 2;
      //       let rotation =
      //           ((xAxis.startAngleRad + xAxis.translate(x)) / Math.PI) * 180,
      //         anchor = "start";

      //       if (x >= xAxisMid) {
      //         rotation -= 180;
      //         anchor = "end";
      //       }

      //       return {
      //         rotation,
      //         anchor,
      //       };
      //     },
      //     // verticalAlign: "middle",
      //   },
      //   data: leafs.map((l) => {
      //     return {
      //       x: l.x - 0.5,
      //       y: l.y,
      //       x1: l.x + 0.5,
      //       y1: l.y + 8,
      //       name: l.name,
      //       color: l.color,
      //     };
      //   }),
      // });
    });

    return {
      _layout: _treeLayout,
      leafs,
      series,
      yAxis: {
        min: 0,
        tickInterval: 1,
        max: _treeLayout._y.max + 1,
        endOnTick: false,
        gridLineWidth: 0,
        lineWidth: 0,
        labels: {
          enabled: false,
        },
      },
      xAxis: {
        min: 0,
        lineWidth: 0,
        labels: {
          enabled: false,
        },
        gridLineWidth: 0,
        categories,
      },
    };
  }

  static parseSelectedGenus(
    selectedGenus: Record<string, Record<string, number>>,
    categories: string[],
  ) {
    let columnSeries: Record<
      string,
      { name: string; data: number[]; type: string }
    > = {};
    categories.forEach((category) => {
      let s = selectedGenus[category];
      Object.keys(s).forEach((n) => {
        if (!columnSeries[n]) {
          columnSeries[n] = {
            name: n,
            data: [],
            type: "column",
          };
        }
        columnSeries[n].data.push(s[n]);
      });
    });
    return columnSeries;
  }

  static parseCategoryGroup(
    categoryGroup: Record<string, string[]>,
    leafs: LeafNameMap,
    size: number,
  ) {
    return Object.keys(categoryGroup).map((group) => {
      return {
        type: "arcarea",
        name: group,
        data: categoryGroup[group].map((category) => {
          let leaf = leafs[category];
          if (!leaf)
            throw new Error(
              `Category "${category}" do not exist in Newick Data`,
            );
          return {
            name: leaf.name,
            x: leaf.x - 0.5,
            y: leaf.y,
            x1: leaf.x + 0.5,
            yLength: size,
            linker: [leaf.y, leaf.linkedTo],
            // TODO
          };
        }),
      };
    });
  }

  static parseData(
    nodes: any,
    selectedGenus: Record<string, Record<string, number>>,
    categoryGroup: Record<string, string[]>,
  ) {
    let result = GenusTree.parseNodes(nodes);

    let paneSpace = 5;

    let pane: Record<
      string,
      {
        index: number;
        options: {
          innerSize: string | number;
          size: string | number;
          startAngle: number;
          endAngle: number;
          [key: string]: any;
        };
      }
    > = {
      main: {
        index: 0,
        options: {
          innerSize: 0,
          size: "65%",
          startAngle: paneSpace,
          endAngle: 360 - paneSpace,
        },
      },
      column: {
        index: 1,
        options: {
          innerSize: "65%",
          size: "100%",
          startAngle: paneSpace,
          endAngle: 360 - paneSpace,
        },
      },
    };

    const categories = result.xAxis.categories;

    //
    const categorieIndexMap: Record<string, number> = {};
    categories.forEach((c, i) => {
      categorieIndexMap[c] = i;
    });

    const acrAreaDataLabelPadding = 10;

    const maxDataLabelLength =
      Math.ceil(
        Math.max(
          ...SVGHelper.getTextWidth(categories, {
            fontSize: "0.7em",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
            bold: false,
          }),
        ),
      ) +
      acrAreaDataLabelPadding * 2; // textPandding

    pane.main.options.sizeOffset = -maxDataLabelLength;
    pane.column.options.innerSizeOffset = maxDataLabelLength;

    let column = GenusTree.parseSelectedGenus(selectedGenus, categories);

    let arcarea = GenusTree.parseCategoryGroup(
      categoryGroup,
      result.leafs,
      maxDataLabelLength,
    );

    return {
      pane: Object.keys(pane)
        .map((key) => {
          return pane[key];
        })
        .sort((a, b) => {
          return a.index - b.index;
        })
        .map((p) => p.options),

      xAxis: [
        {
          ...result.xAxis,
          pane: pane.main.index,
          min: 0,
          max: categories.length,
        },
        {
          min: 0,
          max: categories.length,
          pane: pane.column.index,
          lineWidth: 0,
          gridLineWidth: 0,
          labels: {
            enabled: false,
          },
        },
      ],
      yAxis: [
        {
          ...result.yAxis,
          pane: pane.main.index,
        },
        {
          pane: pane.column.index,
        },
      ],

      plotOptions: {
        arcarea: {
          borderWith: 0.5,
          borderColor: "#fff",
          dataLabels: {
            enabled: true,
            // offsetY: 0.5,
            y: acrAreaDataLabelPadding,
            style: {
              fontWeight: "normal",
            },
            position: function (p: any) {
              const series: any = this,
                xAxis = series.xAxis,
                x = p.x + 0.5,
                xAxisMid = xAxis.min + (xAxis.max - xAxis.min) / 2;
              let rotation =
                  ((xAxis.startAngleRad + xAxis.translate(x)) / Math.PI) * 180,
                anchor = "start";

              if (x >= xAxisMid) {
                rotation -= 180;
                anchor = "end";
              }

              return {
                rotation,
                anchor,
              };
            },
            // verticalAlign: "middle",
          },
        },
      },
      series: [
        ...arcarea.map((s: any) => {
          s.xAxis = 0;
          s.yAxis = 0;
          return s;
        }),
        ...result.series.map((s: any) => {
          s.xAxis = 0;
          s.yAxis = 0;
          return s;
        }),
        ...Object.keys(column).map((key: string) => {
          let s: any = column[key];
          s.xAxis = s.yAxis = 1;
          s.stacking = true;
          return s;
        }),
      ],
    };
  }

  static _createNodes(nodes: NodeInput[]) {
    let nodeGroups: Node[] = [];
    let nodeNameMap: Record<string, Node> = {};

    nodes.forEach((node) => {
      const _node: Node = {
        name: node[1],
        value: node[2],
        children: [],
      };

      nodeNameMap[_node.name] = _node;

      if (node[0] === undefined) {
        nodeGroups.push(_node);
      } else {
        nodeNameMap[node[0]]?.children?.push(_node);
      }
    });

    return nodeGroups;
  }

  _getOptions(): IChartOptions {
    this.defaultOptions = {
      chart: {
        polar: true,
      },
      pane: {
        innerSize: "0%",
        size: "50%",
      },
      xAxis: {
        tickInterval: 1,
        gridLineWidth: 0,
        labels: {
          enabled: false,
        },
        lineWidth: 0,
      },
      yAxis: {
        tickInterval: 1,
        // min: 0,
        // max: 5.5,
        // y: 6,
        labels: {
          enabled: false,
        },
        gridLineWidth: 0,
      },

      plotOptions: {
        series: {
          states: {
            inactive: {
              enabled: false,
            },
          },
        },
        bubble: {
          maxSize: 10,
          minSize: 3,
        },
      },
    };

    let options = super._getOptions();

    let genusChartOptions: Record<string, any> = GenusTree.parseData(
      this.userOptions.genus.data,
      this.userOptions.genus.selectedGenus,
      this.userOptions.genus.categoryGroup,
    );

    genusChartOptions.yAxis[1] = {
      ...genusChartOptions.yAxis[1],
      ...this.userOptions.yAxis,
    };
    delete this.userOptions.yAxis;

    if (this.userOptions.treeLegend) {
      genusChartOptions.legends = [
        {
          ...this.userOptions.treeLegend,
          target: {
            type: "arcarea",
          },
        },
      ];
    }

    return {
      ...options,
      ...genusChartOptions,
    };
  }
}
