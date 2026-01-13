import Venn from "./src/charts/Venn";
import TreeMap from "./src/charts/TreeMap";
import Scatter from "./src/charts/Scatter";
import Polar from "./src/charts/Polar";
import Utils from "./src/Utils/Utils";

const container = document.querySelector("#container");

const charts = {
  polar: Polar,
  venn: Venn,
  treemap: TreeMap,
  scatter: Scatter,
};

const getValue = function (options, key) {
  if (key === "size") {
    let size = {
      w: 800, //this.demoOptions.size.w,
      h: 800, //this.demoOptions.size.h,
      suffix: "px",
    };

    if (options.chart) {
      if (options.chart.width) {
        size.w = options.chart.width;
      }

      if (options.chart.height) {
        size.h = options.chart.height;
      }
    }
    return;
  } else if (key === "position") {
    return {
      w: 0,
      h: 0,
      suffix: "px",
    };
  }
  if (key === "yAxis.title.text") {
    console.log(options, key);
  }
  return Utils.get(options, key);
};

const getVizOptions = function (template, options) {
  let config;
  if (template.code === "venn") {
    config = [
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
            // getValue: (value) => {
            //   value.x = value.w;
            //   value.y = value.h;
            //   delete value.w;
            //   delete value.h;
            //   return value;
            // },
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
    ];
  } else if (template.code === "polar") {
    config = [
      {
        name: "图表配置",
        code: "chart",
        items: [
          {
            key: "chart.spacing",
            name: "内边距",
            type: "number",
          },
        ],
      },
      {
        name: "标题及样式",
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
            key: "title.y",
            type: "number",
            name: "竖直偏移",
          },
          {
            key: "xAxis[0].labels.enabled",
            name: "是否展示名称",
            type: "checkbox",
          },
          {
            key: "xAxis[0].labels.style",
            name: "名称文字样式",
            type: "font",
          },
          {
            key: "plotOptions.polar.dataLabels.style",
            name: "数据标签样式",
            type: "font",
          },
          {
            key: "plotOptions.polar.dataLabels.fixOpacity",
            name: "修改透明度（测试用）",
            type: "number",
            options: {
              value: 1,
              attr: {
                step: 0.1,
                min: 0,
                max: 1,
              },
            },
          },
        ],
      },
      {
        name: "图例",
        code: "legend",
        items: [
          {
            key: "legend.enabled",
            name: "是否展示",
            type: "checkbox",
          },
          {
            key: "legend.itemStyle",
            name: "图例文字样式",
            type: "font",
          },
          {
            key: "abundanceColor",
            type: "color",
            name: "Abundance 颜色",
            options: {
              values: ["#719d67", "#94bca5"],
            },
          },
          {
            key: "polarColor",
            type: "color",
            name: "Log2 颜色",
            options: {
              values: ["red", "green"],
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
                w: 800,
                h: 800,
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
            // getValue: (value) => {
            //   value.x = value.w;
            //   value.y = value.h;
            //   delete value.w;
            //   delete value.h;
            //   return value;
            // },
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
              value: "polar",
            },
          },
        ],
      },
    ];
  } else if (template.code === "scatter") {
    config = [
      {
        name: "图表配置",
        code: "common",
        items: [
          {
            key: "chart.marginLeft",
            name: "左轴标签宽度",
            type: "number",
            getValue: function (value) {
              console.log(value);
              return value === 0 ? undefined : value;
            },
          },
        ],
      },
      {
        name: "标题及样式",
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
            key: "yAxis[0].title.text",
            name: "X 轴标题",
            type: "text",
          },
          {
            key: "yAxis[0].title.style",
            name: "X 轴标题样式",
            type: "font",
          },
          {
            key: "yAxis[0].labels.style",
            name: "X 轴标签样式",
            type: "font",
          },
          {
            key: "xAxis[0].title.text",
            name: "Y 轴标题",
            type: "text",
          },
          {
            key: "xAxis[0].title.style",
            name: "Y 轴标题样式",
            type: "font",
          },
          {
            key: "xAxis[0].labels.style",
            name: "Y 轴标签样式",
            type: "font",
          },
        ],
      },
      {
        name: "图例",
        code: "legend",
        items: [
          {
            key: "legend",
            name: "位置",
            type: "select",
            options: {
              value: 1,
              items: [
                {
                  name: "左上角",
                  value: 0,
                },
                {
                  name: "右上角",
                  value: 1,
                },
                {
                  name: "右下角",
                  value: 2,
                },
                {
                  name: "左下角",
                  value: 3,
                },
              ],
            },
            getValue: function (value) {
              let result = {
                align: value === 0 || value === 3 ? "left" : "right",
                verticalAlign: value === 0 || value === 1 ? "top" : "bottom",
              };
              console.log(value, result);
              return result;
            },
          },
          {
            key: "legend",
            name: "偏移",
            type: "size",
            options: {
              value: {
                w: 0,
                h: 0,
                suffix: "px",
              },
            },
            getValue: function (value) {
              return {
                x: value.w,
                y: value.h,
              };
            },
          },
          {
            key: "colorAxis.stops",
            type: "color",
            name: "颜色",
            options: {
              values: ["#ff0000", "#81fe3e", "#3bfaf3", "#8342ff"],
              limit: {
                min: 2,
                max: 10,
              },
            },
            getValue: function (value) {
              let result = [],
                length = value.length - 1,
                step = 1 / length;

              value.forEach((v, i) => {
                result.push([i * step, v]);
              });

              return result;
            },
          },
        ],
      },
    ];
  } else if (template.code === "treemap") {
    config = [
      {
        name: "标题及文字",
        code: "common",
        items: [
          {
            key: "title.text",
            name: "标题",
            type: "text",
          },
          {
            key: "title.style",
            type: "font",
            name: "标题样式",
          },
          {
            key: "xAxis[1].labels.style",
            type: "font",
            name: "X轴标签样式",
          },
          {
            key: "yAxis[1].labels.enabled",
            type: "checkbox",
            name: "是否显示 Y 轴标签",
            options: {
              value: true,
            },
          },
          {
            key: "yAxis[1].labels.style",
            type: "font",
            name: "Y轴标签样式",
          },
        ],
      },
      {
        name: "树形样式",
        code: "tree",
        items: [
          {
            key: "tree.enabled",
            type: "checkbox",
            name: "是否显示树",
            options: {
              value: true,
            },
          },
          {
            key: "tree.size",
            type: "size",
            name: "树形大小",
            options: {
              value: {
                w: 20,
                h: 15,
                suffix: "%",
              },
            },
            getValue: function (value) {
              return [value.w, value.h];
            },
          },
          {
            key: "plotOptions.stree.borderWidth",
            type: "number",
            name: "线条宽度",
          },
          {
            key: "plotOptions.stree.borderColor",
            type: "color",
            name: "线条颜色",
          },
        ],
      },
      {
        name: "图例",
        code: "legend",
        items: [
          {
            key: "legend",
            name: "位置",
            type: "select",
            options: {
              value: 1,
              items: [
                {
                  name: "左上角",
                  value: 0,
                },
                {
                  name: "右上角",
                  value: 1,
                },
                {
                  name: "右下角",
                  value: 2,
                },
                {
                  name: "左下角",
                  value: 3,
                },
              ],
            },
            getValue: function (value) {
              let result = {
                align: value === 0 || value === 3 ? "left" : "right",
                verticalAlign: value === 0 || value === 1 ? "top" : "bottom",
              };
              console.log(value, result);
              return result;
            },
          },
          {
            key: "legend",
            name: "偏移",
            type: "size",
            options: {
              value: {
                w: 0,
                h: 0,
                suffix: "px",
              },
            },
            getValue: function (value) {
              return {
                x: value.w,
                y: value.h,
              };
            },
          },
          {
            key: "colorAxis.stops",
            type: "color",
            name: "颜色",
            options: {
              values: ["#0e0eff", "#fff", "#ff1919"],
              limit: {
                min: 2,
                max: 10,
              },
            },
            getValue: function (value) {
              let result = [],
                length = value.length - 1,
                step = 1 / length;

              value.forEach((v, i) => {
                result.push([i * step, v]);
              });

              return result;
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
                w: 400,
                h: 600,
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
              value: "TreeMap",
            },
          },
        ],
      },
    ];
  }

  if (config) {
    let result = [],
      groupOptions = null;
    config.forEach((group) => {
      groupOptions = {
        name: group.name,
        code: group.code,
        items: [],
      };

      group.items.forEach((item) => {
        groupOptions.items.push({
          key: item.key,
          name: item.name,
          type: item.type,
          getValue: item.getValue,
          options:
            item.options ||
            (item.setValue
              ? item.setValue(getValue(options, item.key))
              : {
                  value: getValue(options, item.key),
                }),
        });
      });

      result.push(groupOptions);
    });

    console.log(result);
    return result;
  }

  return null;
};

let chart = null;
let currentTemplate;

window.adapter = {
  render: (options, template) => {
    // console.log("adptror render");
    //
    if (!chart) {
      chart = new charts[template.code](container, options);

      currentTemplate = template;
      // e.source.postMessage(
      //   {
      //     type: "ready",
      //     data: getVizOptions(e.data.template, chart.chart.options),
      //   },
      //   e.origin,
      // );
    }
    //       } else {
    //       }
    //     }
  },

  getVizOptions() {
    return getVizOptions(currentTemplate, chart.chart.options);
  },

  exportChart: (filename, type) => {
    console.log(filename, type);
  },

  update: (key, value, isDefault) => {
    chart.update(key, value, isDefault);
  },
};
