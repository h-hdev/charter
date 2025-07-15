import { ExportType, IChartOptions, Plot } from "./Charter";

export default class HTMLCharter extends Plot {
  iframe: HTMLIFrameElement | undefined;

  src: string = "";

  beforeInit(): void {
    this.iframe = document.createElement("iframe");
    this.iframe.style.width = "100%";
    this.iframe.style.height = "100%";
    this.iframe.style.border = "none";
    this.container.appendChild(this.iframe);

    this.src = this.templateOptions.src;

    this.iframe.contentWindow?.addEventListener("message", (ev) => {
      console.log(ev);
    });
  }

  _getOptions() {
    return {};
  }

  destory(): void {
    if (this.iframe) {
      this.container.removeChild(this.iframe);
    }
  }

  render(): void {
    if (!this.iframe) return;
    const iframe = this.iframe;
    iframe.src = this.src;
    iframe.onload = () => {
      iframe.contentWindow?.postMessage(
        {
          type: "render",
          data: this.userOptions,
        },
        "*",
      );
    };
  }

  setOptions(options: Record<string, any>): void {
    if (!this.iframe) return;
    this.iframe.contentWindow?.postMessage({
      type: "setOptions",
      data: options,
    });
  }

  getVizOptions() {
    throw new Error("Method not implemented.");
  }

  export(type: ExportType, filename: string, options?: IChartOptions): void {
    console.log(type, filename, options);
    throw new Error("Method not implemented.");
  }
}
