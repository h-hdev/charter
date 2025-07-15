const SVGHelper = {
  getTextWidth(
    text: string[] | string,
    style: {
      fontSize: string;
      fontFamily?: string;
      fontWeight?: string;
    },
    textElem?: any,
    svg?: any,
  ) {
    if (!svg) {
      svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.id = "temp-svg";
      svg.style.position = "absolute";
      svg.style.visibility = "hidden";
      document.body.appendChild(svg);

      setTimeout(() => {
        document.body.removeChild(svg);
      }, 5000);
    }

    if (!textElem) {
      textElem = document.createElementNS("http://www.w3.org/2000/svg", "text");
      textElem.setAttribute("transform", "translate(-1000, -1000)");
      svg.appendChild(textElem);

      setTimeout(() => {
        svg.removeChild(textElem);
      }, 1000);
    }

    if (style.fontFamily) {
      textElem.setAttribute("font-family", style.fontFamily);
    }
    textElem.setAttribute("font-size", style.fontSize);
    if (style.fontWeight) {
      textElem.setAttribute("font-weight", style.fontWeight);
    }

    if (typeof text === "string") {
      textElem.textContent = text;
      return textElem.getComputedTextLength();
    } else {
      return text.map((t) => {
        textElem.textContent = t;
        return textElem.getComputedTextLength();
      });
    }
  },
};

export default SVGHelper;
