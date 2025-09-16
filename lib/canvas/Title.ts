import Utils from "@/utils";
import Konva from "konva";
import { Plot } from "@/Charter";
import KnovaUtils from "@/utils/Knova";

export interface ITitleOptions {
  text: string | null;
  x: number;
  y: number;
  align: "left" | "right" | "center";
  verticalAlign: "top" | "bottom" | "middle";
  style: {
    color: string;
    fontSize: string;
    fontFamily: string;
    fontWeight: string;
    textBaseline: string;
    textAlign: string;
  };
}

const defaultOptions: ITitleOptions = {
  text: null,
  x: 0,
  y: 0,
  align: "center",
  verticalAlign: "top",
  style: {
    color: "#000",
    fontSize: "14px",
    fontFamily: "",
    fontWeight: "normal",
    textBaseline: "",
    textAlign: "",
  },
};

export default class Title {
  layer: Konva.Layer;

  // @ts-ignore
  style: {
    color: string;
    fontWeight: string;
    fontSize: string;
    fontFamily: string;
    textBaseLine: string;
    textAlign: string;
  };
  // text: string | null;
  // @ts-ignore
  bbox: { x: number; y: number; width: number; height: number };
  containerSize: [number, number];

  obj: Konva.Text | undefined;

  // @ts-ignore
  options: ITitleOptions;

  plot: Plot;

  constructor(
    options: Partial<ITitleOptions>,
    layer: Konva.Layer,
    containerSize: [number, number],
    plot: Plot,
  ) {
    this.containerSize = containerSize;
    this.layer = layer;
    this.plot = plot;

    this.setOptions(options);

    // const { style, text, bbox } = this.setOptions({
    //   // ...defaultOptions,
    //   ...options,
    // } as any);

    // this.style = style;
    // this.bbox = bbox;
    // this.text = text;

    this.render();
  }

  setOptions(options: Partial<ITitleOptions>) {
    this.options = Utils.merge(this.options || defaultOptions, options);

    let textAlign: any = "center",
      x: number = this.containerSize[0] / 2,
      textBaseLine: any = "top",
      y: number = 0,
      align = this.options.align,
      verticalAlign = this.options.verticalAlign;

    if (align && align !== "center") {
      if (align === "left") {
        x = 0;
        textAlign = "start";
      } else if (align === "right") {
        x = this.containerSize[0];
        textAlign = "end";
      }
    }

    if (verticalAlign && verticalAlign !== "top") {
      if (verticalAlign === "bottom") {
        textBaseLine = "bottom";
        y = this.containerSize[1];
      } else if (verticalAlign === "middle") {
        textBaseLine = "middle";
        y = this.containerSize[1] / 2;
      }
    }

    this.style = {
      color: this.options.style.color || "#000",
      fontWeight: this.options.style.fontWeight || "normal",
      fontSize: this.options.style.fontSize,
      fontFamily:
        this.options.style.fontFamily ||
        `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif`,
      textAlign,
      textBaseLine,
    };

    this.bbox = {
      x: x + (this.options.x || 0),
      y: y + (this.options.y || 0),
      width: 0,
      height: 0,
    };

    return this.options;
  }

  update(options: Partial<ITitleOptions>) {
    this.setOptions(options);
    this.render();
  }

  render() {
    if (!this.options.text) {
      if (this.obj) {
        this.obj.destroy();
        this.obj = undefined;
      }
      return;
    }

    const layer = this.layer;

    const textAttrs = {
      x: this.bbox.x,
      y: this.bbox.y,
      text: this.options.text,
      fontSize: parseInt(this.style.fontSize.replace("px", "")),
      fontFamily: this.style.fontFamily,
      fill: this.style.color,
      draggable: true,
      dragBoundFunc: function (this: any, pos: any) {
        return KnovaUtils.dragLimitInLayer(this, layer, pos);
      },
    };

    if (!this.obj) {
      this.obj = new Konva.Text(textAttrs);
      this.layer.add(this.obj);

      this.obj.on("dblclick", () => {
        this.plot.emit("textEdit", {
          key: "title",
          text: this.options.text,
        });
      });

      // this.obj.on("dragstart", () => {});
      // this.obj.on("dragmove", () => {});
    } else {
      this.obj.setAttrs(textAttrs);
    }

    // this.context.fillStyle = this.style.color;
    // this.context.font = `${this.style.fontWeight} ${this.style.fontSize} ${this.style.fontFamily}`;
    // this.context.textAlign = this.style.textAlign as any;
    // this.context.textBaseline = this.style.textBaseLine as any;
    // this.context.fillText(this.text, this.bbox.x, this.bbox.y);
  }
}
