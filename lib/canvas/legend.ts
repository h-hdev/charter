import Konva from "konva";
import KnovaUtils from "@/utils/Knova";
export interface ILegendOptions {
  items: ILegendItemOptions[];
  layout: "horizontal" | "vertical";
  x: number;
  y: number;
  align: "left" | "right" | "center";
  verticalAlign: "top" | "bottom" | "middle";
  symbolWidth: number;
  symbolHeight: number;
  margin: number;
  itemMarginTop: number;
  itemMarginBottom: number;
  symbolPadding: number;
  itemDistance: number;
}

interface ILegendItemOptions {
  name: string;
  color: string;
}

interface ILegendItem extends ILegendItemOptions {
  symbol: Konva.Rect;
  text: Konva.Text;
}

type Postion = { x: number; y: number };

export default class Legend {
  group: Konva.Group | undefined;
  layer: Konva.Layer;
  canvasSize: [number, number];
  items: ILegendItem[] = [];
  options: ILegendOptions;

  symbolWidth: number = 0;
  symbolHeight: number = 0;
  margin: number = 0;

  constructor(
    options: ILegendOptions,
    layer: Konva.Layer,
    canvasSize: [number, number],
  ) {
    this.layer = layer;
    this.canvasSize = canvasSize;
    this.options = options;

    this.render();
  }

  setOptions(options: ILegendOptions) {
    return {
      items: options.items,
    };
  }

  update(items: ILegendItemOptions[]) {
    let minus = this.options.items.length - items.length;

    while (minus > 0) {
      this.items[this.items.length - 1].symbol.destroy();
      this.items[this.items.length - 1].text.destroy();
      this.items.length--;
      minus--;
    }

    this.options.items = items;

    this.renderItems();
  }

  renderItem(item: ILegendItemOptions, index: number, position: Postion) {
    let existItem = index >= this.items.length ? null : this.items[index];

    let x = position.x;
    let y = position.y; //+ this.options.itemMarginTop;

    const symbolAttr = {
        x,
        y,
        width: this.symbolWidth,
        height: this.symbolHeight,
        fill: item.color,
      },
      textAttr = {
        text: item.name,
        x: x + this.symbolWidth + this.options.symbolPadding,
        y: y, // + this.symbolHeight / 2,
      };

    if (!existItem) {
      const symbol = new Konva.Rect(symbolAttr);

      this.group?.add(symbol);

      const text = new Konva.Text(textAttr);

      this.group?.add(text);

      this.items.push({
        ...item,
        symbol,
        text,
      });
      existItem = this.items[this.items.length - 1];
    } else {
      existItem.symbol.setAttrs(symbolAttr);
      existItem.text.setAttrs(textAttr);
    }
    // .text(
    //   item.name,
    //   x + this.symbolWidth + this.options.symbolPadding,
    //   y + this.symbolHeight / 2,
    // )
    // .attr({})
    // .css({
    //   ...this.options.itemStyle,
    //   "dominant-baseline": "central",
    // })
    // .add(this.group);

    const tWidth = existItem.text.getWidth(),
      tHeight = existItem.text.getHeight();

    if (this.options.layout === "horizontal") {
      x +=
        this.symbolWidth +
        this.options.symbolPadding +
        tWidth +
        (this.options.itemDistance || 20);
    } else {
      y += tHeight + this.options.itemMarginBottom;
    }

    return {
      x: x,
      y: y,
    };
  }

  renderItems() {
    let position: Postion = {
      x: 0,
      y: -this.margin,
    };

    this.options.items.forEach((item, i) => {
      position = this.renderItem(item, i, position);
    });
  }

  render() {
    const layer = this.layer;
    this.group = new Konva.Group({
      x: 0,
      y: 0,
      id: "legend",
      draggable: true,
      zIndex: 20,
      dragBoundFunc: function (this: any, pos: any) {
        return KnovaUtils.dragLimitInLayer(this, layer, pos);
      },
    });

    this.layer.add(this.group);

    this.symbolWidth = this.options.symbolWidth || 20;
    this.symbolHeight = this.options.symbolHeight || 10;
    this.margin = this.options.margin || 12;

    this.renderItems();
    // let position: Postion = {
    //   x: 0,
    //   y: -this.margin,
    // };

    // this.options.items.forEach((item, i) => {
    //   position = this.renderItem(item, i, position);
    // });

    const groupBBox = this.group.getClientRect();

    const gWidth = groupBBox.width,
      gHeight = groupBBox.height;
    let x, y;

    const spacing = [10, 10, 10, 10];

    switch (this.options.align) {
      case "left":
        x = spacing[3] + this.margin;
        break;
      case "center":
        x = this.canvasSize[0] / 2 - gWidth / 2;
        break;
      case "right":
        x = this.canvasSize[0] - gWidth - this.margin;
        break;
      default:
        x = spacing[3] + this.margin;
    }

    switch (this.options.verticalAlign) {
      case "middle":
        y = this.canvasSize[1] / 2 - gHeight / 2;
        // y = spacing[0] + this.margin + this.chart.titleOffset[0] / 2;
        break;
      case "bottom":
        y = this.canvasSize[1] - gHeight - this.margin;
        break;
      default:
        y = spacing[0] + this.margin;
    }

    this.group.position({
      x,
      y,
    });
  }
}
