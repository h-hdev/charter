import Title from "./Titlte";
import { getDragableElement, getEdiableText, TextEditor } from "./Element";
import Legend from "./Legend";
import Legends from "./Legends";
import DataLabels from "./DataLabels";
import TreeLabel from "./TreeLabel";

const Elements = {
  title: Title,
  legend: Legend,
  legends: Legends,
  dataLabels: DataLabels,
  treeLabel: TreeLabel,
};

function diff(p2, p1) {
  return {
    x: p2.x - p1.x,
    y: p2.y - p1.y,
  };
}

function toPosition(e) {
  return {
    x: e.clientX,
    y: e.clientY,
  };
}

export default function (H) {
  H.addEvent(H.Chart, "load", function (e) {
    const chart = e.target;

    let mousedown, position, mousemove;

    let currentElement;

    H.addEvent(chart.container, "mousedown", function (e) {
      if (chart.textEditor) {
        chart.textEditor.end();
      }
      mousedown = toPosition(e);
      position = {
        ...mousedown,
      };
    });

    H.addEvent(document.body, "mousemove", function (e) {
      let target = e.target;
      if (mousedown) {
        if (!mousemove) {
          currentElement = getDragableElement(Elements, e, chart);
          mousemove = true;
          if (currentElement) {
            currentElement.moveStart(mousedown, e);
            // updateBBox(currentElement);
          }
        } else if (currentElement) {
          currentElement.moving(diff(toPosition(e), position), e);
        }
        position = toPosition(e);
      }
    });

    H.addEvent(document.body, "mouseup", function (e) {
      if (mousedown && currentElement) {
        currentElement.moveEnd(mousedown, position, e);
        // updateBBox(currentElement);
        currentElement = null;
      }
      mousedown = mousemove = position = false;
    });

    let currentText;
    H.addEvent(chart.container, "dblclick", function (e) {
      currentText = getEdiableText(Elements, e, chart);
      if (currentText) {
        const text = currentText.getText();

        if (!text) {
          // TODO: hide text editor
          return;
        }

        if (chart.textEditor) {
          chart.textEditor.setText(text);
        } else {
          chart.textEditor = new TextEditor(chart, text, (newText) => {
            currentText.setText(newText);
          });
        }
      }
    });
  });
}
