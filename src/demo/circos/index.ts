import { Chart } from "@/index";
import { Demo } from "../index";
import { links } from "./data";

const series = [
  {
    type: "circos",
    data: links,
    nodeWidth: 14,
    dataLabels: {
      enabled: false,
      style: {
        fontWeight: "normal",
      },
    },
    subNode: {
      enabled: false,
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
    let chart = new Chart(container, "circos", {
      series: series,
    });
    return chart;
  },
} as Demo;
