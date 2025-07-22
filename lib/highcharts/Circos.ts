import CircosVizOptions from "./CircosVizOptions";
import { Highcharter } from "./Highcharter";

export default class Circos extends Highcharter {
  afterRender(): void {
    console.log(this.chart);
  }

  getVizOptions(): any[] {
    return CircosVizOptions.call(this);
  }
}
