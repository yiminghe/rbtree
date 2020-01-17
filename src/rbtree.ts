// https://github.com/julycoding/The-Art-Of-Programming-By-July/blob/master/ebook/zh/03.01.md
// https://www.jianshu.com/p/e136ec79235c

import { RBColor, RBNode } from './rbnode';
import visualize, { FormatFunc, SizeFunc } from './visualize';

function isNil(n: RBNode | null): boolean {
  return !!(n && n.key === null);
}

class RBTree {
  root: RBNode;

  constructor() {
    this.root = this.newNil();
  }

  getBlackCount(): number {
    if (isNil(this.root)) {
      return 0;
    }
    if (this.root.color !== RBColor.BLACK) {
      throw new Error('invalid root color');
    }
    return this.checkNode(this.root);
  }

  checkNode(n: RBNode) {
    if (!isNil(n.left) && n.left.key >= n.key) {
      throw new Error('invalid sort: ' + n.key);
    }
    if (!isNil(n.right) && n.right.key < n.key) {
      throw new Error('invalid key: ' + n.key);
    }
    if (n.color === RBColor.RED) {
      if (!isNil(n.left) && n.left.color !== RBColor.BLACK) {
        throw new Error('invalid left color: ' + n.key);
      }
      if (!isNil(n.right) && n.right.color !== RBColor.BLACK) {
        throw new Error('invalid right color: ' + n.key);
      }
    }
    const myCount = n.color === RBColor.BLACK ? 1 : 0;
    if (isNil(n.left) && isNil(n.right)) {
      return myCount;
    }
    const leftCount: number = isNil(n.left) ? 0 : this.checkNode(n.left);
    const rightCount: number = isNil(n.right) ? 0 : this.checkNode(n.right);
    if (leftCount !== rightCount) {
      throw new Error('invalid count: ' + n.key + ` (${leftCount}:${rightCount})`);
    }
    return myCount + leftCount;
  }

  newNil() {
    const nil = new RBNode();
    nil.color = RBColor.BLACK;
    return nil;
  }

  newNode() {
    const n = new RBNode();
    n.left = this.newNil();
    n.right = this.newNil();
    n.parent = this.newNil();
    n.left.parent = n;
    n.right.parent = n;
    return n;
  }

