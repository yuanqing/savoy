(function(exports) {

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

  var asyncSeriesEach = function(collection, fn, cb) {
    var keys = isArr(collection) ? false : objKeys(collection);
    var len = (keys || collection).length;
    var i = 0;
    var key;
    var cbWrap = function(err) {
      if (err) {
        cb(err);
        return;
      }
      if (++i === len) {
        cb(null);
        return;
      }
      call();
    };
    var call = keys ? function() {
      key = keys[i];
      fn(cbWrap, collection[key], key, collection);
    } : function() {
      fn(cbWrap, collection[i], i, collection);
    };
    if (!len) {
      cb(null);
      return;
    }
    call();
  };

  var asyncParallelEach = function(collection, fn, cb) {
    var keys = isArr(collection) ? false : objKeys(collection);
    var len = (keys || collection).length;
    var i = -1;
    var key;
    var count = 0;
    var cbWrap = function(err) {
      if (err) {
        cb(err);
        cb = noop;
        return;
      }
      if (++count === len) {
        cb(null);
      }
    };
    if (!len) {
      cb(null);
      return;
    }
    if (keys) {
      while (++i < len) {
        key = keys[i];
        fn(cbWrap, collection[key], key, collection);
      }
    } else {
      while (++i < len) {
        fn(cbWrap, collection[i], i, collection);
      }
    }
  };

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

  var syncMap = function(collection, fn) {
    var result = isArr(collection) ? [] : {};
    syncParallelEach(collection, function(val, key, collection) {
      result[key] = fn(val, key, collection);
    });
    return result;
  };

  var asyncMap = function(collection, fn, cb) {
    var result = isArr(collection) ? [] : {};
    asyncParallelEach(collection, function(cb, val, key, collection) {
      fn(function(err, mapVal) {
        result[key] = mapVal;
        cb(err);
      }, val, key, collection);
    }, function(err) {
      cb(err, result);
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

  var asyncFilter = function(collection, fn, cb) {
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
        cb(err, syncMap(result.sort(function(a, b) {
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
        cb(err, result);
      });
    }
  };

  var syncFold = function(collection, acc, fn) {
    syncParallelEach(collection, function(val, key, collection) {
      acc = fn(acc, val, key, collection);
    });
    return acc;
  };

  var asyncFold = function(collection, acc, fn, cb) {
    asyncSeriesEach(collection, function(cb, val, key, collection) {
      fn(function(err, foldVal) {
        acc = foldVal;
        cb(err);
      }, acc, val, key, collection);
    }, function(err) {
      cb(err, acc);
    });
  };

  exports.each = function(collection, fn, cb) {
    return cb ? asyncParallelEach(collection, fn, cb) : syncParallelEach(collection, fn);
  };

  exports.map = function(collection, fn, cb) {
    return cb ? asyncMap(collection, fn, cb) : syncMap(collection, fn);
  };

  exports.filter = function(collection, fn, cb) {
    return cb ? asyncFilter(collection, fn, cb) : syncFilter(collection, fn);
  };

  exports.fold = function(collection, acc, fn, cb) {
    return cb ? asyncFold(collection, acc, fn, cb) : syncFold(collection, acc, fn);
  };

  exports.parallel = function(fns, cb) {
    exports.map(fns, function(cb, fn) {
      fn(function(err, val) {
        cb(err, val);
      });
    }, function(err, result) {
      (cb || noop)(err, result);
    });
  };

  exports.series = function(fns, cb) {
    var result = isArr(fns) ? [] : {};
    asyncSeriesEach(fns, function(cb, fn, key) {
      fn(function(err, val) {
        result[key] = val;
        cb(err);
      });
    }, function(err) {
      (cb || noop)(err, result);
    });
  };

  exports.waterfall = function(fns, cb) {
    var keys = isArr(fns) ? false : objKeys(fns);
    var len = (keys || fns).length;
    var i = -1;
    var cbWrap = function(err) {
      if (err) {
        cb(err);
        return;
      }
      if (++i === len) {
        cb.apply(null, arguments);
        return;
      }
      var args = arrSlice.call(arguments);
      args[0] = cbWrap;
      (keys ? fns[keys[i]] : fns[i]).apply(null, args);
    };
    cb = cb || noop;
    cbWrap();
  };

})(typeof exports == 'undefined' ? this.savoy : exports);
