import { NodeOptions } from "@/types/lefse";

export interface Node {
  name: string;
  [key: string]: any;
}

export interface TreeNode {
  x: number;
  y: number;
  width: number;
  name: string;
  isLeaf?: boolean;
  [key: string]: any;
}

export interface TreeLink {
  x: number;
  y: number;
  x1: number;
  y1: number;
}

export interface Tree extends TreeNode {
  _x: Extremes;
  _y: Extremes;
  _childCount: number;
  children?: Tree[];
}

export interface ITreeLayoutOptions {
  nodeSpacing: number;
  levelSpacing: number;
  nodeSize: number;
  groupPadding: number;
}

const defaultTreeLayoutOptions: ITreeLayoutOptions = {
  nodeSpacing: 1,
  levelSpacing: 1,
  nodeSize: 1,
  groupPadding: 1,
};

export type Extremes = { min: number; max: number };

const initalExtremes: Extremes = { min: Infinity, max: -Infinity };

export type NodeInput = [string | undefined, string, number][];

export type OnTreeParams = {
  parent?: Tree;
  childIndex?: number;
  [key: string]: any;
};
export type OnTree = (tree: Tree, params: OnTreeParams) => void;

class TreeLayout {
  options: ITreeLayoutOptions;

  nameMap: Record<string, Tree> = {};

  static ROOTNAME = "__ROOT__";

  root: Tree = {
    name: TreeLayout.ROOTNAME,
    x: 0,
    y: 0,
    _x: { ...initalExtremes },
    _y: { ...initalExtremes },
    _childCount: 0,
    width: 0,
    isLeaf: false,
    children: [],
  };

  static ToNode(nodes: NodeOptions[]) {
    let nodeNameMap: Record<string, Node> = {};
    let root: Node | undefined;
    nodes.forEach((nodeOption) => {
      const node: Node = {
        name: nodeOption[1],
        value: nodeOption[2],
        children: [],
        groupName: nodeOption.length > 3 ? nodeOption[3] : undefined,
      };
      nodeNameMap[node.name] = node;
      if (nodeOption[0] === undefined) {
        // TODO: 每个组必须只有一个 node 的 from 为 undefined,需要额外的数据检查。
        if (root) {
          throw new Error(
            `TreeLayout Error #2： 存在多个 Root 节点，请检查数据.`,
          );
        }
        root = node;
      } else {
        nodeNameMap[nodeOption[0]]?.children?.push(node);
      }
    });

    if (!root) {
      throw new Error(`TreeLayout Error #1： 未找到 root 节点，请检查数据。`);
    }

    return root;
  }

  constructor(options: Partial<ITreeLayoutOptions>) {
    this.options = {
      ...defaultTreeLayoutOptions,
      ...options,
    };
  }

  addGroup(groupRoot: Node) {
    const group = this._toTree(groupRoot);
    this._secondWalk(group, -group.width / 2, 0);
    this.root.children?.push(group);
    this.root._x = this._mergeExtremes(this.root._x, group._x);
    this.root._y = this._mergeExtremes(this.root._y, group._y);
    return group;
  }

  getExtremes() {
    return {
      x: {
        min: 0,
        max:
          this.root._x.max -
          this.root._x.min +
          this.options.groupPadding * (this.root.children as Tree[]).length,
      },
      y: {
        ...this.root._y,
      },
    };
  }

  toData(onNode: OnTree) {
    console.log(this.root);
    let xOffset = 0;

    this.walkTree((tree: Tree, params: OnTreeParams) => {
      let isGroupRoot = false;
      if (tree.name === TreeLayout.ROOTNAME) {
        // root extrems
        tree.children?.forEach((child) => {
          tree._x = this._mergeExtremes(tree._x, child._x);
          tree._y = this._mergeExtremes(tree._y, child._y);
        });
        //xOffset = Math.abs(tree._x.min);
        return;
      } else if (params.parent && params.parent.name === TreeLayout.ROOTNAME) {
        let min = (this.root.children as Tree[])[params.childIndex as number]._x
          .min;
        xOffset = min < 0 ? Math.abs(min) : 0;

        if (params.childIndex) {
          xOffset += this.options.groupPadding;
        }
        isGroupRoot = true;
      }

      params.xOffset = xOffset;
      params.isGroupRoot = isGroupRoot;
      onNode(tree, params);
    });

    return xOffset + this.options.groupPadding;
  }

  _calcExtremes(value: number, extrems: Extremes) {
    if (value < extrems.min) {
      extrems.min = value;
    }
    if (value > extrems.max) {
      extrems.max = value;
    }
  }

  _mergeExtremes(target: Extremes, source: Extremes) {
    // if (target.max < source.max) {
    //   target.max = source.max;
    // }
    // if (target.min > source.min) {
    //   target.min = source.min;
    // }
    //
    return {
      min: target.min < source.min ? target.min : source.min,
      max: target.max > source.max ? target.max : source.max,
    };
  }

  walkTree(onTree: OnTree) {
    this._walk(this.root, onTree);
  }

  _secondWalk(tree: Tree, x: number, y: number) {
    tree.x = x + tree.width / 2;
    tree.y = y;

    if (!tree.children) {
      tree._x = { min: tree.x, max: tree.x };
      tree._y = { min: tree.y, max: tree.y };
      tree.isLeaf = true;
    } else {
      let childX = x;
      let childCount = tree.children.length;

      tree.children.forEach((child) => {
        this._secondWalk(child, childX, y + this.options.levelSpacing);
        childX += child.width + this.options.nodeSpacing;
        if (!child.isLeaf) {
          childCount += child._childCount;
        }
        tree._x = this._mergeExtremes(tree._x, child._x);
        tree._y = this._mergeExtremes(tree._y, child._y);
      });

      // x Extremes
      let levelX = {
        min: tree.children[0].x,
        max: tree.children[tree.children.length - 1].x,
      };
      tree.x = levelX.min + (levelX.max - levelX.min) / 2;
      tree._x = this._mergeExtremes(tree._x, levelX);
      // tree._

      // y Extremes
      this._calcExtremes(tree.y, tree._y);
      tree._childCount = childCount;
    }
  }

  _walk(tree: Tree, onTree: OnTree, parent?: Tree, childIndex?: number) {
    if (tree.children) {
      tree.children.forEach((child, index) => {
        this._walk(child, onTree, tree, index);
      });
    }

    onTree.call(this, tree, { parent, childIndex });
  }

  /**
   * first Walk
   * @param node
   * @returns
   */
  _toTree(node: Node) {
    let tree: Tree = {
      ...node,
      x: 0,
      y: 0,
      _x: { ...initalExtremes },
      _y: { ...initalExtremes },
      _childCount: 0,
      width: 0,
      children:
        node.children && node.children.length
          ? node.children.map((child: any) => {
              return this._toTree(child);
            })
          : undefined,
    };

    let childrenWidth = 0;
    let xSpacing = 0;
    if (tree.children) {
      tree.children.forEach((child) => {
        childrenWidth += child.width;
      });
      xSpacing = this.options.nodeSpacing * (tree.children.length - 1);
    }

    tree.width = Math.max(this.options.nodeSpacing, childrenWidth + xSpacing);

    this.nameMap[tree.name] = tree;
    return tree;
  }
}

export default TreeLayout;
