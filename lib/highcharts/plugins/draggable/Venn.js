import Element from "./Element";

export default class Venn extends Element {
  static is(target) {
    if (target.tagName === "text") {
      return target.className.baseVal?.includes("venn-point-name");
    }

    return false;
  }

  getObject() {
    for (let i = 0; i < this.chart.series.length; i++) {
      let points = this.chart.series[i].points;
      for (let j = 0; j < points.length; j++) {
        if (points[j].legendText?.element === this.element) {
          return points[j];
        }
      }
    }
    return null;
  }

  moving(changed, e) {
    let x = parseFloat(this.element.getAttribute("x")),
      y = parseFloat(this.element.getAttribute("y"));

    this.element.setAttribute("x", changed.x + x);
    this.element.setAttribute("y", changed.y + y);
  }

  getNewOptions(diff) {
    let newPos = [...this.object.options.position];
    newPos[0] += diff.x;
    newPos[1] += diff.y;
    return {
      position: newPos,
    };
  }
}
