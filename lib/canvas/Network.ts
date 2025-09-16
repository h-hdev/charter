import { ExportType, IChartOptions, Plot } from "@/Charter";
import Highcharts from "highcharts/esm/highcharts.js";
import * as d3 from "d3";
import Utils from "@/utils";
// import Title from "./title";
import Konva from "konva";
import Legend from "./legend";
import Title from "./Title";
import KnovaUtils from "@/utils/Knova";

export interface INetworkOptions {
  // colors: string[];
  node: {
    minSize: number;
    maxSize: number;
    lineWidth: number;
    lineColor: string;
    fillOpacity: number;
    dataMapping: Record<string, string>;
  };
  link: {
    lineWidth: number;
    lineColor: string;
    maxLength: number;
    minSize: number;
    maxSize: number;
    dataMapping: Record<string, string>;
  };
  legend?: any;
  dataLabels: {
    enabled: boolean;
    style: {
      fontSize: string;
      color: string;
      fontFamily: string;
      fontWeight: string;
    };
  };
}

interface Node {
  id: string;
  name: string;
  value: number;
  group?: string;
  data: Record<string, any>;
}

interface Link {
  source: string;
  target: string;
  value: number;
  data: Record<string, any>;
}

const defaultOptions: INetworkOptions = {
  node: {
    minSize: 1,
    maxSize: 20,
    lineWidth: 1,
    lineColor: "#fff",
    fillOpacity: 0.8,
    dataMapping: {
      group: "group",
    },
  },
  link: {
    lineWidth: 1,
    lineColor: "#ddd",
    minSize: 1,
    maxSize: 3,
    maxLength: 20,
    dataMapping: {
      id: "id",
    },
  },
  dataLabels: {
    enabled: false,
    style: {
      fontSize: "10px",
      color: "#000",
      fontFamily: "",
      fontWeight: "normal",
    },
  },
};

// Simple merge target to source
function merge(source: Record<string, any>, target: Record<string, any>) {
  Object.keys(target).forEach((key: string) => {
    if (!source[key]) {
      source[key] = target[key];
    } else if (typeof target[key] === "object") {
      merge(source[key], target[key]);
    } else {
      source[key] = target[key];
    }
  });

  return source;
}

export default class Network extends Plot {
  _getOptions(): IChartOptions {
    let r = merge(
      {
        legend: Highcharts.getOptions().legend,
        network: {
          ...defaultOptions,
        },
      },
      this.userOptions,
    );

    return r;
  }

  afterInit(): void {
    this.on("textUpdatd", (data: Record<string, any>) => {
      if (data.key === "title") {
        this.obj.title.update({
          text: data.newText,
        });
      }
    });
  }

  // override init(): void {
  //   this.beforeInit();
  //   this.renderBasic();
  //   // this.render();
  // }

  // @ts-ignore
  render(callback?: Function): void {
    this.renderBasic();
    // this._render();
  }

  setOption(key: string, value: any): void {
    Utils.set(this.options, key, value);

    if (key === "network.node.dataMapping.group") {
      this.obj.color = d3.scaleOrdinal(this.options.colors);
      this.removeNodesAndLinks();
      this.obj.nodes = this.options.network.nodes.data.map((node: any) => {
        return this._toNode(node);
      });

      // @ts-ignore
      this.obj.links = this.options.network.links.data.map((link) => {
        return this._toLink(link);
      });

      this.obj.legend.update(this._getLegendItems());

      this.obj.simulation.nodes(this.obj.nodes);
      this.obj.simulation.force("link").links(this.obj.links);
      this.obj.simulation.alpha(1).restart();

      return;
    }

    if (key.startsWith("title.")) {
      this.obj.title.update(this.options.title);
      return;
    }

    Object.keys(this.obj.oom).forEach((ok) => {
      const oom = this.obj.oom[ok];
      if (oom.keys.includes(key)) {
        let values: any[] = [];
        oom.keys.forEach((k: string) => {
          values.push(Utils.get(this.options, k));
        });
        this.obj[ok] = oom.createOrUpdate.call(this, values);
      }
    });

    if (key === "colors") {
      this.obj.legend.update(this._getLegendItems());
    }

    let redraw = true;

    if (redraw) {
      this._render();
    }
  }

