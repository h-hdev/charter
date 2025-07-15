// // console.log(this.xAxis[0].ticks);
// // const chart = this,
// //   xAxis = this.xAxis[0],
// //   ticks = xAxis.ticks,
// //   mid = xAxis.min + (xAxis.max - xAxis.min) / 2;
// // console.log(chart);
// // Object.keys(ticks).forEach((k) => {
// //   let tick = ticks[k];
// //   //
// //   if (!tick.label) return;
// //   let rotation =
// //     ((xAxis.startAngleRad + xAxis.translate(tick.pos)) / Math.PI) *
// //     180;
// //   //   (tick.pos * 360) / (xAxis.tickPositions.length - 1) - 90;
// //   // console.log(
// //   //   rotation,
// //   //   tick.label.textStr,
// //   // );
// //   tick.label.attr({
// //     rotation: tick.pos >= mid ? rotation - 180 : rotation,
// //     // ((xAxis.angleRad + xAxis.translate(tick.pos)) / Math.PI) * 90,
// //   });
// // });

// export default (H) => {
//   function isAutoAngle(axis) {
//     return axis.isCircular && axis.options.labels.autoAngle;
//   }

//   // H.addEvent(H.Axis, "afterRender", function (e) {
//   //   if (isAutoAngle(this)) {
//   //     const xAxis = this,
//   //       ticks = xAxis.ticks,
//   //       mid = xAxis.min + (xAxis.max - xAxis.min) / 2;
//   //     Object.keys(ticks).forEach((k) => {
//   //       let tick = ticks[k];
//   //       //
//   //       if (!tick.label) return;

//   //       let anchor = "start";
//   //       let rotation =
//   //         ((xAxis.startAngleRad + xAxis.translate(tick.pos)) / Math.PI) * 180;
//   //       //   (tick.pos * 360) / (xAxis.tickPositions.length - 1) - 90;
//   //       // console.log(
//   //       //   rotation,
//   //       //   tick.label.textStr,
//   //       // );
//   //       //
//   //       if (tick.pos >= mid) {
//   //         rotation -= 180;
//   //         anchor = "end";
//   //       }
//   //       tick.rotation = rotation;
//   //       tick.label
//   //         .attr({
//   //           rotation,
//   //           // ((xAxis.angleRad + xAxis.translate(tick.pos)) / Math.PI) * 90,
//   //         })
//   //         .css({
//   //           "text-anchor": anchor,
//   //         });
//   //     });
//   //   }
//   // });

//   // H.wrap(H.Axis.prototype, "render", function (proceed) {
//   //   proceed.apply(this, Array.prototype.slice.call(arguments, 1));
//   //   if (isAutoAngle(this)) {
//   //
//   // });

//   // H.addEvent(H.Tick, "afterGetLabelPosition", function (e) {
//   //   // if (this.label.opacity === 0) {
//   //   //   console.log(this.label);
//   //   //   this.label.attr({
//   //   //     opacity: 1,
//   //   //   });
//   //   // }
//   // });

//   // H.wrap(H.Tick.prototype, "handleOverflow", function (proceed) {
//   //   if (isAutoAngle(this.axis)) {
//   //     return;
//   //   }
//   //   proceed.apply(this, Array.prototype.slice.call(arguments, 1));
//   // });

//   // H.wrap(H.Tick.prototype, "renderLabel", function (proceed) {
//   //   proceed.apply(this, Array.prototype.slice.call(arguments, 1));

//   //   const tick = this,
//   //     axis = tick.axis;

//   //   console.log((axis.startAngleRad / Math.PI) * 180);

//   //   if (isAutoAngle(axis)) {
//   //     const label = tick.label;
//   //     if (!label) {
//   //       console.log(tick);
//   //       return;
//   //     }

//   //     let rotation =
//   //       ((axis.startAngleRad + axis.translate(tick.pos)) / Math.PI) * 180;

//   //     let textAnchor = "start";

//   //     // console.log(tick.pos, label.textStr);
//   //     if (tick.pos >= axis.min + (axis.max - axis.min) / 2) {
//   //       rotation = rotation - 180;
//   //       textAnchor = "end";
//   //     }

//   //     tick.rotation = rotation;
//   //     label
//   //       .attr({
//   //         rotation,
//   //         opacity: 1,
//   //       })
//   //       .css({
//   //         "text-anchor": textAnchor,
//   //         // "dominant-baseline": "central",
//   //       });

//   //     label.isNewLabel = false;
//   //   }
//   // });
// };
