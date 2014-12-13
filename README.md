# Savoy.js [![npm Version](http://img.shields.io/npm/v/savoy.svg?style=flat)](https://www.npmjs.org/package/savoy) [![Build Status](https://img.shields.io/travis/yuanqing/savoy.svg?style=flat)](https://travis-ci.org/yuanqing/savoy) [![Coverage Status](https://img.shields.io/coveralls/yuanqing/savoy.svg?style=flat)](https://coveralls.io/r/yuanqing/savoy)

> Higher-order functions (each/map/filter/fold) and functions for flow control (parallel/waterfall) in about 0.5 KB.

- API is similar to that of the [async](https://github.com/caolan/async) library
- 1.1 KB [minified](https://github.com/yuanqing/savoy/blob/master/savoy.min.js), or about 0.5 KB minified and gzipped
- [Legible tests](https://github.com/yuanqing/savoy/blob/master/test), with [100% coverage](https://coveralls.io/r/yuanqing/savoy)

## Why

Well, mainly [this](https://github.com/timoxley/best-practices#reinvent-the-wheel):

> Inventing your own wheels gives you a deep appreciation and understanding of how wheels work and what makes a good one.

## API

In all of the method signatures below, `arr` can either be an Array or an Object.

- [`each`](https://github.com/yuanqing/savoy#each)
- [`map`](https://github.com/yuanqing/savoy#map)
- [`filter`](https://github.com/yuanqing/savoy#filter)
- [`fold`](https://github.com/yuanqing/savoy#fold)
- [`parallel`](https://github.com/yuanqing/savoy#parallel)
- [`waterfall`](https://github.com/yuanqing/savoy#waterfall)

### each

**savoy.each(arr, fn)** &mdash; *synchronous each*

```js
savoy.each([1, 2, 3], function(val, i, arr) {
  console.log(val, i, arr);
  //=> 1, 0, [ 1, 2, 3 ]
  //=> 2, 1, [ 1, 2, 3 ]
  //=> 3, 2, [ 1, 2, 3 ]
});
```

**savoy.each(arr, fn, done)** &mdash; *asynchronous each*

```js
savoy.each({ a: 1, b: 2, c: 3 }, function(cb, val, key, obj) {
  console.log(val, key, obj);
  //=> 1, 'a', { a: 1, b: 2, c: 3 }
  //=> 2, 'b', { a: 1, b: 2, c: 3 }
  //=> 3, 'c', { a: 1, b: 2, c: 3 }
  cb();
}, function(err) {
  console.log(err);
  //=> 0
});
```

- `fn` is called in parallel for each item in `arr`.
- The `cb` callback (invoked to signal the end of `fn`) is the *first* argument of `fn`.

### map

**savoy.map(arr, fn)** &mdash; *synchronous map*

```js
var result = savoy.map({ a: 1, b: 2, c: 3 }, function(val, key, obj) {
  console.log(val, key, obj);
  //=> 1, 'a', { a: 1, b: 2, c: 3 }
  //=> 2, 'b', { a: 1, b: 2, c: 3 }
  //=> 3, 'c', { a: 1, b: 2, c: 3 }
  return val * 2;
});
console.log(result);
//=> { a: 2, b: 4, c: 6 }
```

**savoy.map(arr, fn, done)** &mdash; *asynchronous map*

```js
savoy.map([1, 2, 3], function(cb, val, i, arr) {
  console.log(val, i, arr);
  //=> 1, 0, [1, 2, 3]
  //=> 2, 1, [1, 2, 3]
  //=> 3, 2, [1, 2, 3]
  cb(null, val * 2);
}, function(err, result) {
  console.log(err, result);
  //=> 0, [2, 4, 6]
});
```

- `fn` is called in parallel for each item in `arr`.
- Items in `result` will be in the same order as they were in the original `arr`.

### filter

**savoy.filter(arr, fn)** &mdash; *synchronous filter*

```js
var result = savoy.filter([1, 2, 3], function(val, i, arr) {
  console.log(val, i, arr);
  //=> 1, 0, [1, 2, 3]
  //=> 2, 1, [1, 2, 3]
  //=> 3, 2, [1, 2, 3]
  return val > 1;
});
console.log(result);
//=> [2, 3]
```

**savoy.filter(arr, fn, done)** &mdash; *asynchronous filter*

```js
savoy.filter({ a: 1, b: 2, c: 3 }, function(cb, val, key, obj) {
  console.log(val, key, obj);
  //=> 1, 'a', { a: 1, b: 2, c: 3 }
  //=> 2, 'b', { a: 1, b: 2, c: 3 }
  //=> 3, 'c', { a: 1, b: 2, c: 3 }
  cb(null, val > 1);
}, function(err, result) {
  console.log(err, result);
  //=> 0, { b: 2, c: 3 }
});
```

- `fn` is called in parallel for each item in `arr`.
- Items in `result` may *not* be in the same relative order as they were in the original `arr`.

### fold

**savoy.fold(arr, acc, fn)** &mdash; *synchronous fold*

```js
var result = savoy.fold({ a: 1, b: 2, c: 3 }, 0, function(acc, val, key, obj) {
  console.log(acc, val, key, obj);
  //=> 1, 'a', { a: 1, b: 2, c: 3 }
  //=> 2, 'b', { a: 1, b: 2, c: 3 }
  //=> 3, 'c', { a: 1, b: 2, c: 3 }
  return acc + val;
});
console.log(result);
//=> 6
```

**savoy.fold(arr, acc, fn, done)** &mdash; *asynchronous fold*

```js
savoy.fold([1, 2, 3], 0, function(cb, acc, val, i, arr) {
  console.log(acc, val, i, arr);
  //=> 0, 1, 0, [1, 2, 3]
  //=> 1, 2, 1, [1, 2, 3]
  //=> 3, 3, 2, [1, 2, 3]
  cb(null, acc + val);
}, function(err, result) {
  console.log(err, result);
  //=> 0, 6
});
```

- `fn` is called in series for each item in `arr`.

### parallel

**savoy.parallel(arr, done)**

```js
savoy.parallel({
  a: function(cb) {
    cb(null, 1);
  },
  b: function(cb) {
    cb(null, 2);
  },
  c: function(cb) {
    cb(null, 3);
  }
}, function(err, result) {
  console.log(err, result);
  //=> 0, { a: 1, b: 2, c: 3 }
});
```

- Each function in `arr` is called in parallel.
- The second argument passed to `cb` by each function is collected in `result`.

### waterfall

**savoy.waterfall(arr, done)**

```js
savoy.waterfall([
  function(cb) {
    cb(null, 'a');
  },
  function(cb, args) {
    console.log(args);
    //=> 'a'
    cb(null, 'b');
  },
  function(cb, args) {
    console.log(args);
    //=> 'b'
    cb(null, 'c');
  }
], function(err, result) {
  console.log(err, result);
  //=> 0, 'c'
});
```

- Each function in `arr` is called in series.
- The second argument passed to `cb` by each function is passed on to the next function in `arr`.

## Installation

Install via [npm](https://www.npmjs.org/):

```bash
$ npm i --save savoy
```

Install via [bower](http://bower.io/):

```bash
$ bower i --save yuanqing/savoy
```

To use Savoy in the browser, include [the minified script](https://github.com/yuanqing/savoy/blob/master/savoy.min.js) in your HTML:

```html
<body>
  <!-- ... -->
  <script src="path/to/savoy.min.js"></script>
  <script>
    // savoy available here
  </script>
</body>
```

## Changelog

- 0.1.0
  - Initial release

## License

[MIT license](https://github.com/yuanqing/savoy/blob/master/LICENSE)
