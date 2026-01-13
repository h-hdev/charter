import DragableElement from "./DraggableElement";

import "./draggable.css";

export interface IDraggbelOptions {
  moveable: boolean;
  editable: boolean;
  fontStyle: boolean;
  bboxPadding: number;
}

const defaultDraggableOptions: IDraggbelOptions = {
  moveable: true,
  editable: false,
  fontStyle: false,
  bboxPadding: 5,
};

export type Position = { x: number; y: number };

export interface IRect extends Position {
  width: number;
  height: number;
}

type IRectKey = keyof IRect;

export interface IFont {
  text: string;
  style: {
    "font-family"?: string;
    "font-size": string;
    "font-weight"?: string;
    fontStyle?: string;
  };
}

export default class Draggable {
  container: HTMLElement;

  options: IDraggbelOptions;

  target: DragableElement | undefined;

  _startPosition: Position | undefined;

  font: IFont | undefined;

  #wrapper: HTMLDivElement;

  #icons: {
    container: HTMLDivElement;
    close: HTMLDivElement;
  };

  #fontContainer: HTMLDivElement;

  #events: Function[] = [];

  bbox: IRect | undefined;

  input: HTMLInputElement;

  changed: Position = { x: 0, y: 0 };

  constructor(container: HTMLElement, options?: IDraggbelOptions) {
    this.container = container;
    this.options = {
      ...defaultDraggableOptions,
      ...options,
    };

    this.#wrapper = document.createElement("div");
    this.#wrapper.className = "draggable-wrapper";

    this.container.appendChild(this.#wrapper);

    this.#fontContainer = document.createElement("div");
    this.#fontContainer.className = "font";
    this.#wrapper.appendChild(this.#fontContainer);

    this.input = document.createElement("input");
    this.input.className = "input";
    this.#fontContainer.appendChild(this.input);

    this.#icons = {
      container: document.createElement("div"),
      close: document.createElement("div"),
    };

    this.#addEvents();
  }

  #addEvent(el: HTMLElement, event: string, handler: (e: any) => void) {
    el.addEventListener(event, handler);
    this.#events.push(() => {
      el.removeEventListener(event, handler);
    });
  }

  #getEventPosition(e: any) {
    // e = this.chart.pointer.normalize(e);
    return {
      x: e.clientX,
      y: e.clientY,
    };
  }

  #addEvents() {
    this.#addEvent(this.#wrapper, "mousedown", (e: MouseEvent) => {
      const target: any = e.target;
      if (target === this.input) {
        //target.focus();
      }
      this.mousedown(e);
      e.stopPropagation();
      // e.preventDefault();
    });

    this.#addEvent(document.body, "mousemove", (e) => {
      if (this._startPosition) {
        let p = this.#getEventPosition(e);
        this.moving({
          x: p.x - this._startPosition.x,
          y: p.y - this._startPosition.y,
        });
        this._startPosition = p;
      }
    });

    this.#addEvent(document.body, "mouseup", (e) => {
      if (this._startPosition) {
        this.movEnd();
        this._startPosition = undefined;
      }
    });

    this.#addEvent(this.input, "change", (e) => {
      console.log(e.target.value);
      if (this.font) {
        this.font.text = this.input.value;
      }
    });

    // this.#addEvent(, event, handler)
  }

  moving(distance: Position) {
    if (!this.bbox) return;

    this.bbox.x += distance.x;
    this.bbox.y += distance.y;

    this.changed.x += distance.x;
    this.changed.y += distance.y;

    this.#wrapper.style.left = this.bbox.x + "px";
    this.#wrapper.style.top = this.bbox.y + "px";

    this.target?.onMoving(this.changed);
  }

  movEnd() {
    // if (!this._currentPosition || !this._startPosition) return;
    // let changed = {
    //   x: this._currentPosition.x - this._startPosition.x,
    //   y: this._currentPosition.y - this._startPosition.y,
    // };
    // console.log(changed);
    //
    // this.input.blur();
  }

  init() {}

  mousedown(e: MouseEvent) {
    this.target?.onStart(e);
    this._startPosition = this.#getEventPosition(e);
  }

  start(e: MouseEvent, target?: DragableElement) {
    if (target) {
      this.target = target;
    }
    if (!this.target) return false;

    this.#wrapper.style.display = "block";

    let bbox = this.target.getBBox();

    this.bbox = {
      x: bbox.x - this.options.bboxPadding,
      y: bbox.y - this.options.bboxPadding,
      width: bbox.width + this.options.bboxPadding * 2,
      height: bbox.height + this.options.bboxPadding * 2,
    };

    // this.mousedown(e);
    //this._startPosition = this.#getEventPosition(e);

    this.font = this.target.getFont();

    this.setStyle(this.bbox);

    if (bbox.rotation) {
      this.#wrapper.style.rotate = bbox.rotation + "deg";
    } else {
      this.#wrapper.style.removeProperty("rotate");
    }
    this.target.onStart(e);
  }

  setStyle(bbox: IRect) {
    if (this.font) {
      const style: any = this.font.style;
      Object.keys(style).forEach((key: any) => {
        this.input.style.setProperty(key, style[key]);
      });
      this.input.style.display = "block";
      this.input.value = this.font.text;
      //
      // this.input.innerText = this.font.text;
      // this.input.setAttribute("contenteditable", "plaintext-only");
      this.input.focus();
      bbox.x += 2; // border
      // bbox.width += 10;
    } else {
      this.input.style.display = "none";
    }

    const bboxToStyleKeyMap: Record<string, string> = {
      x: "left",
      y: "top",
    };

    (["x", "y", "width", "height"] as IRectKey[]).forEach((key: IRectKey) => {
      let value = bbox[key];
      // if (this.font && key === "width") {
      //   value += 10;
      // }
      this.#wrapper.style.setProperty(
        bboxToStyleKeyMap[key] || key,
        value + "px",
      );
    });

    this.#wrapper.style.display = "block";
  }

  #setStyles(el: HTMLElement, styles: Record<string, any>) {
    Object.keys(styles).forEach((key) => {
      el.style.setProperty(key, styles[key]);
    });
  }

  close() {
    if (!this.bbox || !this.target) return;

    this.#wrapper.style.display = "none";

    if (this.font) {
      this.font.text = this.input.value;
    }

    this.target.onEnd(this.changed, this.font);
    this.target.destory();

    this.bbox = undefined;
    this.changed = { x: 0, y: 0 };
    this.target = undefined;
    this._startPosition = undefined;
  }
}
