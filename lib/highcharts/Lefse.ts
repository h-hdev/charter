import { IChartOptions } from "@/Charter";
import { Highcharter } from "./Highcharter";
import * as Highcharts from "highcharts";

import {
  HighlightOption,
  HighlightTree,
  ILefseOption,
  NodeGroupOptions,
} from "@/types/lefse";

import { Node, NodeGroup } from "@/types/lefse";
import TreeLayout, { Tree } from "@/treelayout/TreeLayout";

export interface NodeWithPosition extends Node {
  x: number;
  y: number;
  width: number;
  isLeaf?: boolean;
  stats: {
    x: [number, number];
    y: [number, number];
    childCount: number;
  };
}

// type Point = {
//   x: number;
//   y: number;
//   name: string;
//   z: number;
//   isLeaf?: boolean;
//   color?: string;
// };

// Link Data: [x, y, x1, y1]
type Link = [number, number, number, number];

export default class Lefse extends Highcharter {
  static parseHightlight(
    highlight: HighlightOption,
    defaultColor: string,
  ): string | HighlightTree {
    if (typeof highlight === "object") {
      return {
        name: highlight.name,
        color: highlight.color,
        node: highlight.node
          ? (Lefse.parseHightlight(highlight.node, defaultColor) as string)
          : undefined,
      };
    }
    return typeof highlight === "string" ? highlight : defaultColor;
  }

  static translateOptions(lefse: ILefseOption): Record<string, any> {
    const { groups, highlight, groupPadding } = lefse;

    const _layout = new TreeLayout({
      nodeSpacing: 1,
      groupPadding: groupPadding,
    });

    let series: any[] = [];
    let arcAreaSeries: any = {
      type: "arcarea",
      data: [],
    };
    groups.forEach((group, i) => {
      let groupTree = _layout.addGroup(TreeLayout.ToNode(group.nodes));
      series.push({
        type: "bubble",
        name: group.name,
        colorIndex: i,
        data: [],
      });

      let links: Link[] = [];

      let xOffset = groupTree._x.min < 0 ? Math.abs(groupTree._x.min) : 0;

      if (i) {
        xOffset += i * _layout.options.groupPadding;
      }

      _layout._walk(groupTree, (tree: Tree) => {
        const point: Record<string, any> = {
          x: tree.x + xOffset,
          y: tree.y + 1,
          z: tree.value,
          name: tree.name,
        };

        if (!tree.isLeaf) {
          let children: Tree[] = tree.children as Tree[];
          links.push([
            children[0].x + xOffset,
            point.y + 1,
            children[children.length - 1].x + xOffset,
            point.y + 1,
          ]);

          links.push([point.x, point.y, point.x, point.y + 1]);
        }

        if (highlight[point.name]) {
          let highlightResult = Lefse.parseHightlight(
            highlight[point.name],
            highlight["__DEFAULT-COLOR__"],
          );

          if (typeof highlightResult === "string") {
            point.color = highlightResult;
          } else {
            if (highlightResult.node) {
              point.color = highlightResult.node as string;
            }

            arcAreaSeries.data.push({
              x: tree._x.min + xOffset,
              x1: tree._x.max + xOffset,
              y: tree._y.min + 1,
              y1: tree._y.max + 1,
              name: highlightResult.name,
              color: highlightResult.color,
            });
          }
        }

        series[series.length - 1].data.push(point);
      });

      series.push({
        type: "arctree",
        data: links,
        showInLegend: false,
        linkedTo: ":previous",
      });
    });

    arcAreaSeries.colorIndex = groups.length;
    series.unshift(arcAreaSeries);

    // series.unshift()
    // let maxX = _layout.toData((tree: Tree, params: OnTreeParams) => {
    //   if (params.isGroupRoot) {
    //     series.push({
    //       type: "bubble",
    //       name: groups[params.childIndex as number].name,
    //       data: [],
    //     });
    //   }

    //   // nodes.push({
    //   //   x: tree.x + xOffset,
    //   //   y: tree.y,
    //   //   name: tree.name,
    //   //   isLeaf: tree.isLeaf,
    //   //   width: tree.width,
    //   // });
    //   series[series.length - 1].data.push({
    //     x: tree.x + params.xOffset,
    //     y: tree.y + 1,
    //     z: tree.value,
    //     name: tree.name,
    //   });
    // });

    // console.log(maxX);

    // toData(onTree: OnTree) {
    //   let xOffset = 0;

    //   this.walkTree((tree: Tree, parent?: Tree, childIndex?: number) => {
    //     if (tree.name === TreeLayout.ROOTNAME) {
    //       // root extrems
    //       tree.children?.forEach((child) => {
    //         tree._x = this._mergeExtremes(tree._x, child._x);
    //         tree._y = this._mergeExtremes(tree._y, child._y);
    //       });

    //       xOffset = Math.abs(tree._x.min);

    //       console.log(xOffset, tree._x);

    //       return;
    //     } else if (parent && parent.name === TreeLayout.ROOTNAME) {
    //       if (childIndex) {
    //         xOffset += this.options.groupPadding;
    //       }
    //     }

    //     // nodes.push({
    //     //   x: tree.x + xOffset,
    //     //   y: tree.y,
    //     //   name: tree.name,
    //     //   isLeaf: tree.isLeaf,
    //     //   width: tree.width,
    //     // });
    //   });

    //   return {
    //     nodes,
    //     links,
    //   };
    // }

    // _layout.toData()

    // let _treeLayout: TreeLayout = new TreeLayout({
    //   nodeSpacing: 1,
    //   levelSpacing: 1,
    //   nodeSize: 1,
    // });

    // // 生成树形节点数据
    // const nodeGroups: NodeGroup[] = Lefse._createNodes(groups);

    // let series: {}[] = [];
    // const groupSpacing = groupPadding || 5;

    // nodeGroups.forEach((nodeGroup, i) => {
    //   let points: Point[] = [];
    //   let links: Link[] = [];
    //   let point: Point | undefined;

    //   // 计算布局
    //   _treeLayout?.calculateLayout(
    //     nodeGroup.root,
    //     (node: any, layout: TreeLayout) => {
    //       //
    //       let xOffset =
    //         (layout._x.min < 0 ? Math.abs(layout._x.min) : 0) +
    //         i * groupSpacing;

    //       if (node.children && node.children.length > 1) {
    //         // y Link
    //         links.push([
    //           node.children[0].x + xOffset,
    //           node.y + 1,
    //           node.children[node.children.length - 1].x + xOffset,
    //           node.y + 1,
    //         ]);
    //       }

    //       point = {
    //         x: node.x + xOffset,
    //         y: node.y,
    //         name: node.name,
    //         z: node.value,
    //         isLeaf: node.children && node.children.length ? false : true,
    //       };

    //       if (highlight[node.name]) {
    //         let highlightResult = Lefse.parseHightlight(
    //           highlight[node.name],
    //           highlight["__DEFAULT-COLOR__"],
    //         );

    //         if (typeof highlightResult === "string") {
    //           point.color = highlightResult;
    //         } else {
    //           if (highlightResult.node) {
    //             point.color = highlightResult.node as string;
    //           }
    //           console.log(node, "highlight");
    //         }
    //       }

    //       points.push(point);

    //       if (!point.isLeaf) {
    //         // x link
    //         links.push([
    //           node.x + xOffset,
    //           node.y,
    //           node.x + xOffset,
    //           node.y + 1,
    //         ]);
    //       }
    //     },
    //   );

    //   console.log(_treeLayout);
    //   series.push({
    //     type: "bubble",
    //     data: points,
    //     colorIndex: i,
    //     name: nodeGroup.name,
    //     marker: {
    //       fillOpacity: 0.5,
    //       borderWidth: 1,
    //     },
    //     // ... other options
    //   });

    //   series.push({
    //     type: "arctree",
    //     data: links,
    //     showInLegend: false,
    //     linkedTo: ":previous",
    //   });
    // });

    const extremes = _layout.getExtremes();
    console.log(extremes);
    return {
      series,
      xAxis: extremes.x,

      // yAxis: extremes.y,
      // xAxis: {
      //   min: 0,
      //   max: maxX,
      //   // endOnTick: true,
      // },
      //   max:
      //     _layout.root._x.max -
      //     _layout.root._x.min +
      //     (_layout.root.children as Tree[]).length *
      //       _layout.options.groupPadding +
      //     1,
      // },
    };
  }

