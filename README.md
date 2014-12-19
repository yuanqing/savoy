# Savoy.js [![npm Version](http://img.shields.io/npm/v/savoy.svg?style=flat)](https://www.npmjs.org/package/savoy) [![Build Status](https://img.shields.io/travis/yuanqing/savoy.svg?style=flat)](https://travis-ci.org/yuanqing/savoy) [![Coverage Status](https://img.shields.io/coveralls/yuanqing/savoy.svg?style=flat)](https://coveralls.io/r/yuanqing/savoy)

> Higher-order functions (synchronous and asynchronous each/map/filter/fold) and functions for flow control (parallel/series/waterfall) in under 1 KB.

- API is similar to that of the [async](https://github.com/caolan/async) library
- 2.2 KB [minified](https://github.com/yuanqing/savoy/blob/master/savoy.min.js), or about 0.9 KB minified and gzipped
- [Legible tests](https://github.com/yuanqing/savoy/blob/master/test), with [100% coverage](https://coveralls.io/r/yuanqing/savoy)

## Why

Mainly [this](https://github.com/timoxley/best-practices#reinvent-the-wheel):

> Inventing your own wheels gives you a deep appreciation and understanding of how wheels work and what makes a good one.

## API

In all of the method signatures below, `collection` (in each/map/filter/fold) and `fns` (in parallel/series/waterfall) can either be an Array or an Object literal.

- [`each`](#each)
- [`map`](#map)
- [`filter`](#filter)
- [`fold`](#fold)
- [`parallel`](#parallel)
- [`series`](#series)
- [`waterfall`](#waterfall)

### each

**savoy.each(collection, fn)** &mdash; *synchronous each*

```js
savoy.each([1, 2, 3], function(val, i, arr) {
  console.log(val, i, arr);
  //=> 1, 0, [ 1, 2, 3 ]
  //=> 2, 1, [ 1, 2, 3 ]
  //=> 3, 2, [ 1, 2, 3 ]
});
```

- Break from the loop by explicitly returning `false` from `fn`:

  ```js
  savoy.each([1, 2, 3], function(val, i, arr) {
    console.log(val, i, arr);
    //=> 1, 0, [ 1, 2, 3 ]
    //=> 2, 1, [ 1, 2, 3 ]
    if (i === 1) {
      return false;
    }
  });
  ```

**savoy.each(collection, fn, done)** &mdash; *asynchronous each*

```js
savoy.each({ a: 1, b: 2, c: 3 }, function(cb, val, key, obj) {
  console.log(val, key, obj);
  //=> 1, 'a', { a: 1, b: 2, c: 3 }
  //=> 2, 'b', { a: 1, b: 2, c: 3 }
  //=> 3, 'c', { a: 1, b: 2, c: 3 }
  cb();
}, function(err) {
  console.log(err);
  //=> null
});
```

- `fn` is called in *parallel* over each item in `collection`.
- Invoke the `cb` callback in `fn` to signal the end of `fn`. (Note that `cb` is the *first* argument of `fn`.)

### map

**savoy.map(collection, fn)** &mdash; *synchronous map*

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

**savoy.map(collection, fn, done)** &mdash; *asynchronous map*

```js
savoy.map([1, 2, 3], function(cb, val, i, arr) {
  console.log(val, i, arr);
  //=> 1, 0, [1, 2, 3]
  //=> 2, 1, [1, 2, 3]
  //=> 3, 2, [1, 2, 3]
  cb(null, val * 2);
}, function(err, result) {
  console.log(err, result);
  //=> null, [2, 4, 6]
});
```

- `fn` is called in *parallel* over each item in `collection`.
- `result` will be of the same type as `collection`, ie. if `collection` was an Object, `result` will also be an Object.
- Items in `result` will be in the same order as they were in `collection`.

### filter

**savoy.filter(collection, fn)** &mdash; *synchronous filter*

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

**savoy.filter(collection, fn, done)** &mdash; *asynchronous filter*

```js
savoy.filter({ a: 1, b: 2, c: 3 }, function(cb, val, key, obj) {
  console.log(val, key, obj);
  //=> 1, 'a', { a: 1, b: 2, c: 3 }
  //=> 2, 'b', { a: 1, b: 2, c: 3 }
  //=> 3, 'c', { a: 1, b: 2, c: 3 }
  cb(null, val > 1);
}, function(err, result) {
  console.log(err, result);
  //=> null, { b: 2, c: 3 }
});
```

- `fn` is called in *parallel* over each item in `collection`.
- `result` will be of the same type as `collection`, ie. if `collection` was an Object, `result` will also be an Object.
- Items in `result` will be in the same relative order as they were in `collection`.

### fold

**savoy.fold(collection, acc, fn)** &mdash; *synchronous fold*

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

**savoy.fold(collection, acc, fn, done)** &mdash; *asynchronous fold*

```js
savoy.fold([1, 2, 3], 0, function(cb, acc, val, i, arr) {
  console.log(acc, val, i, arr);
  //=> 0, 1, 0, [1, 2, 3]
  //=> 1, 2, 1, [1, 2, 3]
  //=> 3, 3, 2, [1, 2, 3]
  cb(null, acc + val);
}, function(err, result) {
  console.log(err, result);
  //=> null, 6
});
```

- `fn` is called in *series* for each item in `collection`.

### parallel

**savoy.parallel(fns, done)**

```js
savoy.parallel([
  function(cb) {
    cb(null, 1);
  },
  function(cb) {
    cb(null, 2);
  },
  function(cb) {
    cb(null, 3);
  }
], function(err, result) {
  console.log(err, result);
  //=> null, [1, 2, 3]
});
```

- Each function in `fns` is called in *parallel*.
- The second argument passed to `cb` by each function is collected in `result`.

### series

**savoy.series(fns, done)**

```js
savoy.series({
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
  //=> null, { a: 1, b: 2, c: 3 }
});
```

- Each function in `fns` is called in *series*.
- The second argument passed to `cb` by each function is collected in `result`.

### waterfall

**savoy.waterfall(fns, done)**

```js
savoy.waterfall([
  function(cb) {
    cb(null, 'a', 'b');
  },
  function(cb, arg1, arg2) {
    console.log(arg1, arg2);
    //=> 'a', 'b'
    cb(null, 'c');
  },
  function(cb, args) {
    console.log(args);
    //=> 'c'
    cb(null, 'd');
  }
], function(err, arg) {
  console.log(err, arg);
  //=> null, 'd'
});
```

- Each function in `fns` is called in *series*.
- All other arguments other than the first argument that are passed to `cb` by each function in `fns` will be passed on to the next function in `fns`.

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

- 0.2.0
  - Major rewrite to prioritise [performance](https://youtube.com/watch?v=NthmeLEhDDM) over minimising the file size
  - Add `series`
  - Make synchronous `each` breakable
- 0.1.0
  - Initial release

## License

[MIT license](https://github.com/yuanqing/savoy/blob/master/LICENSE)
