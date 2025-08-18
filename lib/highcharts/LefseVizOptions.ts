import Lefse from "./Lefse";
import { getBasicOptions } from "./VizOptions";

export default function (this: Lefse) {
  const options = (this.obj.chart as any).options;
  console.log(options);
  return [
    getBasicOptions(options),
    {
      name: "数据列配置",
      code: "tree",
      items: [
        {
          key: "plotOptions.arcbubble.marker.borderWidth",
          type: "number",
          name: "线条粗细",
          options: {
            value: 1,
          },
        },
        {
          key: "plotOptions.arcbubble.minSize",
          type: "number",
          name: "气泡最小大小",
          options: {
            value: options.plotOptions.arcbubble.minSize,
          },
        },
        {
          key: "plotOptions.arcbubble.maxSize",
          type: "number",
          name: "气泡最大大小",
          options: {
            value: options.plotOptions.arcbubble.maxSize,
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
    {
      name: "图例",
      code: "legend",
      items: [
        // {
        //   key: "legend.title.style",
        //   name: "标题样式",
        //   type: "font",
        //   options: {
        //     value: options.legend.title.style,
        //   },
        // },
        {
          key: "legend.itemStyle",
          name: "图例1：文字样式",
          type: "font",
          options: {
            value: options.legend.itemStyle,
          },
        },
        // {
        //   key: "legend.title.text",
        //   name: "图例1：文字",
        //   type: "text",
        //   options: {
        //     value: this.options.legend.title.text,
        //   },
        // },
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
          key: "legends[0].itemStyle",
          name: "图例2：文字样式",
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
