import { Charter } from "@/Charter";
import demos from "./demo";

const app: HTMLDivElement | null = document.querySelector("#app");
if (!app) {
  throw new Error();
}
app.className = "flex";

// const sampleData = document.createElement("div");
// sampleData.className = "w-[400px] h-full border panel";
// app.appendChild(sampleData);

const options = document.createElement("div");
options.className = "h-full border panel w-full";
options.style.padding = "2em";
options.style.width = "20%";
app.appendChild(options);

let title = document.createElement("h3");
title.innerText = "图表选择";
options.appendChild(title);
let select = document.createElement("select");
select.innerHTML = demos
  .map((d, i) => {
    return `<option value=${i}>${d.name}</option>`;
  })
  .join("");

options.appendChild(select);

select.addEventListener("change", () => {
  window.location.href = "index.html?t=" + demos[parseInt(select.value)].code;
  // createDemo(parseInt(select.value), true);
});

title = document.createElement("h3");
title.innerText = "示例数据";
options.appendChild(title);
const sampleData = document.createElement("pre");
// sampleData.style.width = "800px";
sampleData.style.maxHeight = "500px";
sampleData.style.overflowY = "auto";
sampleData.style.padding = "1em";
sampleData.className = "language-json";
options.appendChild(sampleData);

const interactiveContainer = document.createElement("div");
interactiveContainer.className = "h-full border panel w-full";
interactiveContainer.style.padding = "1em 2em";
interactiveContainer.style["overflowY"] = "auto";

app.appendChild(interactiveContainer);
interactiveContainer.style.width = "30%";

const chart = document.createElement("div");
chart.className = "h-full border panel";
chart.style.width = "50%";
app.appendChild(chart);

const chartContainer = document.createElement("div");
chartContainer.style.margin = "2em auto";
chartContainer.style.width = "1200px";
chartContainer.style.height = "1200px";
chart.appendChild(chartContainer);

let demo: Charter;

let interactive;
function createDemo(index: number, updateLocation?: boolean) {
  if (demo) {
    demo.destory();
  }
  demo = (window as any).demo = demos[index].demo(chartContainer);

  let interactiveOptions = demo.getVizOptions();
  if (interactiveOptions) {
    interactive = new (window as any).DatGui(
      interactiveContainer,
      demo.getVizOptions(),
      (code: string, value: any) => {
        // console.log(code, value);
        demo.setOption(code, value);
        // if (widget.options.group === 'export') {
        // 	this.exportOptions[code] = value;
        // 	return false;
        // }
        // if (code === 'position' || code === 'size') {
        // 	this.chart.update(code, value);
        // } else {
        // 	let newOptions = Utils.set({}, code, value);
        // 	this.chart.update(newOptions);
        // }
      },
    );
    // console.log(interactive);
  } else {
    demo.on("ready", (data: any) => {
      // if (ev.type === "ready") {
      interactive = new (window as any).DatGui(
        interactiveContainer,
        data,
        (code: string, value: any) => {
          console.log(code, value);
          demo.setOption(code, value);
          // if (widget.options.group === 'export') {
          // 	this.exportOptions[code] = value;
          // 	return false;
          // }
          // if (code === 'position' || code === 'size') {
          // 	this.chart.update(code, value);
          // } else {
          // 	let newOptions = Utils.set({}, code, value);
          // 	this.chart.update(newOptions);
          // }
        },
      );
      // }
    });
  }

  sampleData.innerHTML = JSON.stringify(
    demos[index].sampleData,
    undefined,
    " ",
  );

  if (updateLocation) {
    window.history.pushState(
      {
        page: "search",
      },
      "",
      "?t=" + demos[index].code,
    );
  }
}

const qs = new URLSearchParams(window.location.search);

let t = qs.get("t");

(window as any).qs = qs;
let index = 0;
if (t) {
  for (let i = 0; i < demos.length; i++) {
    if (demos[i].code === t) {
      index = i;
      break;
    }
  }
  select.value = index + "";
}
createDemo(index);
(window as any).hljs.highlightElement(sampleData);
