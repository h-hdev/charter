import ArcTree from "./ArcTree.js";
import ArcArea from "./ArcArea.js";
import ArcBubble from "./ArcBubble.js";
import Circos from "./Circos.js";

export default (H) => {
  ArcBubble(H);
  ArcTree(H);
  ArcArea(H);
  Circos(H);
};
