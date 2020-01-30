export enum RBColor {
  RED,
  BLACK
}

export type RBNodeOrNull = RBNode | null | undefined;

export function isNodeNil(n: RBNodeOrNull): boolean {
  return !!(n && n.key === null);
}

export class RBNode {
  parent: RBNode;
  left: RBNode;
  right: RBNode;
  color: RBColor;
  val: any;
  key: any;

  constructor() {
    this.parent = null as any;
    this.left = null as any;
    this.right = null as any;
    this.color = RBColor.RED;
    this.val = null;
    this.key = null as any;
  }

  isLeftNode(): boolean {
    return this.parent.left === this;
  }

  isRightNode(): boolean {
    return this.parent.right === this;
  }

  getParent(level = 1): RBNode {
    let p: RBNode = this;
    while (level) {
      p = p.parent;
      --level;
    }
    return p;
  }

  getNext(): RBNodeOrNull {
    let n = this.right;
    if (!isNodeNil(n)) {
      while (!isNodeNil(n.left)) {
        n = n.left;
      }
    } else {
      let p: RBNode = this;
      n = p.parent;
      while (!isNodeNil(n) && n.right === p) {
        p = n;
        n = n.parent;
      }
    }
    return !isNodeNil(n) ? n : null;
  }

  distance(node: RBNode):number {
    let n:RBNodeOrNull = this;
    let ret = 0;
    while (n && n !== node) {
      n = n.getNext();
      ++ret;
    }
    return n === node ? ret : -1;
  }
}
