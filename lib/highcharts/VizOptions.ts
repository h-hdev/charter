export function getBasicOptions(options: any) {
  return {
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
      {
        key: "title.text",
        type: "text",
        name: "标题",
        options: {
          value: options.title.text,
        },
      },
      {
        key: "title.style",
        type: "font",
        name: "标题样式",
        options: {
          value: options.title.style,
        },
      },
    ],
  };
}
