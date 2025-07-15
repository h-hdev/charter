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

export class Highcharter extends Plot {
  public chart: Highcharts.Chart | undefined;

  defaultOptions: IChartOptions = {};

  beforeInit(): void {
    console.log("high");
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
    console.log(options);
    throw new Error("Method not implemented.");
  }

  render(): void {
    this.obj = {
      chart: Highcharts.chart(this.container, this.options),
    };
    this.chart = this.obj.chart;

    this.afterRender();
  }

  afterRender() {}

  getVizOptions() {
    throw new Error("Method not implemented.");
  }
  export(type: ExportType, filanem: string, options?: IChartOptions): void {
    console.log(type, filanem, options);
    throw new Error("Method not implemented.");
  }
}
