// https://github.com/julycoding/The-Art-Of-Programming-By-July/blob/master/ebook/zh/03.01.md
// https://www.jianshu.com/p/e136ec79235c

import { RBColor, RBNode, isNodeNil, RBNodeOrNull } from './rbnode';
import visualize, { FormatFunc, SizeFunc } from './visualize';

function defaultSorter(a: any, b: any) {
  return a - b;
}

export interface SorterFunc {
  (a: any, b: any): number;
}

export interface MergerFunc {
  (a: any, b: any): any;
}

class RBTree {
  root: RBNode;
  sorter: SorterFunc;
  merger?: MergerFunc;

  constructor(sorter: SorterFunc = defaultSorter, merger?: MergerFunc) {
    this.root = this.newNil();
    this.sorter = sorter||defaultSorter;
    this.merger = merger;
  }

  getBlackCount(): number {
    if (isNodeNil(this.root)) {
      return 0;
    }
    if (this.root.color !== RBColor.BLACK) {
      throw new Error('invalid root color');
    }
    return this.checkNode(this.root);
  }

  checkNode(n: RBNode) {
    if (!isNodeNil(n.left) && this._gtekey(n.left.key, n.key)) {
      throw new Error('invalid sort: ' + n.key);
    }
    if (!isNodeNil(n.right) && this._ltkey(n.right.key, n.key)) {
      throw new Error('invalid key: ' + n.key);
    }
    if (n.color === RBColor.RED) {
      if (!isNodeNil(n.left) && n.left.color !== RBColor.BLACK) {
        throw new Error('invalid left color: ' + n.key);
      }
      if (!isNodeNil(n.right) && n.right.color !== RBColor.BLACK) {
        throw new Error('invalid right color: ' + n.key);
      }
    }
    const myCount = n.color === RBColor.BLACK ? 1 : 0;
    if (isNodeNil(n.left) && isNodeNil(n.right)) {
      return myCount;
    }
    const leftCount: number = isNodeNil(n.left) ? 0 : this.checkNode(n.left);
    const rightCount: number = isNodeNil(n.right) ? 0 : this.checkNode(n.right);
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
    if (isNodeNil(x.parent)) {
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
    if (isNodeNil(x.parent)) {
      this.root = y;
    } else if (x.isLeftNode()) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }
    y.right = x;
    x.parent = y;
  }

  insert(key: any, val?: any) {
    const n = this.newNode();
    n.key = key;
    n.val = val;
    this.insertNode(n);
  }

  insertNode(z: RBNode) {
    let x: RBNode, y: RBNode;
    y = this.newNil();
    x = this.root;
    while (!isNodeNil(x)) {
      y = x;
      if (this._eqkey(z.key, x.key)) {
        if (this.merger) {
          x.val = this.merger(x.val, z.val);
        } else {
          x.val = z.val;
        }
        return;
      } else if (this._ltkey(z.key, x.key)) {
        x = x.left;
      } else {
        x = x.right;
      }
    }
    z.parent = y;
    if (isNodeNil(y)) {
      this.root = z;
    } else if (this._ltkey(z.key, y.key)) {
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
    while (!isNodeNil(p.right)) {
      p = p.right;
    }
    return p;
  }

  _ltkey(a: any, b: any) {
    return this.sorter(a, b) < 0;
  }

  _ltekey(a: any, b: any) {
    return this.sorter(a, b) <= 0;
  }

  _gtkey(a: any, b: any) {
    return this.sorter(a, b) > 0;
  }

  _gtekey(a: any, b: any) {
    return this.sorter(a, b) >= 0;
  }

  _eqkey(a: any, b: any) {
    return this.sorter(a, b) === 0;
  }

  findNode(key: any) {
    let ret;
    let n = this.root;
    while (!isNodeNil(n)) {
      if (this._eqkey(n.key, key)) {
        ret = n;
        break;
      }
      if (this._gtkey(n.key, key)) {
        n = n.left;
      } else {
        n = n.right;
      }
    }
    return ret;
  }

  has(key: any) {
    return !!this.findNode(key);
  }

  find(key: any) {
    const node = this.findNode(key);
    if (node) {
      return node.val;
    }
  }

  delete(key: any) {
    const node = this.findNode(key);
    if (node) {
      this.deleteNode(node);
    }
  }

  deleteNode(z: RBNode) {
    let x;
    let y;

    if (isNodeNil(z.left) || isNodeNil(z.right)) {
      y = z;
    } else {
      y = this.successor(z);
    }

    if (!isNodeNil(y.left)) {
      x = y.left;
    } else {
      x = y.right;
    }

    x.parent = y.parent;

    if (isNodeNil(y.parent)) {
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

  lowerBoundNode(k: any): RBNodeOrNull {
    let c = this.root;
    let n = undefined;
    while (!isNodeNil(c)) {
      if (c.key === k) {
        return c;
      }
      if (this._gtkey(c.key, k)) {
        n = c;
        c = c.left;
      } else {
        c = c.right;
      }
    }
    return n;
  }

  lowerBound(k:any):any {
    const n = this.lowerBoundNode(k);
    return n && n.val;
  }

  upperBound(k:any) {
    const n = this.upperBoundNode(k);
    return n && n.val;
  }

  upperBoundNode(k: any): RBNodeOrNull {
    let c = this.root;
    let n = undefined;
    while (!isNodeNil(c)) {
      if (c.key === k) {
        return c;
      }
      if (this._gtkey(c.key, k)) {
        c = c.left;
      } else {
        n = c;
        c = c.right;
      }
    }
    return n;
  }

  visualize(format: FormatFunc, size: SizeFunc) {
    return visualize(this.root, format, size);
  }
}


export default RBTree;
