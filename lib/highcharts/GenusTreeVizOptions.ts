import GenusTree from "./GenusTree";
import { getBasicOptions } from "./VizOptions";
export default function (this: GenusTree) {
  const options = (this.obj.chart as any).options;
  console.log(options);
  return [
    getBasicOptions(options),
    {
      name: "树相关配置",
      code: "tree",
      items: [
        {
          key: "series[0].color",
          type: "color",
          name: "线条默认颜色",
          options: {
            value: this.options.series[0].color,
          },
        },
        {
          key: "plotOptions.arctree.marker.borderWidth",
          // key: "series[0].marker.borderWidth",
          type: "number",
          name: "线条粗细",
          options: {
            value: this.options.series[0].lineWidth || 1,
          },
        },
        {
          key: "plotOptions.arcarea.dataLabels.style",
          name: "数据标签字体样式",
          type: "font",
          options: {
            value: this.options.plotOptions.arcarea.dataLabels.style,
          },
        },
      ],
    },
    {
      name: "柱形图",
      code: "column",
      items: [
        {
          key: "yAxis[1].gridLineWidth",
          type: "number",
          name: "网格线宽度",
          options: {
            value: this.options.yAxis[1].gridLineWidth,
          },
        },
        {
          key: "yAxis[1].gridLineColor",
          type: "color",
          name: "网格线颜色",
          options: {
            value: options.yAxis[1].gridLineColor,
          },
        },
        {
          key: "yAxis[1].gridLineDashStyle",
          type: "select",
          name: "网格线样式",
          options: {
            items: [
              {
                name: "实线",
                value: "Solid",
              },
              {
                name: "虚线",
                value: "Dash",
              },
              {
                name: "点线",
                value: "Dot",
              },
              {
                name: "短虚线",
                value: "ShortDash",
              },
            ],
            value: 1, //this.options.yAxis[1].gridLineDashStyle,
          },
        },
        {
          key: "yAxis[1].tickInterval",
          type: "number",
          name: "网格刻度间隔",
          options: {
            value: this.options.yAxis[1].tickInterval,
          },
        },
      ],
    },
    {
      name: "图例",
      code: "legend",
      items: [
        {
          key: "legend.title.text",
          name: "图例1:标题文字",
          type: "text",
          options: {
            value: this.options.legend.title.text,
          },
        },
        {
          key: "legend.title.style",
          name: "标题样式",
          type: "font",
          options: {
            value: this.options.legend.title.style,
          },
        },
        {
          key: "legend.itemStyle",
          name: "文字样式",
          type: "font",
          options: {
            value: options.legend.itemStyle,
          },
        },
        {
          key: "legend.layout",
          name: "布局",
          type: "select",
          options: {
            items: [
              {
                name: "水平",
                value: "horizontal",
              },
              {
                name: "垂直",
                value: "vertical",
              },
            ],
            value: 1,
          },
        },
        {
          key: "legend.align",
          name: "水平对齐",
          type: "select",
          options: {
            items: [
              {
                name: "居左",
                value: "left",
              },
              {
                name: "居中",
                value: "center",
              },
              {
                name: "居右",
                value: "right",
              },
            ],
            value: 0,
          },
        },
        {
          key: "legend.verticalAlign",
          name: "垂直对齐",
          type: "select",
          options: {
            items: [
              {
                name: "顶部",
                value: "top",
              },
              {
                name: "居中",
                value: "middle",
              },
              {
                name: "底部",
                value: "bottom",
              },
            ],
            value: 0,
          },
        },
        {
          key: "legends[0].title.text",
          name: "图例2：标题文字",
          type: "text",
          options: {
            value: this.options.legends[0].title.text,
          },
        },
        {
          key: "legends[0].title.style",
          name: "标题样式",
          type: "font",
          options: {
            value:
              this.options.legends[0].title.style || options.legend.title.style,
          },
        },

        {
          key: "legends[0].itemStyle",
          name: "文字样式",
          type: "font",
          options: {
            value:
              this.options.legends[0].itemStyle || options.legend.itemStyle,
          },
        },

        {
          key: "legends[0].layout",
          name: "布局",
          type: "select",
          options: {
            items: [
              {
                name: "水平",
                value: "horizontal",
              },
              {
                name: "垂直",
                value: "vertical",
              },
            ],
            value: 1,
          },
        },
        {
          key: "legends[0].align",
          name: "水平对齐",
          type: "select",
          options: {
            items: [
              {
                name: "居左",
                value: "left",
              },
              {
                name: "居中",
                value: "center",
              },
              {
                name: "居右",
                value: "right",
              },
            ],
            value: 0,
          },
        },
        {
          key: "legends[0].verticalAlign",
          name: "垂直对齐",
          type: "select",
          options: {
            items: [
              {
                name: "顶部",
                value: "top",
              },
              {
                name: "居中",
                value: "middle",
              },
              {
                name: "底部",
                value: "bottom",
              },
            ],
            value: 0,
          },
        },
      ],
    },
  ];
}
