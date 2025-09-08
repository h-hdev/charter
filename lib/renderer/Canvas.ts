import Renderer from "./renderer";

export default class Canvas extends Renderer {
  init() {
    const canvas = document.createElement("canvas");
    this.container.appendChild(canvas);
    return canvas;
  }
}
