import Dragable from "./draggable";

class Title extends Dragable {
  static attach(element, e, chart) {
    if (
      element.className.baseVal === "highcharts-title" &&
      chart.options.title.dragable !== false
    ) {
      return new Title(
        chart,
        {
          x: e.chartX,
          y: e.chartY,
        },
        element,
        chart.title,
      );
    }
  }

  getEditProps() {
    return {
      text: this.element.textContent,
      bbox: this.element.getBBox(),
    };
  }

  moveEnd(e) {
    let yOffset = 0;
    if (!this.chart.options.title.y) {
      console.log(this.chart.titleOffset, this.chart);
      yOffset = this.chart.titleOffset[0] / 2 - 4; //this.chart.spacingBox.y / 2;
    }

    const offset = {
      x: e.chartX - this.start.x,
      y: e.chartY - this.start.y + yOffset,
    };

    this.object.update({
      x: (this.chart.options.title.x || 0) + offset.x,
      y: (this.chart.options.title.y || 0) + offset.y,
    });

    return super.moveEnd(e);
  }
}

export default Title;
