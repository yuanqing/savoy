(function(root) {

  var noop = function() {};

  /* istanbul ignore next */
  var isArr = Array.isArray || function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

  /* istanbul ignore next */
  var objKeys = Object.keys || function(obj) {
    var result = [];
    var key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        result.push(key);
      }
    }
    return result;
  };

  var arrSlice = Array.prototype.slice;

  var syncParallelEach = function(collection, fn) {
    var keys = isArr(collection) ? false : objKeys(collection);
    var len = (keys || collection).length;
    var i = -1;
    var key;
    if (keys) {
      while (++i < len) {
        key = keys[i];
        if (fn(collection[key], key, collection) === false) {
          break;
        }
      }
    } else {
      while (++i < len) {
        if (fn(collection[i], i, collection) === false) {
          break;
        }
      }
    }
  };

  var asyncParallelEach = function(collection, fn, done) {
    var keys = isArr(collection) ? false : objKeys(collection);
    var len = (keys || collection).length;
    var i = -1;
    var key;
    var count = 0;
    var cb = function(err) {
      if (err) {
        done(err);
        done = noop;
        return;
      }
      if (++count === len) {
        done(null);
      }
    };
    if (!len) {
      done(null);
      return;
    }
    if (keys) {
      while (++i < len) {
        key = keys[i];
        fn(cb, collection[key], key, collection);
      }
    } else {
      while (++i < len) {
        fn(cb, collection[i], i, collection);
      }
    }
  };

  var asyncSeriesEach = function(collection, fn, done) {
    var keys = isArr(collection) ? false : objKeys(collection);
    var len = (keys || collection).length;
    var i = 0;
    var key;
    var cb = function(err) {
      if (err) {
        done(err);
        return;
      }
      if (++i === len) {
        done(null);
        return;
      }
      call();
    };
    var call = keys ? function() {
      key = keys[i];
      fn(cb, collection[key], key, collection);
    } : function() {
      fn(cb, collection[i], i, collection);
    };
    if (!len) {
      done(null);
      return;
    }
    call();
  };

  var syncMap = function(collection, fn) {
    var result = isArr(collection) ? [] : {};
    syncParallelEach(collection, function(val, key, collection) {
      result[key] = fn(val, key, collection);
    });
    return result;
  };

  var asyncMap = function(collection, fn, done) {
    var result = isArr(collection) ? [] : {};
    asyncParallelEach(collection, function(cb, val, key, collection) {
      fn(function(err, mapVal) {
        result[key] = mapVal;
        cb(err);
      }, val, key, collection);
    }, function(err) {
      done(err, result);
    });
  };

  var syncFilter = function(collection, fn) {
    var result;
    if (isArr(collection)) {
      result = [];
      syncParallelEach(collection, function(val, key, collection) {
        if (fn(val, key, collection)) {
          result.push(val);
        }
      });
    } else {
      result = {};
      syncParallelEach(collection, function(val, key, collection) {
        if (fn(val, key, collection)) {
          result[key] = val;
        }
      });
    }
    return result;
  };

  var asyncFilter = function(collection, fn, done) {
    var result;
    if (isArr(collection)) {
      result = [];
      asyncParallelEach(collection, function(cb, val, i, collection) {
        fn(function(err, predicate) {
          if (predicate) {
            result.push({ i: i, val: val });
          }
          cb(err);
        }, val, i, collection);
      }, function(err) {
        done(err, syncMap(result.sort(function(a, b) {
          return a.i - b.i;
        }), function(item) {
          return item.val;
        }));
      });
    } else {
      result = {};
      asyncParallelEach(collection, function(cb, val, key, collection) {
        fn(function(err, predicate) {
          if (predicate) {
            result[key] = val;
          }
          cb(err);
        }, val, key, collection);
      }, function(err) {
        done(err, result);
      });
    }
  };

  var syncFold = function(collection, acc, fn) {
    syncParallelEach(collection, function(val, key, collection) {
      acc = fn(acc, val, key, collection);
    });
    return acc;
  };

  var asyncFold = function(collection, acc, fn, done) {
    asyncSeriesEach(collection, function(cb, val, key, collection) {
      fn(function(err, foldVal) {
        acc = foldVal;
        cb(err);
      }, acc, val, key, collection);
    }, function(err) {
      done(err, acc);
    });
  };

  var savoy = {};

  savoy.each = function(collection, fn, done) {
    return done ? asyncParallelEach(collection, fn, done) : syncParallelEach(collection, fn);
  };

  savoy.eachSeries = function(collection, fn, done) {
    return done ? asyncSeriesEach(collection, fn, done) : syncParallelEach(collection, fn);
  };

  savoy.map = function(collection, fn, done) {
    return done ? asyncMap(collection, fn, done) : syncMap(collection, fn);
  };

  savoy.filter = function(collection, fn, done) {
    return done ? asyncFilter(collection, fn, done) : syncFilter(collection, fn);
  };

  savoy.fold = function(collection, acc, fn, done) {
    return done ? asyncFold(collection, acc, fn, done) : syncFold(collection, acc, fn);
  };

  savoy.parallel = function(fns, done) {
    savoy.map(fns, function(cb, fn) {
      fn(function(err, val) {
        cb(err, val);
      });
    }, function(err, result) {
      (done || noop)(err, result);
    });
  };

  savoy.series = function(fns, done) {
    var result = isArr(fns) ? [] : {};
    asyncSeriesEach(fns, function(cb, fn, key) {
      fn(function(err, val) {
        result[key] = val;
        cb(err);
      });
    }, function(err) {
      (done || noop)(err, result);
    });
  };

  savoy.waterfall = function(fns, done) {
    var keys = isArr(fns) ? false : objKeys(fns);
    var len = (keys || fns).length;
    var i = -1;
    var cb = function(err) {
      if (err) {
        done(err);
        return;
      }
      if (++i === len) {
        done.apply(null, arguments);
        return;
      }
      var args = arrSlice.call(arguments);
      args[0] = cb;
      (keys ? fns[keys[i]] : fns[i]).apply(null, args);
    };
    done = done || noop;
    cb();
  };

  /* istanbul ignore else */
  if (typeof module === 'object') {
    module.exports = savoy;
  } else {
    root.savoy = savoy;
  }

})(this);
