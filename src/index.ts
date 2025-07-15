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
options.className = "h-full border panel";
options.style.padding = "2em";
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
  createDemo(parseInt(select.value), true);
});

title = document.createElement("h3");
title.innerText = "示例数据";
options.appendChild(title);
const sampleData = document.createElement("pre");
sampleData.style.width = "800px";
sampleData.style.maxHeight = "500px";
sampleData.style.overflowY = "auto";
sampleData.style.padding = "1em";
sampleData.className = "language-json";
options.appendChild(sampleData);

const chart = document.createElement("div");
chart.className = "h-full border panel";
chart.style.width = "1200px";
app.appendChild(chart);

const chartContainer = document.createElement("div");
chartContainer.style.margin = "2em auto";
chartContainer.style.width = "1200px";
chartContainer.style.height = "1200px";
chart.appendChild(chartContainer);

let demo: any;
function createDemo(index: number, updateLocation?: boolean) {
  if (demo) {
    demo.destory();
  }
  demo = demos[index].demo(chartContainer);
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

let t = window.location.search.replace("?t=", "");
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
