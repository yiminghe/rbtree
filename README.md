# @yiminghe/rbtree
---

red-black tree

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/@yiminghe/rbtree.svg?style=flat-square
[npm-url]: http://npmjs.org/package/@yiminghe/rbtree
[travis-image]: https://img.shields.io/travis/yiminghe/rbtree.svg?style=flat-square
[travis-url]: https://travis-ci.org/yiminghe/rbtree
[coveralls-image]: https://img.shields.io/coveralls/yiminghe/rbtree.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/yiminghe/rbtree?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/yiminghe/rbtree.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/yiminghe/rbtree
[node-image]: https://img.shields.io/badge/node.js-%3E=10.0.0-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/@yiminghe/rbtree.svg?style=flat-square
[download-url]: https://npmjs.org/package/@yiminghe/rbtree

## usage

```
import RBTree from '@yiminghe/rbtree';
const tree = new RBTree();

tree.insert(10,'a');
tree.insert(11,'b');
tree.delete(10);

console.log(tree.find(10)) // => undefined
console.log(tree.find(11)) // => 'b'
```

## API

### class RBTree

### methods

### constructor(sorter:(aKey, bKey)=>number)

key sort function. aKey>bKey:>0, aKey==bKey:0, aKey<bKey:<0, sorter defaults to: (a,b)=>a-b;

#### insert(key:any,value:any)

#### delete(key:any)

#### has(key:any):boolean

check whether tree has key node

#### find(key:any)

find value associated with this key
