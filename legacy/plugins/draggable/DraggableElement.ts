import { Chart } from "highcharts";
import { IFont, IRect } from ".";

// interface Draggabe {
//   attach: (e: MouseEvent) => boolean,
//   getBBox: () => IRect;
//   events: {
//     start: () => void;
//     moving: () => void;
//     end: () => void;
//   };
// }
//
export type Position = {
  x: number;
  y: number;
};

export interface BBox extends Position {
  width: number;
  height: number;
  rotation?: number;
}

abstract class DragableElement {
  chart: Chart;
  element: any;
  object: any;

  constructor(chart: Chart, element: any, object: any) {
    this.chart = chart;
    this.element = element;
    this.object = object;
  }

  static attach(
    element: any,
    e: MouseEvent,
    chart: Chart,
  ): DragableElement | undefined {
    console.log(element, chart, e);
    return undefined;
  }

  abstract getBBox(): BBox;

  // abstract getFont(): IFont | undefined;

  getFont(): IFont | undefined {
    return undefined;
  }

  onStart(e: MouseEvent) {}

  onEnd(changed: Position, font: IFont | undefined) {}

  onMoving(changed: Position) {}

  destory() {}
}

export default DragableElement;
