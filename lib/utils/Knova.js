import { jsPDF } from "jspdf";
import { Context } from "svgcanvas";

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
const KnovaUtils = {
  toSVG: async (stage, layer) => {
    await sleep(200);
    const oldContext = layer.canvas.context._context;
    const c2s = (layer.canvas.context._context = new Context({
      height: stage.height(),
      width: stage.width(),
      ctx: oldContext,
    }));
    stage.draw();
    let out = c2s.getSerializedSvg();
    layer.canvas.context._context = oldContext;
    await sleep(200);
    stage.draw();
    return out;
  },

  export: async (type, filename, stage, layer) => {
    let dataURL;
    if (type === "svg") {
      let svg = await KnovaUtils.toSVG(stage, layer);
      const blob = new Blob([svg], { type: "image/svg+xml" });
      dataURL = URL.createObjectURL(blob);
    } else {
      const isPDF = type === "pdf";
      dataURL = stage.toDataURL({
        pixelRatio: 2,
        mimeType: type === "jpg" ? "image/jpeg" : "image/png",
      });

      if (isPDF) {
        const pdf = new jsPDF(
          "l",
          "px",
          [stage.width(), stage.height()],
          undefined,
          true,
        );
        pdf.addImage(dataURL, 0, 0, stage.width(), stage.height());
        pdf.save(`${filename}.pdf`);
        return;
      }
    }

    const link = document.createElement("a");
    link.download = `${filename}.${type}`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};

export default KnovaUtils;
