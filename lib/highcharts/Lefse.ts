import { IChartOptions } from "@/Charter";
import { Highcharter } from "./Highcharter";
import * as Highcharts from "highcharts";

import { HighlightOption, HighlightTree, ILefseOption } from "@/types/lefse";

import { Node } from "@/types/lefse";
import TreeLayout, { Tree } from "@/treelayout/TreeLayout";
import LefseVizOptions from "./LefseVizOptions";

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

// Link Data: [x, y, x1, y1]
type Link = [number, number, number, number];

export default class Lefse extends Highcharter {
  afterRender(): void {
    // console.log(this.chart);
    // setTimeout(() => {
    //   this.obj.chart?.series[0].update({
    //     color: "#006cee",
    //   } as any);
    //   console.log(this.obj.chart?.series[0]);
    // }, 2000);
  }
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
      let seriesId = "lefse-" + i + group.name;
      series.push({
        type: "bubble",
        name: group.name,
        colorIndex: i,
        data: [],
        id: seriesId,
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
        linkedTo: seriesId,
      });

      if (arcAreaSeries.data.length) {
        series.push({
          linkedTo: seriesId,
          type: "arcarea",
          data: [...arcAreaSeries.data],
        });

        arcAreaSeries.data = [];
      }
    });

    const extremes = _layout.getExtremes();
    return {
      series,
      xAxis: extremes.x,
    };
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
        // if (options.series) {
        //   options.series = [...options.series, ...chartOptions.series];
        // } else {
        options.series = chartOptions.series;
        // }
      } else {
        options[key] = Highcharts.merge(options[key], chartOptions[key]);
      }
    });

    console.log(options);

    return options;
  }

  getVizOptions(): any[] {
    return LefseVizOptions.call(this);
  }
}