  /**
   * 转换成 Node 数据
   * @param groups
   * @returns
   */
  static _createNodes(groups: NodeGroupOptions[]): NodeGroup[] {
    return groups.map((group) => {
      let nodeNameMap: Record<string, Node> = {};
      let root: Node | undefined;
      group.nodes.forEach((nodeOption) => {
        const node: Node = {
          name: nodeOption[1],
          value: nodeOption[2],
          children: [],
        };
        nodeNameMap[node.name] = node;
        if (nodeOption[0] === undefined) {
          // TODO: 每个组必须只有一个 node 的 from 为 undefined,需要额外的数据检查。
          root = node;
        } else {
          nodeNameMap[nodeOption[0]]?.children?.push(node);
        }
      });

      return {
        ...group,
        root,
        nodes: undefined,
      } as NodeGroup;
    });
  }

  _getOptions(): IChartOptions {
    this.defaultOptions = {
      chart: {
        polar: true,
      },
      credits: {
        enabled: false,
      },
      pane: {
        innerSize: 0,
        size: "95%",
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

    // 用户输入的 lefse 配置转换成 Highcharts series 、坐标轴配置
    let chartOptions = Lefse.translateOptions(this.userOptions.lefse);

    if (
      this.userOptions.treeLegend &&
      this.userOptions.treeLegend.enabled === false
    ) {
      delete this.userOptions.treeLegend;
    } else {
      options.legends = [
        {
          ...(this.userOptions.treeLegend || {
            layout: "vertical",
            align: "right",
            verticalAlign: "top",
          }),
          target: {
            type: "arcarea",
            points: true,
          },
        },
      ];
    }

    Object.keys(chartOptions).forEach((key) => {
      if (key === "series") {
        if (options.series) {
          options.series = [...options.series, ...chartOptions.series];
        } else {
          options.series = chartOptions.series;
        }
      } else {
        options[key] = Highcharts.merge(options[key], chartOptions[key]);
      }
    });

    return options;
  }
}
