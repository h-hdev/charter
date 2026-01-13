import Chart from './Chart'

class Scatter extends Chart {
  beforeInit() {
    this.defaultOptions = {
      chart: {
        inverted: true,
        plotBorderWidth: 1,
        plotBorderColor: '#000'
      },
      xAxis: {
        tickInterval: 1,
        lineWidth: 1,
        lineColor: '#000',
        tickLength: 5,
        tickWidth: 1,
        tickColor: '#000',
        reversed: false,
        labels: {
          allowOverlap: true,
          // maxStaggerLines: 1,
          staggerLines: 1,
          padding: 2,
          // overflow: 'allow',
          style: {
            color: '#666666',
            cursor: 'default',
            fontSize: '11px',
            textOverflow: 'ellipsis',
            // width: '100%'
          }
        },
        title: {
          x: -20,
          style: {
            fontSize: '12px',
            color: '#666'
          }
        },
        gridLineWidth: 1,
        type: 'category'
      },

      yAxis: {
        lineWidth: 1,
        lineColor: '#000',
        tickLength: 5,
        tickWidth: 1,
        tickColor: '#000',
        gridLineWidth: 1,
        title: {
          style: {
            fontSize: '12px',
            color: '#666'
          }
        },
        labels: {
          style: { color: '#666666', cursor: 'default', fontSize: '11px' }
        }
      },
      colorAxis: {
        reversed: false,
        labels: {
          // format: '{value:.2f}',
          formatter: function (dt) {
            //Math.log的参数不可以是负数，需加限制
            if ( dt.value > 0 && dt.value < 0.009  && dt.value !== 0) {
              var p = Math.floor(Math.log(dt.value) / Math.LN10)
              var n = parseFloat(dt.value) * Math.pow(10, -p)
              return n.toFixed(0) + 'e' + p
              // return parseFloat(dt.value)
            } else {
              return dt.value.toFixed(2)
            }
          },
          style: {
            fontSize: '10px'
          }
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        y: 20,
        bubbleLegend: {
          sizeBy: 'width',
          connectorDistance: 0,
          color: '#000',
          borderWidth: 0,
          enabled: true,
          labels: {
            align: 'right',
            allowOverlap: true,
            x: 15,
            format: '{value:.0f}'
          }
        }
      },

      plotOptions: {
        bub: {
          maxSize: 20,
          minSize: 2,
          states: {
            inactive: false
          }
        }
      },
      title: {
        style: { color: '#333333', fontSize: '18px' }
      }
    }

    // this.dataMaping = [
    // 	'richRatio',
    // 	'geneNumber',
    // 	'qValue'
    // ];
  }

  setOptions(options, isDefaultOptions) {
    // if (options.data) {
    // 	let series = {
    // 		data: [],
    // 		type: 'bub'
    // 	},
    // 		xAxis = {
    // 			categories: options.data.y
    // 		};

    // 	xAxis.categories.forEach((c, i) => {

    // 		let data = [i];
    // 		this.dataMaping.forEach(key => {
    // 			data.push(
    // 				options.data[key][i]
    // 			)
    // 		});
    // 		series.data.push(data);
    // 	});

    // 	delete options.data;

    // 	options.series = [series];

    // 	if (options.xAxis) {
    // 		options.xAxis.categories = xAxis.categories;
    // 	} else {
    // 		options.xAxis = xAxis;
    // 	}
    // 	delete options.data;
    // }
    // let xTitle = options.xAxis.title.text
    // let yTitle = options.yAxis.title.text
    // options.yAxis.title.text = xTitle
    // options.xAxis.title.text = yTitle
    super.setOptions(options, isDefaultOptions)
  }

  update(key, value, isDefaultOptions) {
    if (typeof key === 'object') {
      if (Object.keys(key)[0] === 'xAxis') {
        // key['yAxis'] = key['xAxis']
        // delete key['xAxis']
      } else if (Object.keys(key)[0] === 'yAxis') {
        // key['xAxis'] = key['yAxis']
        // delete key['yAxis']
        // key.xAxis.title = key.yAxis.title
      }
      if (Object.keys(key)[0] === 'legend') {
        this.chart.update(key,false)
        this.chart.reflow()
      } else {
        this.chart.update(key)
      }
    } else {
      super.update(key, value, isDefaultOptions)
    }
  }
}

export default Scatter
