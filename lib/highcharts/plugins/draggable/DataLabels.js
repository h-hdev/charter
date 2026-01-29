import Element from "./Element";

export default class DataLabels extends Element {
  static textEditable = true;

  // targetObjectKey = "dataLabel";
  updateOptionKey = "dataLabels";

  static is(target) {
    const point = target.parentNode.point || target.point;
    if (
      point &&
      point.dataLabel &&
      (target.className.baseVal?.includes("highcharts-data-label") ||
        target.parentNode.className.baseVal?.includes("highcharts-data-label"))
    ) {
      return true;
    }
  }

  getObject() {
    let object = this.element.point;
    if (this.element.parentNode.point) {
      object = this.element.parentNode.point;
      this.element = this.element.parentNode;
    }
    return object;
  }

  moving(changed, e) {
    const object = this.object.dataLabel;

    let x = object.translateX + changed.x,
      y = object.translateY + changed.y;

    let rotationStr =
      object.rotation !== undefined
        ? ` rotate(${object.rotation} ${object.rotationOriginX || 0} ${object.rotationOriginY || 0})`
        : "";

    this.element.setAttribute(
      `transform`,
      `translate(${x}, ${y})${rotationStr}`,
    );

    object.translateX = x;
    object.translateY = y;
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
    return this.object[this.targetObjectKey].textStr;
  }

  setText(text) {
    this.object.update({
      name: text,
    });
  }

  getObjectPosition() {
    const options = this.object.dataLabel.options;
    return {
      x: options.x || 0,
      y: options.y || 0,
    };
  }

  // moveEnd(mousedown, mouseup, e) {
  //   let diff = {
  //     x: mouseup.x - mousedown.x,
  //     y: mouseup.y - mousedown.y,
  //   };

  //   const pos = this.getObjectPosition();
  //   this.object.update({
  //     dataLabels: {
  //       x: pos.x + diff.x,
  //       y: pos.y + diff.y,
  //     },
  //   });
  // }
}
