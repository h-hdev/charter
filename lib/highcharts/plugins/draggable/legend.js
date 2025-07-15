import Dragable from "./draggable";

export default class LegendBox extends Dragable {
  static attach(target, e, chart) {
    if (
      target.parentNode.className.baseVal.includes("highcharts-legend-item") ||
      target.parentNode.className.baseVal.includes("highcharts-legend-title")
    ) {
      return new LegendBox(
        chart,
        {
          x: e.chartX,
          y: e.chartY,
        },
        chart.legend.group,
        chart.legend,
      );
    } else if (
      target.parentNode.className.baseVal.includes("highcharts-custome-legend")
    ) {
      return new LegendBox(
        chart,
        {
          x: e.chartX,
          y: e.chartY,
        },
        chart.legends[0].group,
        chart.legends[0],
      );
    }
  }

  moving(e) {
    let moving = {
      x: e.chartX - this.mousedown.x,
      y: e.chartY - this.mousedown.y,
    };

    let attr = {
      x: this.element.translateX + moving.x,
      y: this.element.translateY + moving.y,
    };

    this.element.element.setAttribute(
      "transform",
      `translate(${attr.x},${attr.y})`,
    );
    this.element.translateX = attr.x;
    this.element.translateY = attr.y;

    this.mousedown = {
      x: e.chartX,
      y: e.chartY,
    };
  }

  moveEnd(e) {
    const offset = {
      x: e.chartX - this.start.x,
      y: e.chartY - this.start.y,
    };

    this.object.update({
      x: this.object.options.x + offset.x,
      y: this.object.options.y + offset.y,
      floating: true,
    });

    return super.moveEnd(e);
  }
}
