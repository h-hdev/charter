
import Polar from '../charts/Polar';
import Demo from './Demo';

export default () => {

	window.polarDemo = new Demo('app', Polar, [
		{
			chart: {
				spacing: 50
			},
			title: {
				text: '雷达图'
			},
			
			data: [
				["TraesCS4D02G206200", -4.5073638621847, 133.448236576895, 3031.1037998069],
				["TraesCS7B02G241800", 5.28017075908105, 412.10837061287, 10.8098796954728],
				["novel.13786", 4.92388310121812, 624.632421214064, 20.7231937327825],
				["TraesCS3B02G358700", 8.10707746629295, 495.521217145043, 1.7439087729951],
				["novel.7896", 6.41314141896097, 499.241602326721, 5.55795540059432],
				["novel.12255", 10.940567614839, 2180.63351641622, 1.18503147605415],
				["TraesCS3B02G597900", 6.28774402054098, 758.767836052693, 9.13211964481833],
				["TraesCS2A02G534400", -3.74846226509328, 28.5853097969306, 385.056881009625],
				["TraesCS4A02G301600", -6.16244171554212, 3.22810171483722, 229.506210623776],
				["TraesCS4A02G099000", -3.11594634541655, 548.078242377156, 4751.276732243],
				["TraesCS2B02G565000", -4.09316640282971, 25.5639522852474, 439.241723458102],
				["TraesCS7B02G047300", 3.14093240180362, 1640.15432089465, 186.211539080871],
				["TraesCS2D02G529500", 2.15845764265059, 1830.61343925646, 409.963581560115],
				["novel.352", 20.0467057826696, 859.732334003391, 0],
				["novel.10787", 12.3682619380448, 1074.33492714001, 0],
				["novel.11179", 5.67936777958797, 1131.31255613767, 22.38197186264],
				["TraesCS3D02G320500", 3.24304480285616, 794.222345784511, 84.2663847727104],
				["novel.9326", 4.92496004892829, 367.389930959514, 12.398660359825],
				["TraesCS6B02G267800", -2.73951634186293, 80.3413128809481, 535.729426975654]
			],
			plotOptions: {
				polar: {
					dataLabels: {
						fixOpacity: 1,
						// decimals: 2,
						style: {
							fontSize: '10px'
						},
					}
				}
			},
			
			colors: ['#719d67', '#94bca5', 'red', 'green'],
			names: ['abundance of A', 'abundance of B', 'log2(fc)＞0', 'log2(fc) < 0']
		}
	], [{
		name: '图表配置',
		code: 'chart',
		items: [{
			key: 'chart.spacing',
			name: '内边距',
			type: 'number'
		}]
	}, {
		name: '标题及样式',
		code: 'common',
		items: [{
			key: 'title.text',
			name: '标题内容',
			type: 'text'
		},
		{
			key: 'title.style',
			type: 'font',
			name: '标题样式'
		}, {
			key: 'title.y',
			type: 'number',
			name: '竖直偏移'
		},
		{
			key: 'xAxis.labels.enabled',
			name: '是否展示名称',
			type: 'checkbox'
		}, {
			key: 'xAxis.labels.style',
			name: '名称文字样式',
			type: 'font'
		},
		{
			key: 'plotOptions.polar.dataLabels.style',
			name: '数据标签样式',
			type: 'font'
		},{
			key: 'plotOptions.polar.dataLabels.fixOpacity',
			name: '修改透明度（测试用）',
			type: 'number',
			options: {
				value: 1,
				attr: {
					step:0.1,
					min: 0,
					max: 1
				}
			}
		}
		]
	},
	{
		name: '图例',
		code: 'legend',
		items: [{
			key: 'legend.enabled',
			name: '是否展示',
			type: 'checkbox'
		}, {
			key: 'legend.itemStyle',
			name: '图例文字样式',
			type: 'font'
		}
			, {
			key: 'abundanceColor',
			type: 'color',
			name: 'Abundance 颜色',
			options: {
				values: ['#719d67', '#94bca5']
			}
		},{
			key: 'polarColor',
			type: 'color',
			name: 'Log2 颜色',
			options: {
				values: [ 'red', 'green']
			}
		}]
	},
	{
		name: '尺寸及位置',
		code: 'size-position',
		items: [{
			type: 'size',
			key: 'size',
			name: '尺寸',
			options: {
				value: {
					w: 800,
					h: 800,
					suffix: 'px'
				}
			}
		}, {
			type: 'size',
			key: 'position',
			name: '位置',
			options: {
				value: {
					w: 0,
					h: 0,
					suffix: 'px'
				}
			},
			getValue: value => {
				value.x = value.w;
				value.y = value.h;
				delete value.w;
				delete value.h;
				return value;
			}
		}]
	}, {
		name: '下载图片',
		code: 'export',
		items: [{
			name: '格式',
			key: 'type',
			type: 'select',
			options: {
				items: [{
					name: 'SVG'
				}, {
					name: 'PNG'
				}, {
					name: 'JPG'
				}, {
					name: 'PDF'
				}],
				value: 0
			}
		}, {
			name: '文件名',
			key: 'filename',
			type: 'text',
			options: {
				value: 'polar'
			}
		}]
	}], {
		filename: 'polar',
		size: {
			w: 800,
			h: 800
		}
	}
	);
}