  // @ts-ignore
  setOptions(options: Record<string, any>): void {}

  getVizOptions() {
    let keys: any[] = [];
    this.userOptions.network.nodes.headers.forEach((h: string) => {
      if (h !== "id" && h !== "score") {
        keys.push({
          name: h,
          code: h,
        });
      }
    });

    let config = [
      {
        name: "基础配置",
        items: [
          {
            name: "色系",
            key: "colors",
            type: "color",
            // options: {
            //     values: network.options.colors,
            // },
          },
          {
            name: "标题文字",
            key: "title.text",
            type: "text",
          },
          {
            name: "标题样式",
            key: "title.style",
            type: "font",
          },
        ],
      },

      {
        name: "图形配置",
        items: [
          {
            name: "气泡最小大小",
            key: "network.node.minSize",
            type: "number",
            options: {
              value: 3,
            },
          },
          {
            name: "气泡最大大小",
            key: "network.node.maxSize",
            type: "number",
            options: {
              value: 20,
            },
          },
          {
            name: "气泡透明度",
            key: "network.node.fillOpacity",
            type: "number",
            options: {
              min: 0,
              max: 1,
              step: 0.1,
            },
          },

          {
            name: "线条颜色",
            key: "network.link.lineColor",
            type: "color",
            options: {
              value: "#999",
            },
          },

          {
            name: "线条最小宽度",
            key: "network.link.minSize",
            type: "number",
            options: {
              // value: "#999",
            },
          },
          {
            name: "线条最大宽度",
            key: "network.link.maxSize",
            type: "number",
            options: {
              // value: "#999",
            },
          },
          {
            name: "数据标签开关",
            key: "network.dataLabels.enabled",
            type: "checkbox",
          },
          {
            name: "数据标签样式",
            key: "network.dataLabels.style",
            type: "font",
          },
          // {
          //   name: "线条大小",
          //   key: "network.link.lineWidth",
          //   type: "number",
          // },
        ],
      },
      {
        name: "数据绑定",
        items: [
          {
            name: "Node Group",
            type: "select",
            key: "network.node.dataMapping.group",
            options: {
              value: 0,
              items: keys,
            },
          },
        ],
      },
    ];

    let options = this.options;

    config.forEach((group) => {
      group.items.forEach((item: any) => {
        if (item.type === "select") return;
        let value = Utils.get(options, item.key);
        if (!item.options) {
          item.options = { value };
        } else {
          item.options.value = value;
        }

        if (item.key === "colors") {
          // delete item.options.value;
          item.options.values = this.options.colors;
        }
      });
    });

    return config;
  }

  // @ts-ignore
  export(type: ExportType, filename: string, options?: IChartOptions): void {
    KnovaUtils.export(type, filename, this.obj.stage, this.obj.mainLayer);
  }

  _getLegendItems() {
    let _nodeGroupMap: Record<string, boolean> = {};
    const result: { name: string; color: string }[] = [];
    this.obj.nodes.map((n: any) => {
      const group = n.group;
      if (!_nodeGroupMap[group]) {
        _nodeGroupMap[group] = true;
        result.push({
          name: group,
          color: this.obj.color(group),
        });
      }
    });

    return result;
  }

  renderBasic() {
    if (this.obj.title) return;

    const titleOptions: any = merge(
      (Highcharts.getOptions() as any).title,
      this.options.title,
    );

    this.obj.title = new Title(
      titleOptions,
      this.obj.mainLayer,
      this.obj.size,
      this,
    );

    this.options.legend.items = this._getLegendItems();

    this.obj.legend = new Legend(
      this.options.legend,
      this.obj.mainLayer,
      this.obj.size,
    );
  }
  _render() {
    this.obj.links.forEach((l: any) => {
      this.drawLink(l);
    });
    this.obj.nodes.forEach((node: any) => {
      this.drawNode(node);
    });
  }

