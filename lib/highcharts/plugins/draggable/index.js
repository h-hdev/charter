import Title from "./title";
import DataLabel from "./datalabel";
import LegendText from "./legendText";
import LegendBox from "./legend";

const draggable = {
  txt: [Title, DataLabel, LegendText],
  components: [LegendBox],
};

export default (H) => {
  H.addEvent(H.Chart, "load", function (e) {
    const chart = e.target;

    let currentDraggable = null;
    let input = document.createElement("input");

    H.addEvent(chart.container, "mousedown", function (e) {
      if (!e.metaKey && !e.ctrlKey) {
        return false;
      }

      const isContextMenu = e.button === 2;
      console.log(e);

      if (e.target.tagName === "text") {
        e = chart.pointer.normalize(e);
        const target = e.target;
        for (const d of draggable.txt) {
          let r = d.attach(target, e, chart);

          // if (isContextMenu) {
          //   chart.container.parentNode.appendChild(input);
          //   input.focus();
          //   const edito = r.getEditProps();
          //   console.log(edito);
          //   input.value = edito.text;
          //   input.style.left = edito.bbox.left + "px";
          //   input.style.top = edito.bbox.top + "pox";
          //   input.style.position = "absolute";
          // }

          if (r) {
            currentDraggable = r;
            break;
          }
        }
      }

      if (currentDraggable) return;
      e = chart.pointer.normalize(e);
      for (const c of draggable.components) {
        let r = c.attach(e.target, e, chart);
        if (r) {
          currentDraggable = r;
          break;
        }
      }
    });

    // H.addEvent(chart.container, "mousemove", function (e) {
    //   if (currentDraggable) {
    //     e = chart.pointer.normalize(e);
    //     currentDraggable.moving(e);
    //   }
    // });

    // H.addEvent(chart.container, "mouseup", function (e) {
    //   if (currentDraggable) {
    //     e = chart.pointer.normalize(e);
    //     currentDraggable = currentDraggable.moveEnd(e);
    //   }
    // });
  });
};
