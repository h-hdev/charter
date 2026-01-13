import { Chart } from "@/index";

const options = {
  title: {
    text: "venn5",
  },
  plotOptions: {
    venns: {
      dataLabels: {
        format: "{point.index}",
      },
    },
  },
  legend: {
    itemStyle: {
      fontSize: "14px",
      color: "#000",
    },
  },
  data: [
    {
      name: "CK1",
      value: 621,
    },
    {
      name: "CK1@@CK2",
      value: 673,
    },
    {
      name: "CK1@@CK2@@CK3",
      value: 1537,
    },
    {
      name: "CK1@@CK2@@CK3@@TN1",
      value: 71,
    },
    {
      name: "CK1@@CK2@@CK3@@TN1@@TN2",
      value: 136,
    },
    {
      name: "CK1@@CK2@@CK3@@TN2",
      value: 43,
    },
    {
      name: "CK1@@CK2@@TN1",
      value: 11,
    },
    {
      name: "CK1@@CK2@@TN1@@TN2",
      value: 19,
    },
    {
      name: "CK1@@CK2@@TN2",
      value: 3,
    },
    {
      name: "CK1@@CK3",
      value: 331,
    },
    {
      name: "CK1@@CK3@@TN1",
      value: 6,
    },
    {
      name: "CK1@@CK3@@TN1@@TN2",
      value: 17,
    },
    {
      name: "CK1@@CK3@@TN2",
      value: 6,
    },
    {
      name: "CK1@@TN1",
      value: 6,
    },
    {
      name: "CK1@@TN1@@TN2",
      value: 26,
    },
    {
      name: "CK1@@TN2",
      value: 13,
    },
    {
      name: "CK2",
      value: 607,
    },
    {
      name: "CK2@@CK3",
      value: 312,
    },
    {
      name: "CK2@@CK3@@TN1",
      value: 4,
    },
    {
      name: "CK2@@CK3@@TN1@@TN2",
      value: 12,
    },
    {
      name: "CK2@@CK3@@TN2",
      value: 6,
    },
    {
      name: "CK2@@TN1",
      value: 10,
    },
    {
      name: "CK2@@TN1@@TN2",
      value: 26,
    },
    {
      name: "CK2@@TN2",
      value: 13,
    },
    {
      name: "CK3",
      value: 503,
    },
    {
      name: "CK3@@TN1",
      value: 10,
    },
    {
      name: "CK3@@TN1@@TN2",
      value: 23,
    },
    {
      name: "CK3@@TN2",
      value: 10,
    },
    {
      name: "TN1",
      value: 245,
    },
    {
      name: "TN1@@TN2",
      value: 914,
    },
    {
      name: "TN2",
      value: 398,
    },
  ],
  colors: ["#ffbf81", "#ffe093", "#8fc8ff", "#e6b4e4", "#a2e6c0"],
};

new Chart(document.querySelector("#app") as HTMLElement, options, {
  id: "html",
  src: "./legacy/index.html",
  code: "venn",
});
