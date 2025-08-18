/**
 * Node 配置
 * [from, to, value],  from = undefined 表示根节点
 */
export type NodeOptions = [string | undefined, string, number, string?];

/**
 * Node 组配置：相当 Highcharts 的 series 配置
 *
 * name：组名，
 * nodes: 节点数据
 * link?: 连线配置参数，同 Highcharts.series.line 配置，主要用于调整线条样式、颜色等
 * [key: stirng]: 其他配置，同 Highcharts.series.bubble 配置
 */
export type NodeGroupOptions = {
  name: string;
  nodes: NodeOptions[];
  link?: any;
  [key: string]: any;
};

/**
 * 高亮树配置
 */
export type HighlightTree = {
  color: string;
  node?: boolean | string | undefined;
  name: string;
};

/**
 * 高亮配置，包括高亮树或节点
 */
export type HighlightOption = HighlightTree | boolean | string;

/**
 * 高亮配置 Map, key 为节点的名字
 * {
 *    [节点名字]：颜色,
 *    [节点名字]: {
 *        name: 名字,
 *        color: string, // 背景色
 *        node?: string  //
 *    }
 * }
 */
export type HighlightOptions = {
  [key: string]: HighlightOption;
  "__DEFAULT-COLOR__": string;
};

/**
 * Lefse 配置
 */
export interface ILefseOption {
  // node 组
  groups: NodeOptions[][];
  // 高亮配置
  // highlight: HighlightOptions;

  groupPadding?: number; // 组间距
  // 图例配置
  legend?: Record<string, any>;
}

export interface Node {
  name: string;
  value: number;
  children?: Node[];
  [key: string]: any;
}

export interface NodeGroup {
  name: string;
  root: Node;
  [key: string]: any;
}
