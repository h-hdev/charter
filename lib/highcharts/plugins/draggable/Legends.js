import Legend from "./Legend";

export default class Legends extends Legend {
  static is(target) {
    const className = target.parentNode.className.baseVal;
    if (!className) return false;
    if (className.includes("highcharts-custome-legend")) {
      return true;
    }
  }

  getObject() {
    this.element = this.element.parentNode;

    // TODO: 更合理的下标值获取方式。
    const _index = this.element._index;

    const object =
      this.chart.legends && this.chart.legends.length > _index
        ? this.chart.legends[_index]
        : null;

    return object;
  }
}
