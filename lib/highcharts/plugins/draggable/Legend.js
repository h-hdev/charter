import Element from "./Element";

export default class Legend extends Element {
  static is(target) {
    const className = target.parentNode.className.baseVal;
    if (className === undefined) return false;
    if (
      className.includes("highcharts-legend-item") ||
      className.includes("highcharts-legend-title")
    ) {
      return true;
    }
  }

  getObject() {
    this.element = this.chart.legend.group.element;
    return this.chart.legend;
  }

  moving(changed, e) {
    let x = this.object.group.translateX,
      y = this.object.group.translateY;

    x += changed.x;
    y += changed.y;

    this.element.setAttribute("transform", `translate(${x}, ${y})`);

    this.object.group.translateX = x;
    this.object.group.translateY = y;
  }
}
