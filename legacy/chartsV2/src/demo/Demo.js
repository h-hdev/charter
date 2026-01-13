import DOM from '../Utils/DOM';
import Utils from '../Utils/Utils';

export default class Demo {
	constructor(el, chartObj, data, inactiveOptions, demoOptions) {
		this.el = DOM.get(el);
		this.chartObj = chartObj;
		this.dataIndex = 0;
		this.data = data;
		this.inactiveOptions = inactiveOptions;
		this.demoOptions = demoOptions;
		this.init();
	}

	beforeInit() {
		this.chartOptions = this.data[this.dataIndex];
		this.exportOptions = {
			type: 'svg',
			filename: this.demoOptions.filename
		};
	}

	init() {
		this.beforeInit();
		this.initDOM();
		if (this.demoOptions.size) {
			this.chartContainer.style.width = this.demoOptions.size.w + 'px';
			this.chartContainer.style.height = this.demoOptions.size.h + 'px';
		}
		this.chart = new this.chartObj(this.chartContainer, this.chartOptions);
		this.inactive = new DatGui(this.optionsContainer, this.getinactiveValue(this.chart.options), (code, value, widget) => {
			if (widget.options.group === 'export') {
				this.exportOptions[code] = value;
				return false;
			}
			if (code === 'position' || code === 'size') {
				this.chart.update(code, value);
			} else {
				let newOptions = Utils.set({}, code, value);
				this.chart.update(newOptions);
			}
		});
		this.afterInit();
		this.addEvent();
	}


	initDOM() {
		this.root = DOM.append(this.el, 'div', 'chart-demo');
		let chartWrapper = DOM.append(this.root, 'div', 'chart-wrapper');
		this.chartContainer = DOM.append(chartWrapper, 'div', 'chart-container');
		let optionsEl = DOM.append(this.root, 'div', 'options');
		this.dataContainer = DOM.append(optionsEl, 'div', 'data-container');
		this.optionsContainer = DOM.append(optionsEl, 'div', 'options-container');

		if (this.data.length > 1) {
			let options = '';
			this.data.forEach((d, i) => {
				options += `<option value="${i}">${i + 2} 组数据</option>`
			});
			this.dataSelect = DOM.append(this.dataContainer, 'select', '', options, undefined, {
				value: this.dataIndex
			});
		}
		this.dataArea = DOM.append(this.dataContainer, 'pre', '', 'let options = ' + JSON.stringify(this.data[this.dataIndex], undefined, '  '));
	}

	afterInit() {
		this.button = DOM.append(this.optionsContainer, 'button', ['btn', 'btn-primary'], '下载', {
			'margin-left': '90px'
		});
		DOM.addEvent(this.button, 'click', () => {
			this.chart.exportChart(this.exportOptions.filename || 'venn', this.exportOptions.type.toLowerCase());
		});
	}

	addEvent() {
		if (this.dataSelect) {
			DOM.addEvent(this.dataSelect, 'change', () => {
				this.dataIndex = parseInt(this.dataSelect.value);
				this.chart.update(Utils.JSONCopy(this.data[this.dataIndex]), undefined, true);
				this.dataArea.innerHTML = 'let options = ' + JSON.stringify(this.data[this.dataIndex], undefined, '  ');
				let newOptions = this.getinactiveValue(this.chart.options);
				console.log(newOptions);
				newOptions.forEach(group => {
					group.items.forEach(options => {
						this.inactive.setOptions(options.key, options.options)
					})
				});
			});
		}
	}

	getValue(options, key) {
		if (key === 'size') {

			let size = {
				w: this.demoOptions.size.w,
				h: this.demoOptions.size.h,
				suffix: 'px'
			};


			if (options.chart) {
				if (options.chart.width) {
					size.w = options.chart.width;
				}

				if (options.chart.height) {
					size.h = options.chart.height;
				}
			}
			return
		} else if (key === 'position') {
			return {
				w: 0,
				h: 0,
				suffix: 'px'
			}
		}
		return Utils.get(options, key);
	}

	getinactiveValue(options) {
		let result = [],
			groupOptions = null;
		this.inactiveOptions.forEach(group => {
			groupOptions = {
				name: group.name,
				code: group.code,
				items: []
			};;

			group.items.forEach(item => {
				groupOptions.items.push({
					key: item.key,
					name: item.name,
					type: item.type,
					getValue: item.getValue,
					options: item.options || (item.setValue ? item.setValue(this.getValue(options, item.key)) : {
						value: this.getValue(options, item.key)
					})
				});
			})

			result.push(groupOptions);
		});
		return result;
	}
}