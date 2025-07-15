const SVGHelper = {
  getTextWidth(
    text: string[] | string,
    style: {
      fontSize: string;
      fontFamily: string;
      bold: boolean;
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
      svg.appendChild(textElem);
    }

    textElem.setAttribute("font-family", style.fontFamily);
    textElem.setAttribute("font-size", style.fontSize);

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
