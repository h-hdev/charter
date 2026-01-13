import DOM from "../Utils/DOM";
import Utils from "../Utils/Utils";

import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import Exporting from "highcharts/modules/exporting";
import Heatmap from "highcharts/modules/heatmap";
import Coloraxis from "highcharts/modules/coloraxis";
import Venn from "highcharts/modules/venn";

import Tree from "../series/TreeSeries";
import Bubble from "../series/BubbleSeries";
import Polar from "../series/PolarSeries";
import VennSeries from "../series/VennSeries";

HighchartsMore(Highcharts);
Heatmap(Highcharts);
Coloraxis(Highcharts);
Tree(Highcharts);
Exporting(Highcharts);
Bubble(Highcharts);
Polar(Highcharts);
Venn(Highcharts);
VennSeries(Highcharts);

Highcharts.setOptions({
  credits: {
    enabled: false,
  },
  exporting: {
    enabled: false,
  },
});

class Chart {
  constructor(el, options) {
    this.el = DOM.get(el);
    this.size = {};
    this.position = {};
    this.init(options);
  }

  beforeInit() {
    this.defaultOptions = {};
    this.emptyEvents = {};
  }

  init(options) {
    this.beforeInit();
    this.setOptions(options, true);
    this.render();
    this.addEvents();
  }

  setOptions(options, isDefaultOptions) {
    this.options = Utils.merge(
      isDefaultOptions || !this.options ? this.defaultOptions : this.options,
      options,
    );
  }

  render() {
    if (this.chart) {
      this.chart.update(this.options);
    } else {
      this.chart = new Highcharts.chart(this.el, this.options);
    }
  }

  addEvents() {}

  reflow() {
    console.log("reflow", this.chart);
    this.chart.reflow();
  }

  exportChart(filename, type = "png") {
    let typeMaps = {
      png: "image/png",
      jpg: "image/jpeg",
      pdf: "application/pdf",
      svg: "image/svg+xml",
    };

    this.chart.exportChart({
      type: typeMaps[type],
      filename: filename,
    });
  }

  update(key, value, isDefaultOptions) {
    if (key === "size") {
      DOM.styles(this.el, {
        width: value.w + value.suffix,
        height: value.h + value.suffix,
      });
      this.reflow();
      return true;
    } else if (key === "position") {
      this.position = {
        x: value.x,
        y: value.y,
      };
      DOM.styles(this.el, {
        left: value.x + value.suffix,
        top: value.y + value.suffix,
      });
      return true;
    }

    if (typeof key === "object") {
      this.setOptions(key, isDefaultOptions);
      this.render();
      return true;
    }
  }
}

export default Chart;
