import { Chart } from "@/index";
import { Demo } from "../index";
import { links } from "./data";

const series = [
  {
    type: "circos",
    data: links,
    nodeWidth: 14,
    tick: false,
    dataLabels: {
      enabled: true,
      style: {
        color: "#333",
        fontSize: "12px",
        fontWeight: "normal",
      },
    },
    // tick: {
    //   enabled: false,
    // },
    subNode: {
      // enabled: false,
      offset: 100,
      tick: false,
      count: 2,
    },
  },
];
export default {
  name: "Circos",
  code: "circos",
  sampleData: series[0],
  demo: (container: HTMLElement) => {
    let chart = new Chart(
      container,
      {
        series: series,
      },
      "circos",
    );

    console.log(chart.getObject("chart"));

    return chart;
  },
} as Demo;
