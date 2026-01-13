
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import HCMore from 'highcharts/highcharts-more';
import ArrowSeries from '../charts/arrow-series';
import PeralSeries from '../charts/petal-series';
import TernarySeries from '../charts/ternary-series';


class Chart {
   constructor(el, options) {
      this.el = typeof el === 'string' ? document.getElementById(el) : el;
      this.options = options;

      this.chart = null;
      this.chartOptions = null;

      this.value = {};
      this.beforeInit();
      this.init();
   }

   beforeInit() {

   }

   afterInit() {

   }

   init() {

      this.wrapper();
      this.chart = Highcharts.chart(this.el, this.chartOptions);
      this.chart.obj = this;
      this.afterInit();
   }

   wrapper() {

      Exporting(Highcharts);
      HCMore(Highcharts);
      ArrowSeries(Highcharts);
      PeralSeries(Highcharts);
      TernarySeries(Highcharts);

      Highcharts.setOptions({
         lang: {
            thousandsSep: ',',
            downloadJPEG: '导出 JPEG',
            downloadPDF: '导出 PDF',
            downloadPNG: '导出 PNG',
            downloadSVG: '导出 SVG',
            printChart: '打印',
            viewFullscreen: '全屏展示'
         },
         credits: {
            enabled: false
         },
         plotOptions: {
            series: {
               dataLabels: {
                  allowOverlap: true,
                  style: {
                     "fontSize": "12px",
                     "fontWeight": "normal",
                     "textOutline": "none"
                  }
               }
            }
         }
      });

      // Highcharts.Chart.prototype.set = function (key, value) {

      // };


      // Highcharts.Chart.prototype.get = function (key) {

      // }
   }

   updateSeries(value) {
      let _this = this;
      if (typeof value !== 'object' && !value.name) {
         return false;
      }

      let targetSeries = null;
      for (let i = 0; i < _this.chart.series.length; i++) {
         if (_this.chart.series[i].name === value.name) {
            targetSeries = _this.chart.series[i];
            break;
         }
      }

      if (!targetSeries) {
         return false;
      }

      targetSeries.update(value);
      return true;
   }

   set(key, value) {

      let _this = this;

      if (key === 'size') {
         if (typeof value === 'object' && value.length === 2) {
            _this.el.style.width = value[0] + 'px';
            _this.el.style.height = value[1] + 'px';
            _this.chart.reflow();
            return true;
         }
         return false;
      } else if (key === 'position') {
         if (typeof value === 'object' && value.length === 2) {
            _this.el.style.left = value[0] + 'px';
            _this.el.style.top = value[1] + 'px';
            return true;
         }
         return false;
      } else if (key === 'series') {
         return _this.updateSeries(value);
      }


      let keys = key.split('.');
      let options = {};
      options[keys[keys.length - 1]] = value;

      for (let i = keys.length - 2; i >= 0; i--) {
         let temp = {}
         temp[keys[i]] = options;
         options = JSON.parse(JSON.stringify(temp))
      }
      _this.chart.update(options);
      return true;
   }

   get(key) {
      let _this = this;
      if (!key) {
         return _this.chart.userOptions;
      }

      if (_this.value[key] !== undefined) {
         return _this.value[key];
      }

      if (key === 'size') {
         return {
            width: _this.el.clientWidth,
            height: _this.el.clientHeight
         }
      } else if (key === 'position') {
         // TODO:
         return {
         }
      }

      let keys = key.split('.'),
         options = _this.chart.userOptions;

      keys.forEach(k => {
         options = options[k];
         if (!options) {
            return null;
         }
      });
      return options;
   }
}

export default Chart;