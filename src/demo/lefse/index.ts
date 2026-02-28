import { Chart } from "@/index";
import { Demo } from "../index";
import nodeGroups from "./lefse_data";
import { ILefseOption } from "@/types/lefse";

const lefseOptions: ILefseOption = {
  groups: nodeGroups,
  groupPadding: 5,
  legend: {
    enabled: false,
  },
};

export default {
  name: "Lefse",
  code: "lefse",
  sampleData: {
    lefse: lefseOptions,
  },
  demo: (container: HTMLElement) => {
    let chart = new Chart(
      container,
      {
        title: {
          text: "Cladogram",
        },
        lefse: lefseOptions,
        legend: {
          enabled: false,
          layout: "horizontal",
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
              // format: "{point.name}",
              formatter: function () {
                return this.name[0].toUpperCase();
              },
            },
          },
        },
      },
      "lefse",
    );
    return chart;
  },
} as Demo;
