import CircosVizOptions from "./CircosVizOptions";
import { Highcharter } from "./Highcharter";

export default class Circos extends Highcharter {
  afterRender(): void {
    console.log(this.chart);
  }

  setOption(key: string, value: any): void {
    super.setOption(key, value);

    if (key === "colors") {
      let colors = value;
      /**
       * 手动更新每个 node 的颜色，
       * Note: 这应该是 Highcharts 的 bug，
       */
      this.obj.chart.series[0].nodes.forEach((node: any) => {
        node.update({
          color: colors[node.colorIndex],
        });
      });
    }

    // else if (key === "series[0].dataLabels.enabled") {
    //   this.obj.chart.series[0].update({
    //     dataLabels: {
    //       nodeFormatter: function (this: any) {
    //         return value ? this.name : undefined;
    //       },
    //     },
    //   });
    // }
  }

  getVizOptions(): any[] {
    return CircosVizOptions.call(this);
  }
}
