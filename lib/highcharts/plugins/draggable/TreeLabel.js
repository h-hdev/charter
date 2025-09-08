import DataLabels from "./DataLabels";

export default class TreeLabel extends DataLabels {
  static textEditable = true;
  static is(target) {
    const point = target.parentNode.point || target.point;
    if (point) {
      return true;
    }
    return false;
  }

  getObject() {
    let point = this.element.parentNode.point || this.element.point;

    return point.arclabel;
  }
}
