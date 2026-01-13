const defaultOptions = {
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
  node: {
    minSize: 1,
    maxSize: 20,
    lineWidth: 1,
    lineColor: "#fff",
    fillOpacity: 0.8,
  },
  link: {
    lineWidth: 1,
    lineColor: "#999",
    maxLength: 20,
  },
};

class Network {
  constructor(container, options) {
    this.container = container;
    this.options = {
      ...defaultOptions,
      ...options,
    };

    this.init();
  }

  init() {
    this.color = d3.scaleOrdinal(this.options.colors);

    this.nodes = this.options.nodes.data.map((d) => ({ ...d }));

    this.links = this.options.links.data.map((l) => ({ ...l }));

    this.dpi = window.devicePixelRatio;

    this.size = this.options.size || [1000, 1000];

    this.canvas = d3
      .create("canvas")
      .attr("width", this.dpi * this.size[0])
      .attr("height", this.dpi * this.size[1])
      .attr("style", `width: ${this.size[0]}px; max-width: 100%; height: auto;`)
      .node();

    this.context = this.canvas.getContext("2d");
    this.context.scale(this.dpi, this.dpi);

    this.container.appendChild(this.canvas);

    const scoreExtent = d3.extent(this.nodes, (d) => d.score);
    this.radiusScale =
      scoreExtent[0] === scoreExtent[1]
        ? () => 10
        : d3
            .scaleLinear()
            .domain(scoreExtent)
            .range([this.options.node.minSize, this.options.node.maxSize]);

    this.linkDistance = Math.max(
      this.options.link.maxLength,
      Math.min(
        200,
        Math.sqrt((this.size[0] * this.size[1]) / this.nodes.length),
      ),
    );

    // const simulation = d3
    //     .forceSimulation(nodes)
    //     .force(
    //         "link",
    //         d3
    //             .forceLink(links)
    //             .id((d) => d.id)
    //             .distance(linkDistance)
    //             .strength(1),
    //     )
    //     .force(
    //         "charge",
    //         d3.forceManyBody().strength(-linkDistance),
    //     )
    //     .force(
    //         "collide",
    //         d3
    //             .forceCollide()
    //             .radius((d) => radiusScale(d.score) + 2),
    //     )
    //     .force("center", d3.forceCenter(0, 0))
    //     .force("x", d3.forceX(0).strength(0.02))
    //     .force("y", d3.forceY(0).strength(0.02));
    //
    //
    this.simulation = d3
      .forceSimulation(this.nodes)
      .force(
        "link",
        d3
          .forceLink(this.links)
          .id((d) => d.id)
          .distance(this.linkDistance)
          .strength(1),
      )
      .force("charge", d3.forceManyBody())

      .force(
        "collide",
        d3.forceCollide().radius((d) => this.radiusScale(d.score) + 2),
      )
      .force("center", d3.forceCenter(this.size[0] / 2, this.size[1] / 2))
      .force("x", d3.forceX(0).strength(0.02))
      .force("y", d3.forceY(0).strength(0.02))
      // .force(
      //     "center",
      //     d3.forceCenter(this.size[0] / 2, this.size[1] / 2),
      // )
      .on("tick", () => {
        this.render();
      });

    this.addEvent();
    // this.render()
  }

  addEvent() {
    const canvas = this.canvas;
    const simulation = this.simulation;
    const nodes = this.nodes;

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    // Update the subject (dragged node) position during drag.
    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    d3.select(canvas).call(
      d3
        .drag()
        .subject((event) => {
          const [px, py] = d3.pointer(event, canvas);
          return d3.least(nodes, ({ x, y }) => {
            const dist2 = (x - px) ** 2 + (y - py) ** 2;
            if (dist2 < 400) return dist2;
          });
        })
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended),
    );
  }

  setOption(key, value) {
    Utils.set(this.options, key, value);

    if (key === "colors") {
      this.options.colors = value;
      this.color = d3.scaleOrdinal(this.options.colors);
    } else {
      let keys = key.split(".");
      if (keys[0] === "node") {
        this.options.node[keys[1]] = value;
      }
    }
    this.render();
  }

  update(options) {
    if (options.colors) {
      this.color = d3.scaleOrdinal(options.colors);
    }

    this.options = {
      ...this.options,
      ...options,
    };

    this.render();
  }

  render() {
    const context = this.context;
    context.clearRect(0, 0, this.size[0], this.size[1]);
    context.save();
    context.globalAlpha = 0.6;
    context.strokeStyle = this.options.link.lineColor || "#999";
    context.beginPath();
    this.links.forEach((l) => {
      this.drawLink(l);
    });
    context.stroke();
    context.restore();

    context.save();
    context.strokeStyle = "#fff";
    context.globalAlpha = 1;
    this.nodes.forEach((node) => {
      context.beginPath();
      this.drawNode(node);
      context.fillStyle = this.color(node.group);
      context.strokeStyle = "#fff";
      context.fill();
      context.stroke();
    });
    context.restore();
  }

  drawLink(link) {
    this.context.moveTo(link.source.x, link.source.y);
    this.context.lineTo(link.target.x, link.target.y);
  }

  drawNode(node) {
    const radius = this.radiusScale(node.score);
    this.context.moveTo(node.x + radius, node.y);
    this.context.arc(node.x, node.y, radius, 0, 2 * Math.PI);
  }
}
