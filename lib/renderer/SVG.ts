import Renderer from "./Renderer";

export default class SVG extends Renderer {
  _NS = "http://www.w3.org/2000/svg";

  _createSVGElement(tag: string) {
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
  }

  group(id: string): SVGElement {
    let g = this._createSVGElement("g");
    g.id = id;
    return g;
  }

  init(): SVGElement {
    const svg = this._createSVGElement("svg");
    this.container.appendChild(svg);
    return svg;
  }
}
