import * as Highcharts from "highcharts";
import "highcharts/highcharts-more";

const app = document.querySelector("#app");

if (!app) {
  throw new Error("app");
}

const color = document.createElement("input");
color.type = "color";

app.appendChild(color);

const chartContainer = document.createElement("div");
app.appendChild(chartContainer);

const chart = Highcharts.chart(chartContainer, {
  series: [
    {
      type: "bubble",
      data: [
        [0, 10],
        [1, 23],
      ],
    },
    {
      type: "bubble",
      data: [
        [10, 20],
        [14, 2],
      ],
    },
  ],
});

color.value = chart.series[0].color as string;

color.addEventListener("change", (e: any) => {
  let colors = [...(chart.options.colors as string[])];
  colors[e.ctrlKey ? 1 : 0] = color.value;
  chart.update({ colors });
});
