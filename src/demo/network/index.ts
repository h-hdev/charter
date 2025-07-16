import { Chart } from "@/index";
import { Demo } from "../index";

import { nodes, links } from "./data";

export default {
  name: "Network",
  code: "network",
  sampleData: {
    network: {
      nodes,
      links,
    },
  },
  demo: (container: HTMLElement) => {
    let chart = new Chart(container, "network", {
      title: {
        text: "network",
      },
      plotOptions: {
        networkgraph: {
          dataLabels: {
            enabled: true,
            format: "{point.name}",
          },
        },
      },
      network: {
        nodes,
        links,
        layoutAlgorithm: {
          enableSimulation: false,
          initialPositions: "circle",
          integration: "euler",
          gravitationalConstant: 1,
        },
      },
    });
    return chart;
  },
} as Demo;
