import Dragable from "./draggable";

// legend-text
class LegendText extends Dragable {
  static attach(element, e, chart) {
    console.log(element.className);
    if (element.className.baseVal === "highcharts-legend-text") {
      return new LegendText(
        chart,
        {
          x: e.chartX,
          y: e.chartY,
        },
        element,
        element.point,
      );
    }
  }

  moveEnd(e) {
    const offset = {
      x: e.chartX - this.start.x,
      y: e.chartY - this.start.y,
    };

    console.log(this.object);

    let options = this.object.options._legendText || {
      x: 0,
      y: 0,
    };

    options.x += offset.x;
    options.y += offset.y;

    this.object.update({
      _legendText: options,
    });

    return super.moveEnd(e);
  }
}

export default LegendText;
