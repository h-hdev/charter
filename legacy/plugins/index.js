import Event from "@/utils/event";
import Draggable from "./draggable";
import DataLabel from "./draggable/hc/dataLabel";
import Legend from "./draggable/hc/legend";

import Title from "./draggable/hc/title";
import Treelabel from "./draggable/hc/treelabel";
// import DataLabel from "./hc/datalabel.js";
// import LegendText from "./hc/legendText.js";
// import LegendBox from "./hc/legend.js";

const draggable = {
  txt: [Title, DataLabel, Treelabel],
  components: [Legend],
};

function getEditableFromEvent(e, chart) {
  const text = draggable.txt;
  for (let i = 0; i < text.length; i++) {
    if (text[i].attach(e.target, e, chart)) {
      return text[i];
    }
  }
  return null;
}

export default (H) => {
  H.Chart.prototype.closeDraggable = function () {
    if (this.draggable) {
      this.draggable.close();
    }
  };

  H.addEvent(H.Chart, "load", function (e) {
    const chart = e.target;

    let mousedown, mousemove;
    H.addEvent(document.body, "mousemove", function (e) {
      mousemove = true;
    });

    H.addEvent(document.body, "mouseup", function (e) {
      console.log(e.timeStamp, "mouseup");
    });

    H.addEvent(chart.container, "dblclick", function (e) {
      let target = getEditableFromEvent(e, chart);
      Event.emit("text-edit", target);
    });

    H.addEvent(chart.container, "mousedown", function (e) {
      console.log(e.timeStamp);
    });
    // mousedown = {
    //   x: e
    // }

    //   if (!e.metaKey && !e.ctrlKey) {
    //     console.log("click without");
    //     chart.closeDraggable();
    //     return false;
    //   }

    //   console.log("...mouse");

    //   // if (chart.draggable) {
    //   //   // chart.draggable.mousedown(e);
    //   //   return false;
    //   // }

    //   let currentDraggable;
    //   if (e.target.tagName === "text") {
    //     e = chart.pointer.normalize(e);
    //     const target = e.target;
    //     for (const d of draggable.txt) {
    //       let r = d.attach(target, e, chart);
    //       if (r) {
    //         currentDraggable = r;
    //         break;
    //       }
    //     }
    //   }

    //   if (!currentDraggable) {
    //     e = chart.pointer.normalize(e);
    //     for (const c of draggable.components) {
    //       let r = c.attach(e.target, e, chart);
    //       if (r) {
    //         currentDraggable = r;
    //         break;
    //       }
    //     }
    //   }

    //   if (currentDraggable) {
    //     if (!chart.draggable) {
    //       chart.draggable = new Draggable(chart.container);
    //     } else {
    //       chart.closeDraggable();
    //     }
    //     chart.draggable.start(e, currentDraggable);
    //   } else {
    //     chart.closeDraggable();
    //   }

    //   e.stopPropagation();
    // });
  });
};
