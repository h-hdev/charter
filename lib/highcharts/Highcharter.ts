import { ExportType, IChartOptions, Plot } from "../Charter";

// Highcharts
import * as Highcharts from "highcharts";
import "highcharts/modules/treemap";
import "highcharts/modules/treegraph";
import "highcharts/modules/networkgraph";
import "highcharts/highcharts-more";
import "highcharts/modules/sankey";
import "highcharts/modules/dependency-wheel";

// Highcharts wrapper and series
import wrapper from "./wrapper/index.js";
wrapper(Highcharts);
import series from "./series/index.js";
series(Highcharts);
import Plugins from "./plugins/index.js";
Plugins(Highcharts);

import Utils from "@/utils/index.js";

export class Highcharter extends Plot {
  public chart: Highcharts.Chart | undefined;

  defaultOptions: IChartOptions = {};

  beforeInit(): void {
    console.log("highcharter");
  }

  destory(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
      this.obj.chart = undefined;
    }
  }

  _getOptions(): IChartOptions {
    return Highcharts.merge(this.defaultOptions, this.userOptions);
  }

  setOptions(options: Record<string, any>): void {
    const arrayObject = ["series", "xAxis", "yAxis", "legends"];
    Object.keys(options).forEach((key) => {
      if (arrayObject.includes(key)) {
        options[key].forEach((op: any, index: number) => {
          if (op !== undefined) {
            this.obj.chart[key][index].update(op, false);
          }
        });
        delete options[key];
      }
    });

    if (Object.keys(options).length) {
      this.obj.chart.update(options);
    } else {
      this.obj.chart.redraw();
    }
  }

  setOption(key: string, value: any): void {
    key = key.replace(/\[(\d)\]/, (match, p1) => "." + p1);
    let options = Utils.set({}, key, value);
    this.setOptions(options);
  }

  render(): void {
    this.obj = {
      chart: Highcharts.chart(this.container, this.options),
    };
    this.chart = this.obj.chart;

    this.afterRender();
  }

  afterRender() {}

  getVizOptions(): any[] {
    throw new Error("Method not implemented.");
  }
  export(type: ExportType, filanem: string, options?: IChartOptions): void {
    console.log(type, filanem, options);
    throw new Error("Method not implemented.");
  }
}
