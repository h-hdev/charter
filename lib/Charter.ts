export interface IChartOptions {
  [key: string]: any;
}

const ExportFileType = ["png", "jpg", "svg", "pdf"] as const;

export type ExportType = (typeof ExportFileType)[number];

export abstract class VizBase {
  abstract render(): void;
  abstract setOptions(options: Record<string, any>): void;
  abstract getVizOptions(): any;
  abstract export(
    type: ExportType,
    filename: string,
    options?: IChartOptions,
  ): void;
}

export abstract class Plot extends VizBase {
  obj: any;
  container: HTMLElement;
  userOptions: IChartOptions;
  options: IChartOptions;
  templateOptions: ITemplateOptions;
  constructor(
    container: HTMLElement,
    options: IChartOptions,
    templateOptions: ITemplateOptions,
  ) {
    super();
    this.container = container;
    this.userOptions = { ...options };
    this.options = this._getOptions();
    // this.options = { ...this.userOptions };
    this.templateOptions = { ...templateOptions };
    this.init();
  }

  abstract _getOptions(): IChartOptions;

  init() {
    this.beforeInit();
    this.render();
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

export class Charter implements VizBase {
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
    template: string | ITemplateOptions,
    options: IChartOptions,
  ) {
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
  render(): void {
    this.#inst?.render();
  }
  getVizOptions() {
    return this.#inst?.getVizOptions();
  }
  export(type: ExportType, filename: string, options?: IChartOptions): void {
    this.#inst?.export(type, filename, options);
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
  }

  destory() {
    this.#inst?.destory();
    // TODO;
  }

  setOptions(options: Record<string, any>) {
    if (this.#inst) {
      this.#inst.setOptions(options);
    }
  }
}
