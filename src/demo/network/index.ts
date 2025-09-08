import { Chart } from "@/index";
import { Demo } from "../index";

import { nodes, links } from "./data";

let chart;

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
    chart = new Chart(
      container,
      {
        title: {
          text: "network",
          // align: "left",
          style: {
            fontSize: "20px",
            color: "red",
          },
          // verticalAlign: "middle",
          // x: 100,
          // y: 100,
        },
        colors: [
          "#2caffe",
          "#544fc5",
          "#00e272",
          "#fe6a35",
          "#6b8abc",
          "#d568fb",
          "#2ee0ca",
          "#fa4b42",
          "#feb56a",
          "#91e8e1",
        ],
        plotOptions: {
          networkgraph: {
            dataLabels: {
              enabled: true,
              format: "{point.name}",
            },
          },
        },

        legend: {
          layout: "vertical",
          align: "left",
          verticalAlign: "middle",
        },
        network: {
          nodes,
          links,
          node: {
            minSize: 3,
            maxSize: 10,
            dataMapping: {
              name: "id",
              value: "score",
            },
          },
          // layoutAlgorithm: {
          //   enableSimulation: true,
          //   initialPositions: "circle",
          //   integration: "euler",
          //   gravitationalConstant: 1,
          // },
        },
      },
      "network",
      // {
      //   id: "html",
      //   src: "./network.html",
      // },
    );
    return chart;
  },
} as Demo;
