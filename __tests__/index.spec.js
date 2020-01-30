import RBTree, { RBColor } from '../src/';

function format(n) {
  const key = n.key || '*';
  const val = n.val || '*';
  const content = key;
  return n.color === RBColor.RED ? content + ':0' : content + ':1';
}

function size(n) {
  return format(n).length;
}

describe('red-black-tree', () => {
  it('works', () => {
    const tree = new RBTree();

    let data = [27, 25, 22, 17, 15, 13, 11, 8, 6, 1];

    function check() {
      expect(tree.getBlackCount()).toMatchSnapshot();
      expect(tree.visualize(format, size)).toMatchSnapshot();
    }

    for (const d of data) {
      tree.insert(d, d);
      check();
    }

    // console.log(tree.visualize(format, size));

    for (const d of data) {
      expect(tree.find(d)).toBe(d);
    }

    expect(tree.lowerBound(9)).toBe(11);
    expect(tree.upperBound(18)).toBe(17);

    data = [11, 15, 22, 17, 6, 25, 8, 27, 1, 13];

    for (const d of data) {
      tree.delete(d);
      check();
    }
  });
});
