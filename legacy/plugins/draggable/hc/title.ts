import { Chart } from "highcharts";
import DragableElement, { BBox, Position } from "../DraggableElement";
import { IFont } from "..";

class Title extends DragableElement {
  static attach(element: any, e: MouseEvent, chart: Chart) {
    if (
      element.className.baseVal === "highcharts-title"
      // &&
      // chart.options.title.dragable !== false
    ) {
      return new Title(chart, element, chart.title);
    }
  }

  getBBox(): BBox {
    const bbox = this.element.getBBox() as BBox;
    // bbox.y -= 1;
    return bbox;
  }

  getFont(): IFont {
    return {
      text: this.element.textContent,
      style: {
        "font-size": "1.2em",
        "font-weight": "bold",
        "font-family": (this.chart.renderer as any).style.fontFamily,
      },
    };
  }

  onStart(): void {
    this.element.setAttribute("opacity", 0);
  }

  onEnd(changed: Position, font: IFont | undefined) {
    console.log(font);
    const title: any = this.chart.options.title;
    if (!title.y) {
      title.y = (this.chart as any).titleOffset[0] / 2 - 4;
    }

    let newOptions: Record<string, any> = {
      x: (title.x || 0) + changed.x,
      y: (title.y || 0) + changed.y,
    };

    if (font && font.text !== title.text) {
      newOptions.text = font.text;
    }

    this.object.update(newOptions);
  }
}

export default Title;
