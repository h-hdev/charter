import Konva from "konva";
import KnovaUtils from "@/utils/Knova";
import { merge } from "highcharts";
export interface ILegendOptions {
  enabled?: boolean;
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
  borderWidth?: number;
  borderColor?: string;
  background?: string;
  borderRadius?: number;
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
  group!: Konva.Group;
  itemsGroup!: Konva.Group;
  layer: Konva.Layer;
  background!: Konva.Rect;
  canvasSize: number[];
  items: ILegendItem[] = [];
  options: ILegendOptions;

  symbolWidth: number = 0;
  symbolHeight: number = 0;
  margin: number = 0;

  constructor(
    options: ILegendOptions,
    layer: Konva.Layer,
    canvasSize: number[],
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

  update(options: Partial<ILegendOptions>) {
    this.options = merge(this.options, options);

    this.render();
  }

  setItems(items: ILegendItemOptions[]) {
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
        fontSize: this.itemStyle.fontSize,
        fontStyle:
          (this.itemStyle.fontStyle ? this.itemStyle.fontStyle + " " : "") +
          this.itemStyle.fontWeight,
        fill: this.itemStyle.color,
        text: item.name,
        x: x + this.symbolWidth + this.options.symbolPadding,
        y: y, // + this.symbolHeight / 2,
      };

    if (!existItem) {
      const symbol = new Konva.Rect(symbolAttr);

      this.itemsGroup?.add(symbol);

      const text = new Konva.Text(textAttr);

      this.itemsGroup?.add(text);

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

    let tWidth = existItem.text.getWidth(),
      tHeight = existItem.text.getHeight();

    if (tHeight < this.symbolHeight) {
      existItem.text.setAttrs({
        y: textAttr.y + (this.symbolHeight - tHeight) / 2,
      });
      tHeight = this.symbolHeight;
    }

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
      x: this.padding,
      y: this.padding + this.titleHeight,
    };

    this.itemStyle = merge(
      {
        color: "#333333",
        cursor: "pointer",
        fontSize: "10px",
        fontWeight: "bold",
      },
      this.options.itemStyle,
    );

    this.itemStyle.fontSize = parseInt(this.itemStyle.fontSize);

    this.options.items.forEach((item, i) => {
      position = this.renderItem(item, i, position);
    });

    return this._updateBackground();
  }

  _updateBackground() {
    const groupBBox = this.itemsGroup.getClientRect();

    const gWidth = groupBBox.width,
      gHeight = groupBBox.height + this.titleHeight;

    this.background.setAttrs({
      x: 0, //-spacing[3],
      y: 0,
      width:
        (gWidth > this.titleWidth ? gWidth : this.titleWidth) +
        this.padding * 2,
      height: gHeight + this.padding * 2,
    });

    return {
      gWidth,
      gHeight,
    };
  }

  reflow() {}

  render() {
    if (this.options.enabled === false) {
      if (this.group) {
        this.group.setAttr("opacity", 0);
      }
      return false;
    }

    const layer = this.layer;
    if (!this.group) {
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

      this.itemsGroup = new Konva.Group({
        id: "legend-container",
      });

      this.layer.add(this.group);

      this.group.add(this.itemsGroup);

      this.background = new Konva.Rect({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fill: this.options.background || undefined,
        strokeWidth: this.options.borderWidth || 0,
        stroke: this.options.borderColor || "#000",
        cornerRadius: this.options.borderRadius || 0,
      });

      this.group.add(this.background);
    } else {
      this.group.setAttr("opacity", 1);
    }

    this.symbolWidth = this.options.symbolWidth || 20;
    this.symbolHeight = this.options.symbolHeight || 10;
    this.margin = this.options.margin || 12;
    this.padding = this.options.padding || 8;

    const titleOptions = this.options.title;

    this.titleHeight = 0;
    this.titleWidth = 0;

    if (titleOptions && titleOptions.text) {
      const style = {
        ...{
          fontSize: "14px",
          fontWeight: "bold",
          color: "#000",
        },
        ...titleOptions.style,
      };

      if (style.fontSize.endsWith("em")) {
        style.fontSize = parseFloat(style.fontSize) * 14;
      }

      const titleAttr = {
        fontSize: style.fontSize,
        fontStyle:
          (style.fontStyle ? style.fontStyle + " " : "") + style.fontWeight,
        fill: style.color,
        text: titleOptions.text,
        x: this.padding,
        y: this.padding, //-this.margin - style.fontSize - 5, // - this.symbolHeight - 10,
      };

      if (this.title) {
        this.title.setAttrs(titleAttr);
      } else {
        this.title = new Konva.Text(titleAttr);
        this.group.add(this.title);
      }

      this.titleHeight = this.title.getHeight() + this.padding;
      this.titleWidth = this.title.getWidth();
      // titleHeight = style.fontSize + 5;
      // let tWidth = existItem.text.getWidth(),
      //   tHeight = existItem.text.getHeight();
    } else if (this.title) {
      // this.title.
    }

    const { gWidth, gHeight } = this.renderItems();

    // gHeight += 20;

    // gHeight += this.symbolHeight;
    // let position: Postion = {
    //   x: 0,
    //   y: -this.margin,
    // };

    // this.options.items.forEach((item, i) => {
    //   position = this.renderItem(item, i, position);
    // });

    // const groupBBox = this.group.getClientRect();

    // const gWidth = groupBBox.width,
    //   gHeight = groupBBox.height;
    let x, y;

    const spacing = [
      this.canvasSize[2],
      this.canvasSize[3],
      this.canvasSize[4],
      this.canvasSize[5],
    ];

    this.background.setAttrs({
      x: 0, //-this.margin, //-spacing[3],
      y: 0, //-this.margin * 2 - this.titleHeight,
      width:
        (this.titleWidth > gWidth ? this.titleWidth : gWidth) +
        this.padding * 2,
      height: gHeight + this.padding * 2,
      fill: this.options.background || undefined,
      strokeWidth: this.options.borderWidth || 0,
      stroke: this.options.borderColor || "#000",
      cornerRadius: this.options.borderRadius || 0,
    });

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
        y = this.canvasSize[1] - gHeight - this.margin * 2;
        break;
      default:
        y = spacing[0] + this.margin;
    }

    this.group.position({
      x: x + (this.options.x || 0),
      y: y + (this.options.y || 0),
    });
  }
}
