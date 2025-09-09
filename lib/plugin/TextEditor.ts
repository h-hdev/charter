export interface ITextEditorOptions {}

const defaultOptions: ITextEditorOptions = {};

export default class TextEditor {
  container: HTMLElement;
  options: ITextEditorOptions;
  input: HTMLInputElement;
  text: string = "";
  callback: Function;
  constructor(
    container: HTMLElement,
    options: Partial<ITextEditorOptions>,
    callback: Function,
  ) {
    this.container = container;
    this.options = {
      ...defaultOptions,
      ...options,
    };
    this.callback = callback;

    this.input = document.createElement("input");

    this.init();
  }

  init() {
    this.input.className = "text-edit-input";

    this.container.appendChild(this.input);
    this.input.style.position = "absolute";
    this.input.style.left = "0";
    this.input.style.top = "0";
    this.input.style.padding = "5px 10px";
    this.input.style.width = "200px";
    this.input.style.zIndex = "100";
    this.input.addEventListener("blur", () => {
      this.end();
    });
  }

  setText(text: string) {
    this.text = text;
    this.input.style.display = "block";
    this.input.value = text;
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
