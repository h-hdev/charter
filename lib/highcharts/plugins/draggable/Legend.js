import Element from "./Element";

function isTreeLegend(target) {
  if (
    (target.tagName === "text" || target.tagName === "rect") &&
    target.parentNode.className.baseVal?.includes("highcharts-tree-legend")
  ) {
    return true;
  }
}

export default class Legend extends Element {
  static is(target) {
    // for legend.useHTML = true
    if (target.tagName === "SPAN") {
      return target.parentNode.className.includes("highcharts-legend-item");
    }

    // for colorAxis text
    if (
      target.tagName === "text" &&
      target.parentNode.className.baseVal?.includes(
        "highcharts-coloraxis-labels",
      )
    ) {
      return true;
    }

    // for colorAxis tree legend
    if (isTreeLegend(target)) return true;

    // for normal legend
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
    // if (isTreeLegend(this.element)) {

    this.treeLegendElement = this.chart.renderer.box.querySelector(
      ".highcharts-tree-legend",
    ); // this.element.parentNode;
    // }

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

    // fixed when useHTML = true
    if (this.object.group.div) {
      this.object.group.div.style.left = x + "px";
      this.object.group.div.style.top = y + "px";
    }

    if (this.treeLegendElement) {
      let translate = /translate\((\d+),(\d+)\)/.exec(
        this.treeLegendElement.getAttribute("transform"),
      );

      this.treeLegendElement.setAttribute(
        "transform",
        `translate(${parseFloat(translate[1]) + changed.x},${parseFloat(translate[2]) + changed.y})`,
      );
    }
  }
}
