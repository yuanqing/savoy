# Savoy.js [![npm Version](http://img.shields.io/npm/v/savoy.svg?style=flat)](https://www.npmjs.org/package/savoy) [![Build Status](https://img.shields.io/travis/yuanqing/savoy.svg?style=flat)](https://travis-ci.org/yuanqing/savoy) [![Coverage Status](https://img.shields.io/coveralls/yuanqing/savoy.svg?style=flat)](https://coveralls.io/r/yuanqing/savoy)

> Higher-order functions (synchronous and asynchronous each/eachSeries/map/filter/fold) and functions for flow control (parallel/series/waterfall) in under 1 KB.

- [API](#api) is similar (not identical) to that of the [Async](https://github.com/caolan/async) library
- 2.5 KB [minified](savoy.min.js), or about 0.9 KB minified and gzipped
- [Legible tests](test), with [100% coverage](https://coveralls.io/r/yuanqing/savoy)

## Why

Savoy&rsquo;s higher-order functions differ from Async&rsquo;s in the following ways:
- The signature of the `fn` iterator is different. The `cb` callback (invoked to signal the end of each iteration of `fn`) is the *first* argument of `fn`. In addition, `fn` is also passed the index/key of the current element, and the original `collection` itself.
- If passed is an Object, `map` and `filter` will return an Object. (If passed an Object, Async&rsquo;s `map` and `filter` will return an Array.)

Also, mainly [this](https://github.com/timoxley/best-practices#reinvent-the-wheel):
> Inventing your own wheels gives you a deep appreciation and understanding of how wheels work and what makes a good one.

## API

In all of the method signatures below, `collection` (in each/eachSeries/map/filter/fold) and `fns` (in parallel/series/waterfall) can either be an Array or an Object literal.

- [`each`](#each)
- [`eachSeries`](#eachSeries)
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

- The asynchronous function `fn` is called in *parallel* over each item in `collection`.
- Invoke the `cb` callback in `fn` to signal the end of each iteration of `fn`.
- The signature of the `cb` callback is `cb(err)`. If `err` is truthy, the `done` callback is called exactly once with the `err`.
- When `fn` has completed execution over every item in the `collection`, the `done` callback is called exactly once with a falsy `err`.

### eachSeries

**savoy.eachSeries(collection, fn)** &mdash; *synchronous eachSeries*

- Alias of `savoy.each`.

**savoy.eachSeries(collection, fn, done)** &mdash; *asynchronous eachSeries*

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

- The asynchronous function `fn` is called in *series* over each item in `collection`.
- Invoke the `cb` callback in `fn` to signal the end of each iteration of `fn`.
- The signature of the `cb` callback is `cb(err)`. If `err` is truthy, we stop iterating over the `collection`, and the `done` callback is called exactly once with the `err`.
- When `fn` has completed execution over every item in the `collection`, the `done` callback is called exactly once with a falsy `err`.

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

- The asynchronous function `fn` is called in *parallel* over each item in `collection`.
- Invoke the `cb` callback in `fn` to signal the end of each iteration of `fn`. The signature of the `cb` callback is `cb(err, mapVal)`:
  1. `err` &mdash; If truthy, the `done` callback is called exactly once with the `err`.
  2. `mapVal` &mdash; This is accumulated in the `result` argument of the `done` callback.
- When `fn` has completed execution over every item in the `collection`, the `done` callback is called exactly once with a falsy `err` and the `result` of the map.
- Note that if `collection` is an Object:
  1. `result` will also be an Object.
  2. Items in `result` may *not* be in the same order as their corresponding items in the original `collection`.

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

- The asynchronous function `fn` is called in *parallel* over each item in `collection`.
- Invoke the `cb` callback in `fn` to signal the end of each iteration of `fn`. The signature of the `cb` callback is `cb(err, predicate)`:
  1. `err` &mdash; If truthy, the `done` callback is called exactly once with the `err`.
  2. `predicate` &mdash; If truthy, the current item is added to the `result` argument of the `done` callback.
- When `fn` has completed execution over every item in the `collection`, the `done` callback is called exactly once with a falsy `err` and the `result` of the filter.
- Note that if `collection` is an Object:
  1. `result` will also be an Object.
  2. Items in `result` may *not* be in the same relative order as they were in `collection`.

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

- The asynchronous function `fn` is called in *series* over each item in `collection`.
- Invoke the `cb` callback in `fn` to signal the end of each iteration of `fn`. The signature of the `cb` callback is `cb(err, foldVal)`:
  1. `err` &mdash; If truthy, the `done` callback is called exactly once with the `err`.
  2. `foldVal` &mdash; This is the value for `acc` that is passed to the next iteration of `fn`.
- When `fn` has completed execution over every item in the `collection`, the `done` callback is called exactly once with a falsy `err` and the `result` of the fold.

### parallel

**savoy.parallel(fns [, done])**

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
- Invoke the `cb` callback in each function to signal the end of the function. The signature of the `cb` callback is `cb(err, val)`:
  1. `err` &mdash; If truthy, the `done` callback is called exactly once with the `err`.
  2. `val` &mdash; This is accumulated in the `result` argument of the `done` callback.
- When every function in `fns` has completed execution, the `done` callback is called exactly once with a falsy `err` and the `result` of each function.

### series

**savoy.series(fns [, done])**

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
- Invoke the `cb` callback in each function to signal the end of the function. The signature of the `cb` callback is `cb(err, val)`:
  1. `err` &mdash; If truthy, the `done` callback is called exactly once with the `err`.
  2. `val` &mdash; This is accumulated in the `result` argument of the `done` callback.
- When the entire series of functions has completed execution, the `done` callback is called exactly once with a falsy `err` and the `result` of each function.

### waterfall

**savoy.waterfall(fns [, done])**

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
  function(cb, arg) {
    console.log(arg);
    //=> 'c'
    cb(null, 'd', 'e');
  }
], function(err, arg1, arg2) {
  console.log(err, arg1, arg2);
  //=> null, 'd', 'e'
});
```

- Each function in `fns` is called in *series*.
- Invoke the `cb` callback in each function to signal the end of the function. The signature of the `cb` callback is `cb(err [, arg1, arg2, ...])`:
  1. `err` &mdash; If truthy, the `done` callback is called exactly once with the `err`.
  2. `arg1, arg2, ...` &mdash; Arguments that are passed on to the next function in `fns`.
- When the entire series of functions has completed execution, the `done` callback is called exactly once with a falsy `err` and arguments from the last function in `fns`.

## Installation

Install via [npm](https://npmjs.org/):

```
$ npm i --save savoy
```

Install via [bower](http://bower.io/):

```
$ bower i --save yuanqing/savoy
```

To use Savoy in the browser, include [the minified script](savoy.min.js) in your HTML:

```html
<body>
  <!-- ... -->
  <script src="path/to/savoy.min.js"></script>
  <script>
    // savoy available here
  </script>
</body>
```

## License

[MIT](LICENSE.md)
