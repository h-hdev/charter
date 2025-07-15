export default (H) => {
  // const _getCenter = H.CenteredSeriesMixin.getCenter;
  // console.log(_getCenter);
  /**
   * Pane 功能增强，针对 Size 增加偏移量支持
   * 使用常见：针对多个 Pane 其中某一个需要固定大小的情况，例如：
   *
   *   pane 1:  0 ~ 50%
   *   pane 2:  100px
   *   pane 3: 剩余空间，即 50% + 100, ~ 100%
   *
   * 对应的配置是
   *   [{
   *    innerSize: 0,
   *    size: '50%'
   *    },{
   *     innerSize: '50%',
   *     size: '50%',
   *     sizeOffset: 100
   *    },{
   *       innerSize: '50%',
   *     innerSizeOffset: -100
   *     size: '50%',
   *
   *     }]
   */

  const _setAxisSize = H.Axis.prototype.setAxisSize;

  let PanePro = null;

  const { fireEvent, isNumber, pick, relativeLength } = H;

  function getCenter() {
    const options = this.options,
      chart = this.chart,
      slicingRoom = 2 * (options.slicedOffset || 0),
      plotWidth = chart.plotWidth - 2 * slicingRoom,
      plotHeight = chart.plotHeight - 2 * slicingRoom,
      centerOption = options.center,
      smallestSize = Math.min(plotWidth, plotHeight),
      thickness = options.thickness;

    let handleSlicingRoom,
      size = options.size,
      innerSize = options.innerSize || 0,
      i,
      value;

    if (typeof size === "string") {
      size = parseFloat(size);
    }

    if (typeof innerSize === "string") {
      innerSize = parseFloat(innerSize);
    }

    const positions = [
      pick(centerOption?.[0], "50%"),
      pick(centerOption?.[1], "50%"),
      // Prevent from negative values
      pick(size && size < 0 ? void 0 : options.size, "100%"),
      pick(innerSize && innerSize < 0 ? void 0 : options.innerSize || 0, "0%"),
    ];

    // No need for inner size in angular (gauges) series but still required
    // for pie series
    if (chart.angular && !(this instanceof Series)) {
      positions[3] = 0;
    }

    for (i = 0; i < 4; ++i) {
      value = positions[i];
      handleSlicingRoom = i < 2 || (i === 2 && /%$/.test(value));

      // I == 0: centerX, relative to width
      // i == 1: centerY, relative to height
      // i == 2: size, relative to smallestSize
      // i == 3: innerSize, relative to size
      positions[i] =
        relativeLength(
          value,
          [plotWidth, plotHeight, smallestSize, positions[2]][i],
        ) + (handleSlicingRoom ? slicingRoom : 0);
    }
    // Inner size cannot be larger than size (#3632)
    if (positions[3] > positions[2]) {
      positions[3] = positions[2];
    }
    // Thickness overrides innerSize, need to be less than pie size (#6647)
    if (isNumber(thickness) && thickness * 2 < positions[2] && thickness > 0) {
      positions[3] = positions[2] - thickness * 2;
    }

    // update1: add sizeOffset and innerSizeoffset support
    if (options.sizeOffset) {
      positions[2] += options.sizeOffset;
    }
    if (options.innerSizeOffset) {
      positions[3] += options.innerSizeOffset;
    }

    fireEvent(this, "afterGetCenter", { positions });

    return positions;
  }

  function setPanePro(panePro) {
    PanePro = panePro;
    PanePro.updateCenter = function (axis) {
      this.center = (axis || this.axis || {}).center = getCenter.call(this);
    };
  }

  H.Axis.prototype.setAxisSize = function () {
    let center, start;
    _setAxisSize.call(this);

    if (this.isRadial) {
      // Set the center array
      if (!PanePro) {
        setPanePro(this.pane.__proto__);
      }
      this.pane.updateCenter(this);

      // In case when the innerSize is set in a polar chart, the axis'
      // center cannot be a reference to pane's center
      center = this.center = this.pane.center.slice();

      // The sector is used in Axis.translate to compute the
      // translation of reversed axis points (#2570)
      if (this.isCircular) {
        this.sector = this.endAngleRad - this.startAngleRad;
      } else {
        // When the pane's startAngle or the axis' angle is set then
        // new x and y values for vertical axis' center must be
        // calculated
        start = this.postTranslate(this.angleRad, center[3] / 2);
        center[0] = start.x - this.chart.plotLeft;
        center[1] = start.y - this.chart.plotTop;
      }

      // Axis len is used to lay out the ticks
      this.len =
        this.width =
        this.height =
          ((center[2] - center[3]) * H.pick(this.sector, 1)) / 2;
    }
  };
};
