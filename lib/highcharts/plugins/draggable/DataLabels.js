import Element from "./Element";

export default class DataLabels extends Element {
  static textEditable = true;

  static is(target) {
    const point = target.parentNode.point || target.point;
    if (point && point.dataLabel) {
      return true;
    }
  }

  getObject() {
    let object = this.element.point;
    if (this.element.parentNode.point) {
      object = this.element.parentNode.point;
      this.element = this.element.parentNode;
    }
    return object.dataLabel;
  }

  moving(changed, e) {
    console.log(this.object);

    let x = this.object.translateX + changed.x,
      y = this.object.translateY + changed.y;

    let rotationStr =
      this.object.rotation !== undefined
        ? ` rotate(${this.object.rotation} ${this.object.rotationOriginX || 0} ${this.object.rotationOriginY || 0})`
        : "";

    this.element.setAttribute(
      `transform`,
      `translate(${x}, ${y})${rotationStr}`,
    );

    this.object.translateX = x;
    this.object.translateY = y;
    // this.element.setAttribute(
    //   "x",
    //   parseInt(this.element.getAttribute("x")) + changed.x,
    // );
    // this.element.setAttribute(
    //   "y",
    //   parseInt(this.element.getAttribute("y")) + changed.y,
    // );
  }

  getText() {
    return this.object.textStr;
  }

  setText(text) {
    (this.element.parentNode.point || this.element.point).update({
      name: text,
    });
  }

  oveEnd(mousedown, mouseup, e) {
    let diff = {
      x: mouseup.x - mousedown.x,
      y: mouseup.y - mousedown.y,
    };

    const options = this.object.options;
    this.object.update({
      // dataLabel: {
      x: (options.x || 0) + diff.x,
      y: (options.y || 0) + diff.y,
      // },
    });
  }
}
