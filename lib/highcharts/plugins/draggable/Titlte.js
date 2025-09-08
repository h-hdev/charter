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

  moveEnd(mousedown, mouseup, e) {
    let diff = {
      x: mouseup.x - mousedown.x,
      y: mouseup.y - mousedown.y,
    };

    const options = this.chart.options.title;
    this.object.update({
      x: (options.x || 0) + diff.x,
      y: (options.y === undefined ? options.margin : options.y) + diff.y,
    });
  }
}
