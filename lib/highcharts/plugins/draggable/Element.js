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

  bbox;
  containerSize;

  targetObjectKey = "";
  updateOptionKey = "";

  constructor(elemet, chart) {
    this.element = elemet;
    this.chart = chart;
    this.object = this.getObject();
    this.containerSize = [
      this.chart.plotWidth + this.chart.plotLeft,
      this.chart.plotTop + this.chart.plotHeight,
    ];

    if (!this.object) {
      throw new Error(`1`);
    }
  }

  getBBox() {
    if (this.bbox) return this.bbox;

    let bound = this.element.getBoundingClientRect();
    let chartBound = this.chart.container.getBoundingClientRect();

    this.bbox = {
      x: bound.x - chartBound.x,
      y: bound.y - chartBound.y,
      width: bound.width,
      height: bound.height,
    };

    // // console.log(this.element);
    // const bbox = this.element.getBBox();
    // const ctm = this.element.getCTM();

    // if (ctm.b || ctm.c) {
    //   // rotation
    // }

    // bbox.x += ctm.e;
    // bbox.y += ctm.f;

    // this.bbox = bbox;
    // return bbox;
  }

  getObject() {
    return null;
  }

  static match = null;

  static is(target) {
    return false;
  }

  moveStart(mousedown, e) {
    this.getBBox();
  }

  moving(changed, e) {}

  getNewOptions(diff) {
    const options = this.getObjectPosition
      ? this.getObjectPosition()
      : this.targetObjectKey
        ? this.object[this.targetObjectKey].options
        : this.object.options;
    let newOptions = {
      x: (options.x || 0) + diff.x,
      y: (options.y || 0) + diff.y,
    };

    return this.updateOptionKey
      ? {
          [this.updateOptionKey]: newOptions,
        }
      : newOptions;
  }

  moveEnd(mousedown, mouseup, e) {
    let diff = {
      x: mouseup.x - mousedown.x,
      y: mouseup.y - mousedown.y,
    };

    let x = diff.x + this.bbox.x;
    if (x < 0) {
      diff.x = -this.bbox.x;
    } else if (x + this.bbox.width > this.containerSize[0]) {
      diff.x = this.containerSize[0] - this.bbox.width - this.bbox.x;
    }

    let y = diff.y + this.bbox.y;
    if (y < 0) {
      diff.y = -this.bbox.y;
    } else if (y + this.bbox.height > this.containerSize[1]) {
      diff.y = this.containerSize[1] - this.bbox.height - this.bbox.y;
    }

    const newOptions = this.getNewOptions(diff);

    this.object.update(newOptions);
  }

  getText() {
    return null;
  }

  setText(text) {
    return false;
  }
}
