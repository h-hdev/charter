import * as Highcharts from "highcharts";

class Legend {
  constructor(chart, options) {
    this.chart = chart;
    this.options = options;

    this.getAllItems();
    this.render();
  }

  getAllItems() {
    let items = [];
    this.chart.series.forEach((s) => {
      if (s.type === this.options.target.type) {
        if (this.options.target.points) {
          s.points.forEach((p) => {
            items.push({
              name: p.name,
              color: p.color,
            });
          });
        } else {
          items.push({
            name: s.name,
            color: s.color,
          });
        }
      }
    });

    this.allItems = items;
  }

  /**
   *
   * @param {*} options
   */
  update(options) {
    this.options = Highcharts.merge(this.options, options);
    this.render();
  }

  redraw() {
    this.getAllItems();
    this.render();
  }

  render() {
    if (this.group) {
      this.group.destroy();
    }

    this.group = this.chart.renderer.g("custome-legend").add();
    this.symbolWidth = this.options.symbolWidth || 20;
    this.symbolHeight = this.options.symbolHeight || 10;
    this.margin = this.options.margin || 12;

    let position = {
      x: 0,
      y: 0 - this.margin,
    };
    if (this.options.title && this.options.title.text) {
      this.title = this.chart.renderer
        .text(this.options.title.text, position.x, position.y)
        .css(this.options.title.style)
        .add(this.group);

      position.y += 10;
    }

    this.allItems.forEach((item, i) => {
      position = this.renderItem(item, i, position);
    });

    const bbox = this.group.getBBox();

    let x, y;

    const spacing = this.chart.spacing;

    switch (this.options.align) {
      case "left":
        x = spacing[3] + this.margin;
        break;
      case "right":
        x =
          this.chart.plotLeft +
          (this.chart.plotWidth - bbox.width - this.margin);
        break;
    }

    switch (this.options.verticalAlign) {
      case "top":
        y = spacing[0] + this.margin + this.chart.titleOffset[0] / 2;
        break;
      case "bottom":
        y =
          this.chart.plotTop +
          this.chart.plotHeight -
          bbox.height -
          this.margin;
        break;
    }

    // align group
    this.group.attr({
      translateX: x + (this.options.x || 0),
      translateY: y + (this.options.y || 0),
    });
  }

  renderItem(item, index, position) {
    let x = position.x;
    let y = position.y + this.options.itemMarginTop;
    const symbol = this.chart.renderer
      .rect(x, y, this.symbolWidth, this.symbolHeight)
      .attr({
        fill: item.color,
      })
      .add(this.group);

    const text = this.chart.renderer
      .text(
        item.name,
        x + this.symbolWidth + this.options.symbolPadding,
        y + this.symbolHeight / 2,
      )
      .attr({})
      .css({
        ...this.options.itemStyle,
        "dominant-baseline": "central",
      })
      .add(this.group);

    const textBBox = text.getBBox();

    if (this.options.layout === "horizontal") {
      x +=
        this.symbolWidth +
        this.options.symbolPadding +
        textBBox.width +
        (this.options.itemDistance || 20);
    } else {
      y += textBBox.height + this.options.itemMarginBottom;
    }

    item.symbol = symbol;
    item.text = text;

    return {
      x: x,
      y: y,
    };
  }
}

export default (H) => {
  H.addEvent(H.Chart, "load", function (e) {
    if (this.options.legends) {
      this.options.legends.forEach((legendOptions, i) => {
        const legend = new Legend(
          this,
          H.merge(this.options.legend, legendOptions),
        );
        if (!this.legends) {
          this.legends = [];
        }

        if (this.legends.length > i) {
          this.legends[i] = legend;
        } else {
          this.legends.push(legend);
        }
      });
    }
  });

  H.addEvent(H.Chart, "redraw", function () {
    if (this.legends) {
      this.legends.forEach((legend) => {
        legend.redraw();
      });
    }
  });
};
