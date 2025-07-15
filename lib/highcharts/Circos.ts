import { Highcharter } from "./Highcharter";

export default class Circos extends Highcharter {
  afterRender(): void {
    console.log(this.chart);
  }
}
