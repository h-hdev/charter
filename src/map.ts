import { Chart } from "@/index";

const options = {
  colors: ["#ffbf81", "#ffe093", "#8fc8ff", "#e6b4e4", "#a2e6c0"],
  mapdata: "https://geojson.cn/api/china/1.6.2/china.topo.json",
  series: [
    {
      type: "map",
      joinBy: "name",
      data: [
        {
          name: "北京",
          value: 20,
        },
      ],
    },
  ],
};

new Chart(document.querySelector("#app") as HTMLElement, options, {
  id: "html",
  src: "./area-map.html",
});