  removeNodesAndLinks() {
    // @ts-ignore
    this.obj.nodes.forEach((node) => {
      if (node.graph) {
        node.graph.destroy();
      }
    });
    // @ts-ignore
    this.obj.links.forEach((link) => {
      if (link.graph) {
        link.graph.destroy();
      }
    });
  }

  drawLink(link: any) {
    const linkAttrs = {
      points: [link.source.x, link.source.y, link.target.x, link.target.y],
      stroke: this.options.network.link.lineColor,
      strokeWidth: this.obj.linkWidthScale(link.value),
    };
    if (!link.graph) {
      link.graph = new Konva.Line(linkAttrs);
      this.obj.mainLayer.add(link.graph);
    } else {
      link.graph.setAttrs(linkAttrs);
    }
  }

  drawNode(node: any) {
    const radius = this.obj.radiusScale(node.value);
    const color = this.obj.color(node.group);
    const nodeAttr = {
      radius,
      x: node.x,
      y: node.y,
      fill: color,
      opacity: this.options.network.node.fillOpacity,
    };
    if (!node.graph) {
      node.graph = new Konva.Circle(nodeAttr);
      this.obj.mainLayer.add(node.graph);
    } else {
      node.graph.setAttrs(nodeAttr);
    }

    if (
      this.options.network.dataLabels !== undefined &&
      this.options.network.dataLabels.enabled === false
    ) {
      if (node.dataLabel) {
        node.dataLabel.destroy();
        node.dataLabel = null;
      }

      return false;
    }

    const dataLabelsConfig = {
      text: node.name,
      x: node.x,
      y: node.y - radius * 2,
      fontSize: parseInt(this.options.network.dataLabels.style.fontSize),
      fill: this.options.network.dataLabels.style.color || "#000",
      fontStyle: this.options.network.dataLabels.style.fontWeight || "normal",
    };
    if (node.dataLabel) {
      node.dataLabel.setAttrs(dataLabelsConfig);
    } else {
      node.dataLabel = new Konva.Text(dataLabelsConfig);
      this.obj.mainLayer.add(node.dataLabel);
    }

    node.dataLabel.setAttr(
      "x",
      dataLabelsConfig.x - node.dataLabel.width() / 2,
    );
  }

  _toNode(node: any): Node {
    const dm = this.options.network.node.dataMapping;
    const nd: Node = {
      id: node[dm.id || "id"],
      name: node[dm.name || "name"],
      value: node[dm.value || "value"],
      group: node[dm.group || "group"],
      data: node,
    };
    if (!nd.id || !nd.name || nd.value === undefined) {
      throw new Error(``);
    }
    return nd;
  }

  _toLink(link: any): Link {
    const dm = this.options.network.link.dataMapping;
    const ld: Link = {
      source: link[dm.source || "source"],
      target: link[dm.target || "target"],
      value: link[dm.value || "value"],
      data: link,
    };
    if (!ld.source || !ld.target || ld.value === undefined) {
      throw new Error(``);
    }
    return ld;
  }

