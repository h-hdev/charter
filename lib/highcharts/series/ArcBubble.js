export default (H) => {
  const BubbleProto = H.seriesTypes.bubble.prototype;

  H.seriesType(
    "arcbubble",
    "bubble",
    {},
    {
      drawPoints: function () {
        BubbleProto.drawPoints.call(this);

        // Highlight linked point
        let pointColorMap = {};
        this.linkedSeries.forEach((ls) => {
          if (ls.options.type === "arcarea" && ls.options.colorMainSeries) {
            ls.data.forEach((d) => {
              pointColorMap[d.name] = ls.color;
            });
          }
        });

        if (Object.keys(pointColorMap).length) {
          this.points.forEach((p) => {
            if (pointColorMap[p.name]) {
              p.color = pointColorMap[p.name];
              p.graphic.attr({ fill: p.color });
            }
          });
        }
      },
    },
  );
};
