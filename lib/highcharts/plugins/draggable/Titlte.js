import Element from "./Element";
export default class Title extends Element {
  static textEditable = true;

  static match = {
    tagName: "text",
    className: "highcharts-title",
  };

  getObject() {
    return this.chart.title;
  }

  moveStart(mousedown, e) {}

  moving(changed, e) {
    this.element.setAttribute(
      "x",
      parseInt(this.element.getAttribute("x")) + changed.x,
    );
    this.element.setAttribute(
      "y",
      parseInt(this.element.getAttribute("y")) + changed.y,
    );
  }

  getText() {
    return this.object.textStr;
  }

  setText(text) {
    this.object.update({
      text,
    });
  }

  getObjectPosition() {
    const options = this.chart.options.title;
    return {
      x: options.x || 0,
      y: (options.y === undefined ? options.margin : options.y) || 0,
    };
  }
}
