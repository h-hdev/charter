import Circos from "./Circos";

export default function (this: Circos) {
  const options = (this.obj.chart as any).options;
  return [
    {
      name: "基础配置",
      code: "basic",
      items: [
        {
          key: "colors",
          type: "color",
          name: "色系",
          options: {
            values: options.colors,
          },
        },
      ],
    },
    {
      name: "数据列",
      code: "series",
      items: [
        {
          key: "series[0].dataLabels.enabled",
          type: "checkbox",
          name: "数据标签是否展示",
          options: {
            value: options.series[0].dataLabels.enabled,
          },
        },
        {
          key: "series[0].dataLabels.style",
          type: "font",
          name: "数据标签样式",
          options: {
            value: this.options.series[0].dataLabels.style,
          },
        },
        {
          key: "series[0].subNode.enabled",
          type: "checkbox",
          name: "是否展示外层环",
          options: {
            value: this.options.series[0].subNode.enabled || true,
          },
        },
        {
          key: "series[0].subNode.count",
          type: "number",
          name: "外层环数量",
          options: {
            value: this.options.series[0].subNode.count,
            attr: {
              min: 0,
              max: 2,
            },
          },
        },
      ],
    },
    // {
    //   name: "柱形图",
    //   code: "column",
    //   items: [
    //     {
    //       key: "yAxis[1].gridLineWidth",
    //       type: "number",
    //       name: "网格线宽度",
    //       options: {
    //         value: this.options.yAxis[1].gridLineWidth,
    //       },
    //     },
    //     {
    //       key: "yAxis[1].gridLineColor",
    //       type: "color",
    //       name: "网格线颜色",
    //       options: {
    //         value: options.yAxis[1].gridLineColor,
    //       },
    //     },
    //     {
    //       key: "yAxis[1].gridLineDashStyle",
    //       type: "select",
    //       name: "网格线样式",
    //       options: {
    //         items: [
    //           {
    //             name: "实线",
    //             value: "Solid",
    //           },
    //           {
    //             name: "虚线",
    //             value: "Dash",
    //           },
    //           {
    //             name: "点线",
    //             value: "Dot",
    //           },
    //           {
    //             name: "短虚线",
    //             value: "ShortDash",
    //           },
    //         ],
    //         value: 1, //this.options.yAxis[1].gridLineDashStyle,
    //       },
    //     },
    //     {
    //       key: "yAxis[1].tickInterval",
    //       type: "number",
    //       name: "网格刻度间隔",
    //       options: {
    //         value: this.options.yAxis[1].tickInterval,
    //       },
    //     },
    //   ],
    // },
    // {
    //   name: "图例",
    //   code: "legend",
    //   items: [
    //     {
    //       key: "legend.title.style",
    //       name: "标题样式",
    //       type: "font",
    //       options: {
    //         value: this.options.legend.title.style,
    //       },
    //     },
    //     {
    //       key: "legend.itemStyle",
    //       name: "文字样式",
    //       type: "font",
    //       options: {
    //         value: options.legend.itemStyle,
    //       },
    //     },
    //     {
    //       key: "legend.title.text",
    //       name: "图例1：文字",
    //       type: "text",
    //       options: {
    //         value: this.options.legend.title.text,
    //       },
    //     },
    //     {
    //       key: "legend.layout",
    //       name: "布局",
    //       type: "select",
    //       options: {
    //         items: [
    //           {
    //             name: "水平",
    //             value: "horizontal",
    //           },
    //           {
    //             name: "垂直",
    //             value: "vertical",
    //           },
    //         ],
    //         value: 1,
    //       },
    //     },
    //     {
    //       key: "legend.align",
    //       name: "水平对齐",
    //       type: "select",
    //       options: {
    //         items: [
    //           {
    //             name: "居左",
    //             value: "left",
    //           },
    //           {
    //             name: "居中",
    //             value: "center",
    //           },
    //           {
    //             name: "居右",
    //             value: "right",
    //           },
    //         ],
    //         value: 0,
    //       },
    //     },
    //     {
    //       key: "legend.verticalAlign",
    //       name: "垂直对齐",
    //       type: "select",
    //       options: {
    //         items: [
    //           {
    //             name: "顶部",
    //             value: "top",
    //           },
    //           {
    //             name: "居中",
    //             value: "middle",
    //           },
    //           {
    //             name: "底部",
    //             value: "bottom",
    //           },
    //         ],
    //         value: 0,
    //       },
    //     },
    //     {
    //       key: "legends[0].title.text",
    //       name: "图例2：文字",
    //       type: "text",
    //       options: {
    //         value: this.options.legends[0].title.text,
    //       },
    //     },
    //     {
    //       key: "legends[0].layout",
    //       name: "布局",
    //       type: "select",
    //       options: {
    //         items: [
    //           {
    //             name: "水平",
    //             value: "horizontal",
    //           },
    //           {
    //             name: "垂直",
    //             value: "vertical",
    //           },
    //         ],
    //         value: 1,
    //       },
    //     },
    //     {
    //       key: "legends[0].align",
    //       name: "水平对齐",
    //       type: "select",
    //       options: {
    //         items: [
    //           {
    //             name: "居左",
    //             value: "left",
    //           },
    //           {
    //             name: "居中",
    //             value: "center",
    //           },
    //           {
    //             name: "居右",
    //             value: "right",
    //           },
    //         ],
    //         value: 0,
    //       },
    //     },
    //     {
    //       key: "legends[0].verticalAlign",
    //       name: "垂直对齐",
    //       type: "select",
    //       options: {
    //         items: [
    //           {
    //             name: "顶部",
    //             value: "top",
    //           },
    //           {
    //             name: "居中",
    //             value: "middle",
    //           },
    //           {
    //             name: "底部",
    //             value: "bottom",
    //           },
    //         ],
    //         value: 0,
    //       },
    //     },
    //   ],
    // },
  ];
}
