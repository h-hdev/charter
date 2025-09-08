import Chart from './Chart';
import Utils from '../helper/Utils';


class Venn extends Chart {
   constructor(el, options) {
      super(el, options);
   }

   updateSeries(value) {
      if (typeof value !== 'object' && !value.name) {
         return false;
      }

      let targetPoint = null,
         _this = this,
         points = _this.chart.series[0].points;
      for (let i = 0; i < points.length; i++) {
         if (points[i].name === value.name) {
            targetPoint = points[i];
            break;
         }
      }

      if (!targetPoint) {
         return false;
      }

      targetPoint.update(value);
      return true;
   }

   beforeInit() {

      let labelsStyle = [{   // series name
         'text-anchor': 'middle',
         'fontSize': '14px',
         fontWeight: 'bold',
         color: '#000',
         'dominant-baseline': 'central'
      }, {                  // point label 
         fontSize: '12px',
         color: null,
         'dominant-baseline': 'central'
      }, {
         // dataLabels
      }];

      if (!this.options.labelsStyle) {
         this.options.labelsStyle = labelsStyle;
      } else {
         labelsStyle.forEach((style, i) => {
            if (this.options.labelsStyle.length < i) {
               this.options.labelsStyle.push(style);
            } else {
               this.options.labelsStyle[i] = Utils.extends(style, this.options.labelsStyle[i])
            }
         });
      };

      console.log(this.options.labelsStyle);

      this.chartOptions = Utils.merge({
         chart: {
            marginTop: 30,
            marginLeft: 30,
            marginRight: 30
         },
         title: {
            text: null
         },
         tooltip: {
            headerFormat: '',
            pointFormat: '<span style="color:{point.color}">\u25CF</span> {point.name}: <b>{point.custom.value}</b><br/>'
         }
      }, this.options);

      this.chartOptions.series.type = 'petal';
      this.chartOptions.series.dataLabels = {
         enabled: true,
         format: '{point.custom.value}',
         style: this.options.labelsStyle[2]
      };
      let series = this.chartOptions.series,
         total = series.data.length - 1,
         step = 360 / total;

      series.data = series.data.filter(d => {
         if (d.name === 'comm') {
            series.name = d.value;
            return false;
         }
         return true;
      });

      series.data.forEach((d, i) => {
         d.y = 1;
         d.custom = {
            rotation: i * step,
            value: d.value
         }
      });
      this.chartOptions.series = [series];
   }
}

export default Venn;