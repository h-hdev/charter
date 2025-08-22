// import Draggable, { IFont } from "@/highcharts/plugins/draggable";
// import DragableElement, {
//   BBox,
//   Position,
// } from "@/highcharts/plugins/draggable/DraggableElement";
// import { Chart } from "highcharts";
// // import "highcharts/highcharts-more";

// const app = document.querySelector("#app");

// if (!app) {
//   throw new Error("app");
// }

// const color = document.createElement("input");
// color.type = "color";

// app.appendChild(color);

// const chartContainer = document.createElement("div");
// app.appendChild(chartContainer);

// // const chart = Highcharts.chart(chartContainer, {
// //   series: [
// //     {
// //       type: "bubble",
// //       data: [
// //         [0, 10],
// //         [1, 23],
// //       ],
// //     },
// //     {
// //       type: "bubble",
// //       data: [
// //         [10, 20],
// //         [14, 2],
// //       ],
// //     },
// //   ],
// // });

// // color.value = chart.series[0].color as string;

// // color.addEventListener("change", (e: any) => {
// //   let colors = [...(chart.options.colors as string[])];
// //   colors[e.ctrlKey ? 1 : 0] = color.value;
// //   chart.update({ colors });
// // });

// const da = new Draggable(chartContainer);

// class SimgpleText extends DragableElement {
//   static attach(element: any, e: MouseEvent, chart: Chart) {
//     return undefined;
//     // if (
//     //   element.className.baseVal === "highcharts-title"
//     //   // &&
//     //   // chart.options.title.dragable !== false
//     // ) {

//     // }
//   }

//   getBBox(): BBox {
//     const bbox = this.element.getBoundingClientRect();
//     // bbox.y -= 1;
//     return {
//       x: bbox.x,
//       y: bbox.y,
//       width: bbox.width,
//       height: bbox.height,
//     };
//   }

//   getFont(): IFont {
//     const styles = window.getComputedStyle(this.element);
//     return {
//       text: this.element.textContent,
//       style: {
//         "font-size": styles.fontSize,
//         "font-weight": styles.fontWeight,
//         "font-family": styles.fontFamily,
//       },
//     };
//   }

//   onStart(): void {
//     this.element.style.opacity = 0;
//   }

//   onEnd(changed: Position, font: IFont | undefined) {
//     console.log(font);
//     const title: any = this.chart.options.title;
//     if (!title.y) {
//       title.y = (this.chart as any).titleOffset[0] / 2 - 4;
//     }

//     let newOptions: Record<string, any> = {
//       x: (title.x || 0) + changed.x,
//       y: (title.y || 0) + changed.y,
//     };

//     if (font && font.text !== title.text) {
//       newOptions.text = font.text;
//     }

//     this.object.update(newOptions);
//   }
// }

// let element = document.createElement("h1");
// element.innerText = "Just a H1 test text";

// chartContainer.appendChild(element);

// element.onclick = function (e) {
//   da.start(e, new SimgpleText(null as any, element, element));
// };
