

## 韦恩图

### 构造函数及配置

	import Venn from './charts/Venn';

	let veen = new Venn(el, options);

默认配置如下（默认不包含 data 和 categories）：


	{
		chart: {
			margin: 40,
			events: {
				pointClick: function (point) {
					console.log(point)
				}
			}
		},
		title: {
			text: null,
			align: 'center',
			style: {
				"color": "#333333",
				"fontSize": "18px"
			}
		},
		dataLabels: {
			format: '{point.y}',
			style: {
				fontSize: '12px',
				color: '#000',
				fontWeight: 'bold',
				'text-anchor': 'middle',
				'dominant-baseline': 'mathematical'
			}
		},
		legend: {
			itemStyle: {
				fontSize: '12px',
				color: '#000'
			}
		},
		categories: [
			'P0_RvsP0_L',
			'TP60_LvsP0_L'
		],
		data: [
			34857,
			5037,
			3706
		],
		colors: ['#e5b1ff', '#ffef99']
	}


其中 data、categories、colors 根据不同的数据数量有所不同，具体请参数例子：https://demo.jianshukeji.com/20210416/index.html?type=venn


### 事件及API 接口

#### 1. 区块点击事件

	chart.events.pointClick

参数：point 当前点击的区块，包含下标（index），值（y）等信息

#### 2. 动态更新

	venn.update(newOptions);

newOptions 为新的配置，可以是全量的配置，用于数据切换；也可以是部分配置，用于动态更新，例如：

	venn.update({
		title: {
			text: 'new Title'
		}
	});

	venn.update({
		"chart": {
			"margin": 30
		},
		"title": {
			"text": "venn2"
		},
		"dataLabels": {
			"format": "{point.y}"
		},
		"categories": [
			"P0_RvsP0_L",
			"TP60_LvsP0_L"
		],
		"data": [
			34857,
			5037,
			3706
		],
		"colors": [
			"#e5b1ff",
			"#ffef99"
		]
	})


## 差异表达基因聚类


### 构造函数及配置

	import TreeMap from './charts/TreeMap';

	let treemap = new TreeMap(el, options);

参数配置参考：https://demo.jianshukeji.com/20210416/index.html?type=treemap


##### 1. 树分组（指针对 x 轴有效）

	xAxis: {
		tree: [],
		treeGroup: [{
			name: 'C', // 名字，
			color: '#00dae0', // 颜色
			x: [0]     // 包含的值，例如 x 轴 0， 1， 5 是 C 组，那么 x 的值是： [0, 1, 5],
		},{
			//..
		}]
	}

### 事件及动态更新

#### 1. 更新坐标的配置（包括标签样式，是否展示）

	treemap.update({
		'xAxis[1]': { // 或  yAxis[1]
			labels: {
				style: // ..
				enabled: true || false
			}
		}
	})

#### 2. 更新树


1）是否展示

	treemap.update({
		tree: {
			enabled: true || false
		}
	})

2）尺寸

	treemap.update({
		tree: {
			size: [20, 15] // 左侧的树宽度占比，上部的树高度占比
		}
	})

3）线条宽度及颜色

	treemap.update({
		plotOptions: {
			tree: {
				borderWidth: 1,
				borderColor: '#aaa'
			}
		}
	})



## GO富集分析散点图

### 构造函数及配置

	import Scatter from './charts/Scatter';

	let scatter = new Scatter(el, options);

配置请参考：https://demo.jianshukeji.com/20210416/index.html?type=scatter

### 动态更新

	scatter.update(newOptions)


## 雷达图

### 构造函数及配置

	import Polar from './charts/Polar';
	
	let polar = new Polar(el, options);

参数配置参考：https://demo.jianshukeji.com/20210416/index.html?type=polar



### 动态更新


#### Abundance 颜色

	polar.update({
		abundanceColor: ['abundance A color', 'abundance B color']
	})

#### Log2 颜色

	polar.update({
		polarColor: ['log2 >0 颜色', 'log2 <0 颜色']
	})
