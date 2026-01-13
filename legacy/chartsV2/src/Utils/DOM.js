import Utils from './Utils';
import Highcharts from 'highcharts';

const DOM = {

	addEvent: Highcharts.addEvent,

	get: el => {
		return typeof el === 'string' ? document.getElementById(el) : el;
	},


	/**
	 * 创建 DOM
	 * @param {String} tag DOM 的标签名
	 * @param {String | Array} classnames 类名，支持数组
	 * @param {String} innerHTML html 内容
	 * @param {Object} styles 样式对象
	 * @param {Object} attribs 属性对象
	 */
	createElement: (tag, classNames, innerHTML, styles, attribs) => {
		var res = false;

		if (typeof tag !== undefined) {
			res = document.createElement(tag);
		}

		if (classNames) {
			res.className = DOM.calcClassName(classNames);
		}

		if (innerHTML) {
			res.innerHTML = innerHTML;
		}

		if (styles) {
			DOM.styles(res, styles);
		}

		if (attribs) {
			Utils.extend(res, attribs);
		}

		return res;
	},

	/**
	 * 追加 Dom 到已经存在的 DOM 中
	 * @param parent 父级 DOM
	 * @param 后续的参数同 createElement
	 */
	append: (parent, tag, className, innerHTML, styles, attribs) => {
		var res = DOM.createElement(tag, className, innerHTML, styles, attribs);
		parent.appendChild(res);
		return res;
	},

	/**
	 * 设置属性
	*/
	setAttr: (node, attribs) => {
		if (node && attribs && !Utils.isObjEmpty(attribs)) {
			for (let key in attribs) {
				node.setAttribute(key, attribs[key]);
			}
		}
	},

	/**
	 * 设置样式
	 */
	styles: (nodes, style) => {
		// if (Utils.isArr(nodes)) {
		// 	nodes.forEach(function (node) {
		// 		DOM.style(node, style);
		// 	});
		// 	return nodes;
		// }

		if (nodes && nodes.style) {
			Object.keys(style).forEach(function (p) {
				nodes.style[p] = style[p];
			});
			return nodes;
		}
		return false;
	},

	/**
	 * 获取样式
	 * @param {DOM} node
	 * @param {String | undefined} properties 需要获取的样式 Key，为空则返回全部样式
	 */
	getStyles: (node, properties) => {
		let styles = window.getComputedStyle(node);
		if (properties) {
			return styles[properties];
		}
		return styles
	},

	/**
	 * 计算 className，支持数组和指定前缀
	 */
	calcClassName: classNames => {
		let classPre = 'js-';

		// 每个 Dom 的类前加 itushuo 后缀
		if (Utils.isArr(classNames)) {
			// 过滤为空的 class
			classNames = classNames.filter(c => {
				return c;
			});
			classNames = classNames.join(' ' + classPre);
		}

		return classPre + classNames
	},
};


export default DOM;