const node = `name,group,score
Negativibacillus,Firmicutes,1
Turicibacter,Firmicutes,1
Fournierella,Firmicutes,2
Methanobrevibacter,Euryarchaeota,2
Lachnospiraceae_UCG-001,Firmicutes,1
Acidaminococcus,Firmicutes,2
Megasphaera,Firmicutes,1
Catenibacterium,Firmicutes,2
Prevotella,Bacteroidota,1
Olsenella,Actinobacteriota,1
Clostridium_sensu_stricto_1,Firmicutes,1
Christensenellaceae_R-7_group,Firmicutes,1
UCG-005,Firmicutes,1
Pyramidobacter,Synergistota,1`;

const group = `source,source_group,target,target_group,coefficient
Negativibacillus,Firmicutes,Olsenella,Actinobacteriota,0.96875
Turicibacter,Firmicutes,Clostridium_sensu_stricto_1,Firmicutes,0.953462589245592
Fournierella,Firmicutes,Methanobrevibacter,Euryarchaeota,0.96875
Fournierella,Firmicutes,Acidaminococcus,Firmicutes,0.96875
Methanobrevibacter,Euryarchaeota,Catenibacterium,Firmicutes,0.96875
Lachnospiraceae_UCG-001,Firmicutes,Pyramidobacter,Synergistota,0.96875
Acidaminococcus,Firmicutes,Catenibacterium,Firmicutes,0.96875
Megasphaera,Firmicutes,Prevotella,Bacteroidota,0.976470588235294
Christensenellaceae_R-7_group,Firmicutes,UCG-005,Firmicutes,0.945454545454545`;

let groups: Record<
  string,
  {
    name: string;
    nodes: any[];
  }
> = {};

type nodeGroupData = [string, string, number];

node.split("\n").forEach((line, lineNo) => {
  if (lineNo) {
    let tmp = line.split(",").map((d, i) => {
      return i === 2 ? parseFloat(d) : d;
    }) as nodeGroupData;

    let groupName = tmp[1];
    if (!groups[groupName]) {
      groups[groupName] = {
        name: groupName,
        nodes: [],
      };
    }

    groups[groupName].nodes.push([tmp[0], tmp[2]]);
  }
});

let links: [string, string, number][] = [];

group.split("\n").forEach((line, lineNo) => {
  if (lineNo) {
    let tmp = line.split(",");
    links.push([tmp[0], tmp[2], parseFloat(tmp[4])]);
  }
});

const nodes = Object.keys(groups).map((key) => groups[key]);

export { nodes, links };
