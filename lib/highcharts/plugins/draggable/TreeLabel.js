import DataLabels from "./DataLabels";

export default class TreeLabel extends DataLabels {
  // targetObjectKey = "arclabel";
  // updateOptionKey = "dataLabels";

  static textEditable = true;
  static is(target) {
    const point = target.parentNode.point || target.point;
    if (point && target.className.baseVal?.includes("highcharts-data-label")) {
      return true;
    }
    return false;
  }

  getObject() {
    let point = this.element.parentNode.point || this.element.point;
    return point;
  }

  getObjectPosition() {
    const options = this.object.options.dataLabels || {};
    return {
      x: options.x || 0,
      y: options.y || 0,
    };
  }

  moving(changed, e) {
    const object = this.object.arclabel;

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
  }

  // getObjectPosition() {
  //   const options = this.object.options.dataLabels;
  //   return {
  //     x: options.x || 0,
  //     y: options.y || 0,
  //   };
  // }

  // moveEnd(mousedown, mouseup, e) {
  //   let diff = {
  //     x: mouseup.x - mousedown.x,
  //     y: mouseup.y - mousedown.y,
  //   };

  //   const newOptions = this.getNewOptions(diff);
  //   console.log(newOptions);
  //   this.object[this.targetObjectKey].update(newOptions);
  // }
}
