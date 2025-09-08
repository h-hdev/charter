export default class Renderer {
  container: HTMLElement;
  root: HTMLElement | SVGElement | HTMLCanvasElement;
  constructor(container: HTMLElement) {
    this.container = container;
    this.root = this.init();
  }

  init(): HTMLElement | SVGElement | HTMLCanvasElement {
    const div = document.createElement("div");
    this.container.appendChild(div);
    return div;
  }

  group(id: string) {}
}
