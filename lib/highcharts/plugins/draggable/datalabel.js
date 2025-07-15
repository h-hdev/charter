import Dragable from "./draggable";

class DataLabel extends Dragable {
  static attach(element, e, chart) {
    if (element.parentNode.point || element.point) {
      return new DataLabel(
        chart,
        {
          x: e.chartX,
          y: e.chartY,
        },
        element,
        element.parentNode.point || element.point,
      );
    }
  }

  moveEnd(e) {
    const offset = {
      x: e.chartX - this.start.x,
      y: e.chartY - this.start.y,
    };

    console.log(this.object);

    let options = this.object.options.dataLabels || {
      dataLabel: {
        x: 0,
        y: 0,
      },
    };

    options.dataLabel.x += offset.x;
    options.dataLabel.y += offset.y;

    this.object.update(options);

    // this.object.update({
    // 	dataLabels: {
    // 		x: (this.chart.options.title.x || 0) + offset.x,
    // 		y: (this.chart.options.title.y || 0) + offset.y
    // 	}
    // });

    return super.moveEnd(e);
  }
}

export default DataLabel;
