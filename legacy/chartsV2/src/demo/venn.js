import Venn from "../charts/Venn";
import Demo from "./Demo";

export default () => {
  window.vennDemo = new Demo(
    "app",
    Venn,
    [
      {
        chart: {
          margin: 30,
        },
        title: {
          text: "venn2",
        },
        plotOptions: {
          venns: {
            dataLabels: {
              format: "{point.y}",
            },
          },
        },
        // data: [
        // 	{
        // 		"name": "CK1",
        // 		"value": 1026
        // 	},
        // 	{
        // 		"name": "CK2",
        // 		"value": 990
        // 	},
        // 	{
        // 		"name": "CK1_CK2",
        // 		"value": 2493
        // 	}],
        categories: ["P0_RvsP0_L", "TP60_LvsP0_L"],
        data: [34857, 5037, 3706],
        colors: ["#e5b1ff", "#ffef99"], //['#d1b5e5', '#9cdced']
        // colors: ["#d1b5e5", "#9cdced", "#809cd5", "#fac9d1", "#f4c8e3"]
      },
      {
        title: {
          text: "venn3",
        },
        plotOptions: {
          venns: {
            dataLabels: {
              format: "{point.index}",
            },
          },
        },
        data: [
          {
            name: "CK1",
            value: 666,
          },
          {
            name: "CK2",
            value: 656,
          },
          {
            name: "CK3",
            value: 546,
          },
          {
            name: "CK1_CK2",
            value: 706,
          },
          {
            name: "CK1_CK3",
            value: 360,
          },
          {
            name: "CK2_CK3",
            value: 334,
          },
          {
            name: "CK1_CK2_CK3",
            value: 1787,
          },
        ],
        colors: ["#d4bae7", "#9cdced", "#b0eadf"],
        // colors: ["#d1b5e5", "#809cd5", "#568fb9", "#8ca5c6", "#9cdced", "#abe9dd", "#69c9cd"]
      },
      {
        title: {
          text: "venn4",
        },

        plotOptions: {
          venns: {
            dataLabels: {
              format: "{point.index}",
            },
          },
        },
        data: [
          {
            name: "CK1",
            value: 634,
          },
          {
            name: "CK2",
            value: 620,
          },
          {
            name: "CK3",
            value: 513,
          },
          {
            name: "TN1",
            value: 1159,
          },
          {
            name: "CK1_CK2",
            value: 676,
          },
          {
            name: "CK1_CK2_CK3",
            value: 1580,
          },
          {
            name: "CK1_CK2_CK3_TN1",
            value: 207,
          },
          {
            name: "CK1_CK2_TN1",
            value: 30,
          },
          {
            name: "CK1_CK3",
            value: 337,
          },
          {
            name: "CK1_CK3_TN1",
            value: 23,
          },
          {
            name: "CK1_TN1",
            value: 32,
          },
          {
            name: "CK2_CK3",
            value: 318,
          },
          {
            name: "CK2_CK3_TN1",
            value: 16,
          },
          {
            name: "CK2_TN1",
            value: 36,
          },
          {
            name: "CK3_TN1",
            value: 33,
          },
        ],
        colors: ["#b2caf6", "#ffeb81", "#df9fff", "#81ff81"],
      },
      {
        title: {
          text: "venn5",
        },
        plotOptions: {
          venns: {
            dataLabels: {
              format: "{point.index}",
            },
          },
        },
        legend: {
          itemStyle: {
            fontSize: "14px",
            color: "#000",
          },
        },
        data: [
          {
            name: "CK1",
            value: 621,
          },
          {
            name: "CK1_CK2",
            value: 673,
          },
          {
            name: "CK1_CK2_CK3",
            value: 1537,
          },
          {
            name: "CK1_CK2_CK3_TN1",
            value: 71,
          },
          {
            name: "CK1_CK2_CK3_TN1_TN2",
            value: 136,
          },
          {
            name: "CK1_CK2_CK3_TN2",
            value: 43,
          },
          {
            name: "CK1_CK2_TN1",
            value: 11,
          },
          {
            name: "CK1_CK2_TN1_TN2",
            value: 19,
          },
          {
            name: "CK1_CK2_TN2",
            value: 3,
          },
          {
            name: "CK1_CK3",
            value: 331,
          },
          {
            name: "CK1_CK3_TN1",
            value: 6,
          },
          {
            name: "CK1_CK3_TN1_TN2",
            value: 17,
          },
          {
            name: "CK1_CK3_TN2",
            value: 6,
          },
          {
            name: "CK1_TN1",
            value: 6,
          },
          {
            name: "CK1_TN1_TN2",
            value: 26,
          },
          {
            name: "CK1_TN2",
            value: 13,
          },
          {
            name: "CK2",
            value: 607,
          },
          {
            name: "CK2_CK3",
            value: 312,
          },
          {
            name: "CK2_CK3_TN1",
            value: 4,
          },
          {
            name: "CK2_CK3_TN1_TN2",
            value: 12,
          },
          {
            name: "CK2_CK3_TN2",
            value: 6,
          },
          {
            name: "CK2_TN1",
            value: 10,
          },
          {
            name: "CK2_TN1_TN2",
            value: 26,
          },
          {
            name: "CK2_TN2",
            value: 13,
          },
          {
            name: "CK3",
            value: 503,
          },
          {
            name: "CK3_TN1",
            value: 10,
          },
          {
            name: "CK3_TN1_TN2",
            value: 23,
          },
          {
            name: "CK3_TN2",
            value: 10,
          },
          {
            name: "TN1",
            value: 245,
          },
          {
            name: "TN1_TN2",
            value: 914,
          },
          {
            name: "TN2",
            value: 398,
          },
        ],
        colors: ["#ffbf81", "#ffe093", "#8fc8ff", "#e6b4e4", "#a2e6c0"],
      },
    ],
    [
      {
        name: "图表配置",
        code: "common",
        items: [
          {
            key: "title.text",
            name: "标题内容",
            type: "text",
          },
          {
            key: "title.style",
            type: "font",
            name: "标题样式",
          },
          {
            key: "plotOptions.venns.dataLabels.format",
            name: "数据标签内容",
            type: "text",
          },
          {
            key: "plotOptions.venns.dataLabels.style",
            type: "font",
            name: "数据标签样式",
          },
          {
            key: "legend.itemStyle",
            type: "font",
            name: "图例标签样式",
          },
          {
            key: "colors",
            type: "color",
            name: "颜色",
            setValue: (value) => {
              return {
                values: value,
              };
            },
          },
        ],
      },
      {
        name: "尺寸及位置",
        code: "size-position",
        items: [
          {
            type: "size",
            key: "size",
            name: "尺寸",
            options: {
              value: {
                w: 600,
                h: 500,
                suffix: "px",
              },
            },
          },
          {
            type: "size",
            key: "position",
            name: "位置",
            options: {
              value: {
                w: 0,
                h: 0,
                suffix: "px",
              },
            },
            getValue: (value) => {
              value.x = value.w;
              value.y = value.h;
              delete value.w;
              delete value.h;
              return value;
            },
          },
        ],
      },
      {
        name: "下载图片",
        code: "export",
        items: [
          {
            name: "格式",
            key: "type",
            type: "select",
            options: {
              items: [
                {
                  name: "SVG",
                },
                {
                  name: "PNG",
                },
                {
                  name: "JPG",
                },
                {
                  name: "PDF",
                },
              ],
              value: 0,
            },
          },
          {
            name: "文件名",
            key: "filename",
            type: "text",
            options: {
              value: "venn",
            },
          },
        ],
      },
    ],
    {
      filename: "venn",
      chartSize: {
        w: 600,
        h: 500,
      },
    },
  );
};
