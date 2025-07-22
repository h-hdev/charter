import { IChartOptions } from "@/Charter";
import { Highcharter } from "./Highcharter";
import * as Highcharts from "highcharts";
import NetworkVizOptions from "./NetworkVizOptions";

export type NodeGroupOptions = {
  name: string;
  color?: string;
  nodes: [string, number][];
};

const colors: string[] = Highcharts.getOptions().colors as string[];

export type NodeOption = {
  id: string;
  group: string;
  color: string;
  marker: {
    radius: number;
  };
};

export default class Network extends Highcharter {
  getVizOptions(): any[] {
    return NetworkVizOptions.call(this);
  }
  _getOptions(): IChartOptions {
    this.defaultOptions = {
      chart: {},
      credits: {
        enabled: false,
      },
    };
    let options = super._getOptions();

    let networkOptions = this.userOptions.network;

    let nodes: NodeOption[] = [];
    networkOptions.nodes.forEach((nodeGroup: NodeGroupOptions, i: number) => {
      if (!nodeGroup.color) {
        nodeGroup.color = colors[i % colors.length];
      }

      nodeGroup.nodes.forEach((node) => {
        nodes.push({
          id: node[0],
          group: nodeGroup.name,
          color: nodeGroup.color as string,
          marker: {
            radius: node[1] * 10,
          },
        });
      });
    });
    options.series = [
      {
        ...networkOptions,
        links: undefined,
        type: "networkgraph",
        data: networkOptions.links.map((l: any) => [l[0], l[1]]),
        nodes: nodes,
      },
    ];

    return options;
  }
}
