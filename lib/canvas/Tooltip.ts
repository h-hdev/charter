import "../css/Tooltip.css";
export interface ITooltipOptions {
  className: string;
}

class Tooltip {
  private container: HTMLElement;
  private size: {
    x: number;
    y: number;
    w: number;
    h: number;
  } = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  };

  root: HTMLElement;
  constructor(container: HTMLElement, options: Partial<ITooltipOptions>) {
    this.root = document.createElement("div");
    this.root.className = "tooltip " + (options.className || "");
    container.appendChild(this.root);
    this.container = container;
  }

  update(position: { x: number; y: number }, content?: string) {
    this.root.style.display = "block";
    if (content) {
      this.root.innerHTML = content;
      this.size.w = this.root.clientWidth;
      this.size.h = this.root.clientHeight;
    }
    this._alignTo(position);
  }

  _alignTo(position: { x: number; y: number }) {
    this.root.style.left = position.x - this.size.w / 2 + "px";
    this.root.style.top = position.y - this.size.h - 10 + "px";
  }

  hide() {
    this.root.style.display = "none";
  }

  show(position: { x: number; y: number }) {
    this.root.style.display = "block";
    this.update(position);
  }

  destory() {
    this.container.removeChild(this.root);
  }
}

export default Tooltip;
