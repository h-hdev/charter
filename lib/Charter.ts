import Utils from "@/utils/index.js";
import TextEditor from "./plugin/TextEditor";

export interface IChartOptions {
  [key: string]: any;
}

const ExportFileType = ["png", "jpg", "svg", "pdf"] as const;

export type ExportType = (typeof ExportFileType)[number];

class EventBus {
  _events: Record<string, Function[]> = {};
  on(eventName: string, handler: Function) {
    if (!this._events[eventName]) {
      this._events[eventName] = [];
    }
    this._events[eventName].push(handler);
  }

  emit(eventName: string, args: any) {
    if (!this._events[eventName]) return;
    this._events[eventName].forEach((e) => {
      e(args);
    });
  }
}

export abstract class VizBase extends EventBus {
  abstract render(callback?: Function): void;
  abstract setOptions(options: Record<string, any>): void;
  abstract setOption(key: string, value: any): void;
  abstract getVizOptions(): any;
  abstract export(
    type: ExportType,
    filename: string,
    options?: IChartOptions,
  ): void;
}

export abstract class Plot extends VizBase {
  obj: any = {};
  root: HTMLElement;
  container: HTMLDivElement;
  userOptions: IChartOptions;
  options: IChartOptions;
  templateOptions: ITemplateOptions;
  textEditor: TextEditor | undefined;
  constructor(
    container: HTMLElement,
    options: IChartOptions,
    templateOptions: ITemplateOptions,
  ) {
    super();

    this.root = container;
    this.container = document.createElement("div");
    this.container.className = "js_plot_container";
    this.container.style.position = "relative";
    this.container.style.width = "100%";
    this.container.style.height = "100%";
    this.root.appendChild(this.container);
    this.userOptions = { ...options };
    this.options = this._getOptions();
    // this.options = { ...this.userOptions };
    this.templateOptions = { ...templateOptions };
    this.init();
  }

  abstract _getOptions(): IChartOptions;

  init() {
    this.beforeInit();
    this.on("textEdit", (args: Record<string, any>) => {
      if (!this.textEditor) {
        this.textEditor = new TextEditor(
          this.container,
          {},
          (newText: string) => {
            this.emit("textUpdatd", {
              ...args,
              newText,
            });
          },
        );
      }
      this.textEditor.setText(args.text);
    });
    this.render();
    this.afterInit();
  }

  afterInit() {}
  setOption(key: string, value: any): void {
    // @ts-ignore
    key = key.replace(/\[(\d)\]/, (match, p1) => "." + p1);
    let options = Utils.set({}, key, value);

    this.setOptions({ ...options });
  }
  getObject(key: string): any {
    return this.obj[key];
  }
  abstract destory(): void;

  abstract beforeInit(): void;
}

export type PlotCstor = new (
  container: HTMLElement,
  options: IChartOptions,
  templateOptions: ITemplateOptions,
) => Plot;

export interface ITemplateOptions {
  id: string;
  [key: string]: any;
}

export class Charter extends EventBus implements VizBase {
  static #templates: Record<string, PlotCstor> = {};

  static register(template: string, cstor: PlotCstor) {
    if (Charter.#templates[template]) {
      throw new Error(`Error #1: template \`${template}\` existed.`);
    }
    Charter.#templates[template] = cstor;
  }

  _el: HTMLElement;
  _templateId: string;
  _templateOptions: ITemplateOptions = { id: "unset" };
  _options: IChartOptions;

  #inst: Plot | undefined;

  constructor(
    el: HTMLElement,
    options: IChartOptions,
    template: string | ITemplateOptions,
  ) {
    super();
    this._el = el;
    if (typeof template === "string") {
      this._templateId = template;
    } else {
      this._templateId = template.id;
      this._templateOptions = template;
    }
    this._options = {
      ...options,
    };

    this.#init();
  }

  // on(eventName: string, handler: Function) {

  // }

  render(callback?: Function): void {
    this.#inst?.render(callback);
  }
  getVizOptions(): any[] {
    return this.#inst?.getVizOptions();
  }
  export(type: ExportType, filename: string, options?: IChartOptions): void {
    this.#inst?.export(type, filename, options);
  }

  exportChart(filename: string, type: ExportType) {
    this.export(type, filename);
  }

  getObject(key: string) {
    return this.#inst?.getObject(key);
  }

  #init() {
    if (!Charter.#templates[this._templateId]) {
      throw new Error(
        `Error #2: template \`${this._templateId}\` do not exist.`,
      );
    }
    this.#inst = new Charter.#templates[this._templateId](
      this._el,
      this._options,
      this._templateOptions,
    );
    (this.#inst as any).__charter__ = this;

    // this.#inst.on = this.on;
    // this.#inst.emit = this.emit;
    //
    this.#inst.on("ready", (data: any) => {
      this.emit("ready", data);
    });
  }

  destory() {
    this.#inst?.destory();
    // TODO;
  }

  setOption(key: string, value: any) {
    if (this.#inst) {
      this.#inst.setOption(key, value);
    }
  }

  setOptions(options: Record<string, any>) {
    if (this.#inst) {
      this.#inst.setOptions(options);
    }
  }
}