  beforeInit(): void {
    const objectOptionsMapping: Record<
      string,
      {
        keys: string[];
        createOrUpdate: (
          this: Network,
          values: any[],
          isUpdate?: boolean,
        ) => any;
      }
    > = {
      color: {
        keys: ["colors"],
        // @ts-ignore
        createOrUpdate: function (values: any[], isUpdate?: boolean) {
          return d3.scaleOrdinal(values[0]);
        },
      },

      nodes: {
        keys: ["network.nodes", "network.node.dataBinding"],
        // @ts-ignore
        createOrUpdate: function (values: any[], isUpdate?: boolean) {
          return values[0].data.map((d: any) => {
            return this._toNode(d);
          });
        },
      },

      links: {
        keys: ["network.links", "network.link.dataBinding"],
        // @ts-ignore
        createOrUpdate: function (values: any[], isUpdate?: boolean) {
          return values[0].data.map((l: any) => {
            return this._toLink(l);
          });
        },
      },

      radiusScale: {
        keys: ["network.node.minSize", "network.node.maxSize"],
        // @ts-ignore
        createOrUpdate: function (values: any[], isUpdate?: boolean) {
          const scoreExtent: any = d3.extent(
            this.obj.nodes,
            (d: any) => d.value,
          );
          return scoreExtent[0] === scoreExtent[1]
            ? () => 10
            : d3.scaleLinear().domain(scoreExtent).range(values);
        },
      },
      linkWidthScale: {
        keys: ["network.link.minSize", "network.link.maxSize"],
        // @ts-ignore
        createOrUpdate: function (values: any[], isUpdate?: boolean) {
          const linkWidth: any = d3.extent(this.obj.links, (d: any) => d.value);
          return linkWidth[0] === linkWidth[1]
            ? () => 1
            : d3.scaleLinear().domain(linkWidth).range(values);
        },
      },
    };

    const networkOptions = this.options.network;

    Object.keys(objectOptionsMapping).forEach((key) => {
      let values: any[] = [];
      objectOptionsMapping[key].keys.forEach((oks) => {
        values.push(Utils.get(this.options, oks));
      });
      this.obj[key] = objectOptionsMapping[key].createOrUpdate.call(
        this,
        values,
      );
    });

    this.obj.dpi = window.devicePixelRatio;

    const size = (this.obj.size = networkOptions.size || [
      this.container.clientWidth,
      this.container.clientHeight,
    ]);

    this.obj.linkDistance = Math.max(
      networkOptions.link.maxLength,
      Math.min(
        200,
        Math.sqrt(
          (this.obj.size[0] * this.obj.size[1]) / this.obj.nodes.length,
        ),
      ),
    );

    this.obj.stage = new Konva.Stage({
      container: this.container, // id of container <div>
      width: this.obj.size[0],
      height: this.obj.size[1],
    });

    this.obj.staticLayer = new Konva.Layer({
      listening: false,
    });

    this.obj.mainLayer = new Konva.Layer();

    this.obj.stage.add(this.obj.staticLayer);
    this.obj.stage.add(this.obj.mainLayer);

    this.obj.simulation = d3
      .forceSimulation(this.obj.nodes)
      .force(
        "link",
        d3
          .forceLink(this.obj.links)
          .id((link: any) => link.id)
          .distance(this.obj.linkDistance)
          .strength(1),
      )
      .force("charge", d3.forceManyBody())

      .force(
        "collide",
        d3.forceCollide().radius((d: any) => this.obj.radiusScale(d.value) + 2),
      )
      .force("center", d3.forceCenter(size[0] / 2, size[1] / 2))
      .force("x", d3.forceX(0).strength(0.02))
      .force("y", d3.forceY(0).strength(0.02))
      // .force(
      //     "center",
      //     d3.forceCenter(this.size[0] / 2, this.size[1] / 2),
      // )
      .on("tick", () => {
        this._render();
      })
      .on("end", () => {
        this._renderDataLabels();
      });

    this.obj.oom = objectOptionsMapping;
    this.addEvent();
  }

  addEvent() {
    const canvas = this.container;
    const simulation = this.obj.simulation;

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    // Update the subject (dragged node) position during drag.
    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    (d3.select(canvas) as any).call(
      d3
        .drag()
        .subject((event) => {
          const [px, py] = d3.pointer(event, canvas);

          return d3.least(this.obj.nodes, ({ x, y }) => {
            const dist2 = (x - px) ** 2 + (y - py) ** 2;
            if (dist2 < 400) return dist2;
          });
        })
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended),
    );
  }

  destory(): void {
    this.obj.stage.destory();
  }
}
