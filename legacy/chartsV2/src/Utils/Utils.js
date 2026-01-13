import Highcharts from 'highcharts';
import chroma from 'chroma-js';

import  _get from 'lodash.get';

/** Used as references for various `Number` constants. */
const MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
const reIsUint = /^(?:0|[1-9]\d*)$/;




const Utils = {
	merge: Highcharts.merge,

	blendMultiply: (a, b) => {
		return chroma.blend(a, b, 'multiply').hex();
	},
	extends: (a, b) => {
		if (!a) {
			a = {};
		}

		if (!b) {
			return a;
		}

		Object.keys(b).forEach(key => {
			a[key] = b[key];
		})

		return a;
	},

	isObjEmpty: what => {
		return !what || typeof what !== 'object' || Object.keys(what).length === 0;
	},

	isArr: what => {
		return what && typeof what === 'object' && what.constructor.toString().includes('Array');
	},

	JSONCopy: obj => {
		return JSON.parse(JSON.stringify(obj));
	},

	isObj: what => {
		const type = typeof what;
		return what !== null && type === 'object';
	},

	isIndex: (what, length) => {
		const type = typeof what;
		length = length === undefined ? MAX_SAFE_INTEGER : length;
		return !!length &&
			(type === 'number' ||
				(type !== 'symbol' && reIsUint.test(what))) &&
			(what > -1 && what % 1 === 0 && what < length)
	},

	assignValue: (obj, key, value) => {
		const objValue = obj[key];

		if (!(Object.prototype.hasOwnProperty.call(obj, key) && Utils.eq(objValue, value)) || (value === undefined && !(key in object))) {
			obj[key] = value;
		}
	},

	// from: https://github.com/lodash/lodash/blob/master/eq.js
	eq: (value, other) => {
		return value === other || (value !== value && other !== other);
	},


	/**
		* from: https://github.com/lodash/lodash/blob/master/.internal/baseSet.js
	  * 通过 key 来设置 obj 的值
	  * key 的形式为 a.b.c，. 表示层次，例如 key 为 a.b.c 表示获取 obj { a: {b: {c: true }}} 中的 c 值
	  * @param obj 需要设置值的对象
	  * @param key 用 . 分隔层次的 key 值
	  * @param value 值
	  */
	set(obj, key, value, separator = '.') {
		
		let path = Utils.isArr(key) ? key : key.split(separator),
			length = path.length,
			lastIndex = length - 1,
			index = -1,
			parent = obj,
			k = null,
			newValue = null,
			objValue = null;
		while (parent !== null && ++index < length) {
			k = path[index];
			newValue = value;
			if (index !== lastIndex) {
				objValue = parent[k];
				newValue = Utils.isObj(objValue) ? objValue : (Utils.isIndex(path[index + 1]) ? [] : {});
			}
			Utils.assignValue(parent, k, newValue);
			parent = parent[k];
		}
		
		return obj;
	},

	get(obj, key, separator = '.') {
		// let path = Utils.isArr(key) ? key : key.split(separator),
		// 	index = 0,
		// 	length = path.length;
		// while (obj !== null && index < length) {

		// 	if (obj[path[index]] === undefined) {
		// 		return undefined;
		// 	}
		// 	obj = obj[path[index]];
		// 	index++;
		// }
		// return (index && index === length) ? obj : undefined;
		return _get(obj, key);
	},

	min: (a, b) => {

		console.log(a, b)
		return a > b ? b : a;
	},
	extend: (a, b) => {
      if (!a) {
         a = {};
      }

      if (!b) {
         return a;
      }
      Object.keys(b).forEach(key => {
         a[key] = b[key];
      });
      return a;
   },

	JSONStringify: obj => {
		return JSON.stringify(obj, (key, value) => {
			if(typeof value === 'function') {
				return value.toString();
			}
			return value;
		});
	}
};

export default Utils;