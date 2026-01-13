import { Chart } from "highcharts";
import DragableElement, { BBox, Position } from "../DraggableElement";

export default class DataLabel extends DragableElement {
  static attach(element: any, e: MouseEvent, chart: Chart) {
    const point = element.parentNode.point || element.point;
    console.log(element);
    if (point && point.dataLabel) {
      console.log(point);
      return new DataLabel(chart, point, point);
    }
  }

  getBBox(): BBox {
    const bbox = this.element.dataLabel.element.getBBox() as BBox;
    // bbox.y -= 1;
    return bbox;
  }

  getFont() {
    return undefined;
    // return {
    //   text: this.element.textContent,
    //   style: {
    //     "font-size": "1.2em",
    //     "font-weight": "bold",
    //     "font-family": (this.chart.renderer as any).style.fontFamily,
    //   },
    // };
  }

  onStart(): void {
    this.element.dataLabel.element.setAttribute("opacity", 0);
  }

  onEnd(changed: Position) {
    const options: any = this.object.options.dataLabel;

    this.object.update({
      dataLabels: {
        x: (options.x || 0) + changed.x,
        y: (options.y || 0) + changed.y,
      },
    });
  }
}
