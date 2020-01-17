export enum RBColor {
  RED,
  BLACK
}

export class RBNode {
  parent: RBNode;
  left: RBNode;
  right: RBNode;
  color: RBColor;
  val: any;
  key: any;
  order: number;

  constructor() {
    this.parent = null as any;
    this.left = null as any;
    this.right = null as any;
    this.color = RBColor.RED;
    this.val = null;
    this.key = null as any;
    this.order = -1;
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
}
