import Element from "./Element";

export default class Axis extends Element {
  static textEditable = true;
  updateOptionKey = "title";
  // targetObjectKey = "title";

  static is(target) {
    const className = target.parentNode.className.baseVal;
    if (className === undefined) return false;
    if (className.includes("highcharts-axis")) {
      return true;
    }
  }

  getObject() {
    let axis;
    const className = this.element.parentNode.className.baseVal;
    if (className.includes("highcharts-yaxis")) {
      axis = this.chart.yAxis;
    } else if (className.includes("highcharts-xaxis")) {
      axis = this.chart.xAxis;
    }
    if (!axis) return null;

    for (const ax of axis) {
      if (ax.axisTitle?.element === this.element) {
        return ax;
      }
    }

    return null;
  }

  getText() {
    return this.object.axisTitle?.textStr;
  }

  setText(text) {
    this.object.update({
      title: {
        text: text,
      },
    });
  }
  getObjectPosition() {
    const options = this.object.options.title;
    return {
      x: options.x || 0,
      y: options.y || 0,
    };
  }

  moving(changed, e) {
    let x = parseInt(this.element.getAttribute("x")) + changed.x,
      y = parseInt(this.element.getAttribute("y")) + changed.y;

    this.element.setAttribute("x", x);
    this.element.setAttribute("y", y);

    const rotation = /rotate\((\d+) */.exec(
      this.element.getAttribute("transform"),
    );

    if (rotation && rotation.length > 1) {
      this.element.setAttribute(
        "transform",
        `translate(0,0) rotate(${rotation[1]} ${x} ${y})`,
      );
    }
  }
}
