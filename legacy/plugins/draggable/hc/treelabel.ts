import { Chart } from "highcharts";
import DragableElement, { BBox, Position } from "../DraggableElement";
import { IFont } from "..";

export default class Treelabel extends DragableElement {
  static attach(element: any, e: MouseEvent, chart: Chart) {
    const point = element.parentNode.point || element.point;
    if (point) {
      return new Treelabel(chart, point, point);
    }
  }

  getBBox(): BBox {
    const bbox = this.element.arclabel.element.getBBox() as BBox;
    // bbox.y -= 1;
    //
    //
    bbox.rotation = this.element.arclabel.rotation;

    return bbox;
  }

  getFont() {
    console.log(this.element);
    return {
      text: this.element.name,
      style: {
        "font-size": this.element.arclabel.styles.fontSize,
        "font-weight": this.element.arclabel.styles.fontWeight,
        "font-family": (this.chart.renderer as any).style.fontFamily,
      },
    };
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
    this.element.arclabel.element.setAttribute("opacity", 0);
  }

  onEnd(changed: Position, font?: IFont) {
    let options: any = this.object.options.dataLabels;

    if (!options) {
      options = {};
    }

    let newOptions: Record<string, any> = {
      dataLabels: {
        x: (options.x || 0) + changed.x,
        y: (options.y || 0) - changed.y,
      },
    };

    if (this.element.plotY > this.element.series.yAxis.center[1]) {
      newOptions.dataLabels.y = (options.y || 0) + changed.y;
    }

    if (font) {
      newOptions.name = font.text;
    }

    this.object.update(newOptions);
  }
}