  leftRotate(x: RBNode) {
    const y: RBNode = x.right;
    x.right = y.left;
    y.left.parent = x;
    y.parent = x.parent;
    if (isNil(x.parent)) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }
    y.left = x;
    x.parent = y;
  }

  rightRotate(x: RBNode) {
    const y: RBNode = x.left;
    x.left = y.right;
    y.right.parent = x;
    y.parent = x.parent;
    if (isNil(x.parent)) {
      this.root = y;
    } else if (x.isLeftNode()) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }
    y.right = x;
    x.parent = y;
  }

  insert(key: number, val: any) {
    const n = this.newNode();
    n.key = key;
    n.val = val;
    this.insertNode(n);
  }

  insertNode(z: RBNode) {
    let x: RBNode, y: RBNode;
    y = this.newNil();
    x = this.root;
    while (!isNil(x)) {
      y = x;
      if (z.key === x.key) {
        throw new Error('duplicated key: ' + z.key);
      } else if (z.key < x.key) {
        x = x.left;
      } else {
        x = x.right;
      }
    }
    z.parent = y;
    if (isNil(y)) {
      this.root = z;
    } else if (z.key < y.key) {
      y.left = z;
    } else {
      y.right = z;
    }
    z.color = RBColor.RED;
    this.insertFixup(z);
  }

  insertFixup(z: RBNode) {
    let y: RBNode;
    while (z.parent.color === RBColor.RED) {
      if (z.parent.isLeftNode()) {
        y = z.getParent(2).right;
        if (y.color === RBColor.RED) {
          z.parent.color = RBColor.BLACK;
          y.color = RBColor.BLACK;
          z.getParent(2).color = RBColor.RED;
          z = z.getParent(2);
        } else if (z.isRightNode()) {
          z = z.parent;
          this.leftRotate(z);
        } else {
          z.parent.color = RBColor.BLACK;
          z.getParent(2).color = RBColor.RED;
          this.rightRotate(z.getParent(2));
        }
      } else {
        y = z.getParent(2).left;
        if (y.color === RBColor.RED) {
          z.parent.color = RBColor.BLACK;
          y.color = RBColor.BLACK;
          z.getParent(2).color = RBColor.RED;
          z = z.getParent(2);
        } else if (z.isLeftNode()) {
          z = z.parent;
          this.rightRotate(z);
        } else {
          z.parent.color = RBColor.BLACK;
          z.getParent(2).color = RBColor.RED;
          this.leftRotate(z.getParent(2));
        }
      }
    }
    this.root.color = RBColor.BLACK;
  }

  successor(z: RBNode) {
    let p = z.left;
    while (!isNil(p.right)) {
      p = p.right;
    }
    return p;
  }

  findNode(key: number) {
    let ret;
    let n = this.root;
    while (!isNil(n)) {
      if (n.key === key) {
        ret = n;
        break;
      }
      if (n.key > key) {
        n = n.left;
      } else {
        n = n.right;
      }
    }
    return ret;
  }

  find(key: number) {
    const node = this.findNode(key);
    if (node) {
      return node.val;
    }
  }

  delete(key: number) {
    const node = this.findNode(key);
    if (node) {
      this.deleteNode(node);
    }
  }

  deleteNode(z: RBNode) {
    let x;
    let y;

    if (isNil(z.left) || isNil(z.right)) {
      y = z;
    } else {
      y = this.successor(z);
    }

    if (!isNil(y.left)) {
      x = y.left;
    } else {
      x = y.right;
    }

    x.parent = y.parent;

    if (isNil(y.parent)) {
      this.root = x;
    } else if (y.isLeftNode()) {
      y.parent.left = x;
    } else {
      y.parent.right = x;
    }

    if (y !== z) {
      z.key = y.key;
    }

    if (y.color === RBColor.BLACK) {
      this.deleteFixup(x);
    }

    return y;
  }

  deleteFixup(x: RBNode) {
    let w;
    while (x !== this.root && x.color === RBColor.BLACK) {
      if (x.isLeftNode()) {
        w = x.parent.right;

        if (w.color === RBColor.RED) {
          w.color = RBColor.BLACK;
          x.parent.color = RBColor.RED;
          this.leftRotate(x.parent);
        } else {
          if (w.left.color === RBColor.BLACK && w.right.color === RBColor.BLACK) {
            w.color = RBColor.RED;
            x = x.parent;
          } else if (w.right.color === RBColor.BLACK) {
            w.left.color = RBColor.BLACK;
            w.color = RBColor.RED;
            this.rightRotate(w);
            w = x.parent.right;
          } else {
            w.color = x.parent.color;
            x.parent.color = RBColor.BLACK;
            w.right.color = RBColor.BLACK;
            this.leftRotate(x.parent);
            x = this.root;
          }
        }
      } else {
        w = x.parent.left;

        if (w.color === RBColor.RED) {
          w.color = RBColor.BLACK;
          x.parent.color = RBColor.RED;
          this.rightRotate(x.parent);
        } else {
          if (w.left.color === RBColor.BLACK && w.right.color === RBColor.BLACK) {
            w.color = RBColor.RED;
            x = x.parent;
          } else if (w.left.color === RBColor.BLACK) {
            w.right.color = RBColor.BLACK;
            w.color = RBColor.RED;
            this.leftRotate(w);
            w = x.parent.left;
          } else {
            w.color = x.parent.color;
            x.parent.color = RBColor.BLACK;
            w.left.color = RBColor.BLACK;
            this.rightRotate(x.parent);
            x = this.root;
          }
        }
      }
    }
    x.color = RBColor.BLACK;
  }

  visualize(format: FormatFunc, size: SizeFunc) {
    return visualize(this.root, format, size);
  }
}


export default RBTree;
