import genus_tree from "./genus_tree/genus_tree";
import lefse from "./lefse/index";
import circos from "./circos/index";
import { Charter } from "@/Charter";

export type Demo = {
  name: string;
  code: string;
  demo: (container: HTMLElement) => Charter;
  sampleData: any;
};

const demos: Demo[] = [lefse, genus_tree, circos];

export default demos;
