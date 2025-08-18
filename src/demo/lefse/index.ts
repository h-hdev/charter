import { Chart } from "@/index";
import { Demo } from "../index";
import nodeGroups from "./lefse_data";
import { ILefseOption } from "@/types/lefse";

const lefseOptions: ILefseOption = {
  groups: nodeGroups,
  groupPadding: 5,
  // highlight: {
  //   "__DEFAULT-COLOR__": "red",
  //   p__Firmicutes: "red",
  //   c__Clostridia: "green",
  //   p__Actinobacteriota: {
  //     node: "blue",
  //     color: "rgba(0, 255, 0, 0.8)",
  //     name: "b:p__Actinobacteriota",
  //   },
  //   o__Lachnospirales: {
  //     color: "rgba(0, 0, 255, 0.7)",
  //     name: "b:o__Lachnospirales",
  //   },
  // },
};

export default {
  name: "Lefse",
  code: "lefse",
  sampleData: {
    lefse: lefseOptions,
  },
  demo: (container: HTMLElement) => {
    let chart = new Chart(container, "lefse", {
      title: {
        text: "Cladogram",
      },
      lefse: lefseOptions,
      legend: {
        layout: "vertical",
        align: "left",
        verticalAlign: "top",
        floating: true,
      },
      tooltip: {
        format: "{point.name}: {point.z:.5f} at: {point.x}-{point.y}",
      },
      plotOptions: {
        arcarea: {
          dataLabels: {
            verticalAlign: "top",
            offsetY: 0.2,
            autoRotation: true,
          },
        },
      },
    });
    return chart;
  },
} as Demo;
