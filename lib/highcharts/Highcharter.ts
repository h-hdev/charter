import { ExportType, IChartOptions, Plot } from "../Charter";

// Highcharts
import * as Highcharts from "highcharts";
import "highcharts/modules/treemap";
import "highcharts/modules/treegraph";
import "highcharts/modules/networkgraph";
import "highcharts/highcharts-more";
import "highcharts/modules/sankey";
import "highcharts/modules/dependency-wheel";
import "highcharts/modules/exporting";

// Highcharts wrapper and series
import wrapper from "./wrapper/index.js";
wrapper(Highcharts);
import series from "./series/index.js";
series(Highcharts);
// import Plugins from "./plugins/index.js";
// Plugins(Highcharts);

import Utils from "@/utils/index.js";
import { getBasicOptions } from "./VizOptions.js";

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

    console.log(options, "update");
    const keys = Object.keys(options);
    let keyLength = keys.length;
    if (keyLength) {
      if (keyLength === 1 && this.obj.chart[keys[0]]) {
        let key = keys[0];
        this.obj.chart[key].update(options[key]);
      } else {
        // TODO: check other options
        // copy object,
        if (options.colors) {
          options.colors = [...options.colors];
        }
        this.obj.chart.update(options);
      }
    } else {
      this.obj.chart.redraw();
    }
  }

  setOption(key: string, value: any): void {
    //@ts-ignore
    key = key.replace(/\[(\d)\]/, (match, p1) => "." + p1);
    let options = Utils.set({}, key, value);

    this.setOptions({ ...options });
  }

  render(): void {
    console.log(this.options);
    this.obj = {
      chart: Highcharts.chart(this.container, this.options),
    };
    this.chart = this.obj.chart;

    this.afterRender();
  }

  afterRender() {}

  getVizOptions(): any[] {
    return [getBasicOptions(this.obj.chart.options)];
  }

  _toExportFileType(type: ExportType) {
    const typeMapping: Record<ExportType, string> = {
      jpg: "image/jpeg",
      pdf: "application/pdf",
      png: "image/png",
      svg: "image/svg+xml",
    };

    return typeMapping[type];
  }

  export(type: ExportType, filename: string, options?: IChartOptions): void {
    this.chart?.exporting.exportChart(
      {
        type: this._toExportFileType(type) as any,
        filename,
      },
      options,
    );
  }
}
