function isMathed(target, match) {
  if (
    match &&
    match.tagName === target.tagName &&
    match.className === target.className.baseVal
  ) {
    return true;
  }
  return false;
}

export function getDragableElement(Elements, e, chart) {
  const ElementsKeys = Object.keys(Elements);
  let target = e.target;
  for (let i = 0; i < ElementsKeys.length; i++) {
    const constor = Elements[ElementsKeys[i]];
    if (isMathed(target, constor.match) || (constor.is && constor.is(target))) {
      return new constor(target, chart);
    }
  }
  return null;
}

export function getEdiableText(Elements, e, chart) {
  const ElementsKeys = Object.keys(Elements);
  let target = e.target;
  for (let i = 0; i < ElementsKeys.length; i++) {
    const constor = Elements[ElementsKeys[i]];
    if (!constor.textEditable) continue;
    if (isMathed(target, constor.match) || (constor.is && constor.is(target))) {
      return new constor(target, chart);
    }
  }
  return null;
}

export class TextEditor {
  constructor(chart, text, callback) {
    this.chart = chart;
    this.callback = callback;
    this.init();
    this.text = text;
    this.setText(text, true);
  }

  init() {
    this.input = document.createElement("input");
    this.input.style.position = "absolute";
    this.input.style.left = 0;
    this.input.style.top = 0;
    this.input.className = "text-editor";

    this.input.style.width = "200px";
    this.input.style.padding = "5px 10px";
    this.input.style.zIndex = 100;
    this.chart.container.parentNode.style.position = "relative";
    this.chart.container.parentNode.appendChild(this.input);

    this.input.addEventListener("blur", () => {
      this.end();
    });
  }

  setText(text, isInit) {
    if (!isInit) {
      this.text = text;
    } else {
      console.log("set tes");
    }
    this.input.style.display = "block";
    this.input.value = this.text;
    this.input.focus();
  }

  end() {
    this.input.style.display = "none";
    if (this.input.value !== this.text) {
      this.text = this.input.value;
      this.callback.call(this, this.input.value);
    }
  }
}

export default class Element {
  static textEditable = false;

  object;
  element;
  chart;

  constructor(elemet, chart) {
    this.element = elemet;
    this.chart = chart;
    this.object = this.getObject();
    if (!this.object) {
      throw new Error(`1`);
    }
  }

  getObject() {
    return null;
  }

  static match = null;

  static is(target) {
    return false;
  }

  moveStart(mousedown, e) {}

  moving(changed, e) {}

  moveEnd(mousedown, mouseup, e) {}

  getText() {
    return null;
  }

  setText(text) {
    return false;
  }
}
