import { RBNode } from './rbnode';

function paddingSpace(n: string, l: number) {
  var s = n;
  const prefix = ' ';
  s += '';
  while (s.length < l) {
    s = prefix + s;
  }
  return s;
}


export interface FormatFunc {
  (n: RBNode): string;
}

export interface SizeFunc {
  (n: RBNode): number;
}

function getMaxWidthNode(n: RBNode, fn: SizeFunc): number {
  if (!n) {
    return 0;
  }
  const my = fn(n);
  const left = getMaxWidthNode(n.left, fn);
  const right = getMaxWidthNode(n.right, fn);
  return Math.max(my, left, right);
}

function infix(root: RBNode, order = [0]) {
  if (!root) {
    return;
  }
  infix(root.left, order);
  (root as any).order = ++order[0];
  infix(root.right, order);
}

export default function visualize(n: RBNode, format: FormatFunc, size: SizeFunc) {
  infix(n);
  const maxWidth = getMaxWidthNode(n, size);
  let prevEl;
  let queue = [n];
  let ls = [];
  while (queue.length) {
    prevEl = null;
    let l = '';
    const nq = [];
    for (const currentElement of queue) {
      if (!prevEl) {
        l += (' '.repeat(maxWidth).repeat((currentElement as any).order - 1));
      } else {
        l += (' '.repeat(maxWidth).repeat((currentElement as any).order - (prevEl as any).order - 1));
      }
      prevEl = currentElement;
      l += ' '.repeat(maxWidth - size(currentElement)) + format(currentElement);
      if (currentElement.left) {
        nq.push(currentElement.left);
      }
      if (currentElement.right) {
        nq.push(currentElement.right);
      }
    }
    queue = nq;
    ls.push(l);
  }
  return ls.join('\n');
}
