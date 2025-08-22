import genus_tree from "./genus_tree/index";
import lefse from "./lefse/index";
import circos from "./circos/index";
import network from "./network/index";
import { Charter } from "@/Charter";
import legacy from "./legacy";

export type Demo = {
  name: string;
  code: string;
  demo: (container: HTMLElement) => Charter;
  interactive: (container: HTMLElement) => void;
  sampleData: any;
};

const demos: Demo[] = [lefse, genus_tree, circos, network, legacy];

export default demos;
