import Network from "./Network";

export default function (this: Network) {
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
            value: true,
          },
        },
        {
          key: "series[0].dataLabels.style",
          type: "font",
          name: "数据标签样式",
          options: {
            value: options.series[0].dataLabels.style,
          },
        },
      ],
    },
  ];
}
