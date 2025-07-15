import { Node } from "@/types/lefse";

export interface ITreeLayoutOptions {
  nodeSpacing: number;
  levelSpacing: number;
  nodeSize: number;
}
export type OnNode = (node: any, layout: TreeLayout, parent: any) => void;

export type Extremes = { min: number; max: number };

const initalExtremes: Extremes = { min: Infinity, max: -Infinity };

export class TreeLayout {
  static initalExtremes: Extremes = initalExtremes;

  options: ITreeLayoutOptions = {
    nodeSpacing: 1,
    levelSpacing: 1,
    nodeSize: 1,
  };

  _x: Extremes = { ...initalExtremes };
  _y: Extremes = { ...initalExtremes };
  _total: number = 0;

  constructor(options?: Partial<ITreeLayoutOptions>) {
    if (options) {
      this.options = {
        ...this.options,
        ...options,
      };
    }
  }

  _walkNode(node: Node, onNode: OnNode, parent?: Node) {
    if (node.children && node.children.length) {
      node.children.forEach((child) => {
        this._walkNode(child, onNode, node);
      });
    }
    onNode(node, this, parent);
  }

  calculateLayout(root: Node, toPoints: OnNode, beforeToPoint?: OnNode) {
    //
    this.firstWalk(root);

    const treeWidth = root.width;

    this.secondWalk(root, -treeWidth / 2, 0);

    if (beforeToPoint) {
      this._walkNode(root, beforeToPoint);
    }

    this._walkNode(root, toPoints);
    return root;
  }

  firstWalk(node: Node) {
    if (!node.children || node.children.length === 0) {
      node.width = this.options.nodeSpacing;
      return;
    }

    node.children.forEach((child) => this.firstWalk(child));

    let childrenWidth = 0;
    node.children.forEach((child) => {
      childrenWidth += child.width;
    });

    const spacing = this.options.nodeSpacing * (node.children.length - 1);

    node.width = Math.max(this.options.nodeSpacing, childrenWidth + spacing);
  }

  _calcExtremes(value: number, extremes: Extremes) {
    if (value < extremes.min) {
      extremes.min = value;
    }

    if (value > extremes.max) {
      extremes.max = value;
    }
  }

  secondWalk(node: Node, x: number, y: number) {
    node.x = x + node.width / 2;
    node.y = y;

    // 计算子节点起始位置
    let childX = x;

    if (!node.children || !node.children.length) {
      node.isLeaf = true;
    } else {
      // 递归处理子节点
      let nodeChildrenYExtremes: Extremes = { ...initalExtremes };
      let childCount: number = 0;
      node.children.forEach((child) => {
        this.secondWalk(child, childX, y + this.options.levelSpacing);
        childX += child.width + this.options.nodeSpacing;
        if (!child.isLeaf) {
          childCount += child.stats.childCount;
        }
        this._calcExtremes(child.y, nodeChildrenYExtremes);
      });

      let cMin = node.children[0].x;
      let cMax = node.children[node.children.length - 1].x;

      node.x = cMin + (cMax - cMin) / 2;

      node.stats = {
        x: { min: cMin, max: cMax },
        y: nodeChildrenYExtremes,
        childCount,
      };
    }

    this._calcExtremes(node.x, this._x);
    this._calcExtremes(node.y, this._y);

    return node.x;
  }
}
