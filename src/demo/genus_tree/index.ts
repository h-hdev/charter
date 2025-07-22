import { Chart } from "@/index";
import { Demo } from "../index";
import { data, selectedGenus, categoryGroup, input } from "./genus_tree_data";
// import GenusTree from "@/highcharts/GenusTree";

// const simpleExtends = function(a: any, b: any)
export default {
  name: "Genus Tree",
  code: "genus",
  sampleData: {
    data: input,
    selectedGenus,
    categoryGroup,
  },
  demo: (container: HTMLElement) => {
    // let chartOptions = GenusTree.parseData(data, selectedGenus, categoryGroup);

    // console.log(chartOptions);

    // console.log(chartOptions);

    // let columnYAxis: Record<string, number | string> = {
    //   gridLineWidth: 1,
    //   gridLineDashStyle: "Dash",
    //   tickInterval: 100,
    // };

    // Object.keys(columnYAxis).forEach((key) => {
    //   (chartOptions.yAxis[1] as any)[key] = columnYAxis[key];
    // });

    let chart = new Chart(container, "genus", {
      title: {
        text: "The 240 Closest Planets to the Earth other than our solar system",
      },
      colors: [
        "#EFC4CA",
        "#EEDFB8",
        "#EAFDFF",
        "#8875D4",
        "#CDA5D9",
        "#8442C5",
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
      yAxis: {
        gridLineWidth: 1,
        gridLineDashStyle: "Dash",
        tickInterval: 100,
      },
      genus: {
        data: data,
        selectedGenus,
        categoryGroup,
      },
      legend: {
        floating: true,
        title: {
          text: "Abundance",
        },
        layout: "vertical",
        align: "left",
        verticalAlign: "top",
      },

      treeLegend: {
        title: {
          text: "Phylum",
        },
        layout: "vertical",
        align: "right",
        verticalAlign: "top",
      },
    });

    return chart;
  },
} as Demo;
