import { Chart } from "highcharts";
import DragableElement, { Position } from "../DraggableElement";
import { IRect } from "..";

export default class Legend extends DragableElement {
  static attach(element: any, e: MouseEvent, chart: Chart) {
    if (!element.parentNode.className.baseVal) return undefined;
    if (
      element.parentNode.className.baseVal.includes("highcharts-legend-item") ||
      element.parentNode.className.baseVal.includes("highcharts-legend-title")
      // &&
      // chart.options.title.dragable !== false
    ) {
      return new Legend(chart, chart.legend.group, chart.legend);
    } else if (
      element.parentNode.className.baseVal.includes("highcharts-custome-legend")
    ) {
      const customeLegend = (chart as any).legends[0];
      return new Legend(chart, customeLegend.group, customeLegend);
    }
  }

  posPlus<T extends Position>(p1: T, p2: Position): T {
    return {
      ...p1,
      x: p1.x + p2.x,
      y: p1.y + p2.y,
    };
  }

  getOffset(): Position {
    return {
      x: this.element.translateX,
      y: this.element.translateY,
    };
  }

  getBBox(): IRect {
    const bbox = this.posPlus(
      this.element.getBBox() as IRect,
      this.getOffset(),
    );

    // this.posPlus(bbox, this.getBBox());

    // bbox.x += this.element.translateX;
    // bbox.y += this.element.translateY;

    return bbox;
  }

  getFont() {
    return undefined;
  }

  onStart(): void {
    // this.element.setAttribute("opacity", 0);
  }

  onMoving(changed: { x: number; y: number }): void {
    let translate = this.posPlus(changed, this.getOffset());

    this.element.element.setAttribute(
      "transform",
      `translate(${translate.x}, ${translate.y})`,
    );
  }

  onEnd(changed: { x: number; y: number }) {
    const legend: any = this.object.options;
    this.object.update({
      x: (legend.x || 0) + changed.x,
      y: (legend.y || 0) + changed.y,
      floating: true,
    });
  }
}
