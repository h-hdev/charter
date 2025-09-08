import { ExportType, Plot } from "./Charter";

export default class HTMLCharter extends Plot {
  iframe: HTMLIFrameElement | undefined;

  src: string = "";

  eventHandler(ev: any) {
    if (ev.data.type === "ready") {
      (this as any).__charter__.emit("ready", ev.data);
    }
  }

  beforeInit(): void {
    const iframe = (this.iframe = document.createElement("iframe"));
    this.obj = {
      iframe,
    };
    this.iframe.style.width = "100%";
    this.iframe.style.height = "100%";
    this.iframe.style.border = "none";
    this.container.appendChild(this.iframe);

    this.src = this.templateOptions.src;

    window.addEventListener("message", (ev) => {
      this.eventHandler(ev);
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
      this.obj.adapter = (iframe.contentWindow as any)?.adapter;
      if (!this.obj.adapter) {
        throw new Error(`src page UnImplement HTML Chart adapter`);
      }
      this.obj.adapter.render(this.userOptions, this.templateOptions);
      this.emit("ready", this.getVizOptions());
    };
  }

  setOption(key: string, value: any): void {
    if (this.obj.adapter.setOption) {
      this.obj.adapter.setOption(key, value);
    } else {
      super.setOption(key, value);
    }
  }

  setOptions(options: Record<string, any>): void {
    console.log(options, "update");
    this.obj.adapter.update(options);
    // this.obj.iframe?.contentWindow?.postMessage(
    //   {
    //     type: "setOptions",
    //     data: options,
    //   },
    //   "*",
    // );
  }

  getVizOptions() {
    if (!this.obj.adapter) return null;
    //if (!this.iframe) return;
    //
    return this.obj.adapter.getVizOptions();
    // (this.iframe.contentWindow as any)?.getVizOptions(this.templateOptions);
    // throw new Error("Method not implemented.");
  }

  // setOption(key: string, value: any) {
  //   super.setOption(key, value);
  // }

  // @ts-ignore
  export(type: ExportType, filename: string): void {
    // console.log(type, filename, options);
    // throw new Error("Method not implemented.");
    //
    // this.obj.iframe?.contentWindow.postMessage(
    //   {
    //     type: "export",
    //     data: { type, filename },
    //   },
    //   "*",
    // );
  }
}
