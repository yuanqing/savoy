(function(exports) {

  var noop = function() {};

  var parallel = function(gn) {
    return function(arr, fn, cb) {
      var acc = arr instanceof Array ? [] : {};
      var keys = arr instanceof Array ? 0 : Object.keys(arr);
      var len = (keys || arr).length;
      var count = 0;
      var callback = function(err, cbArg) {
        if (err) {
          cb(err);
          cb = noop;
          return;
        }
        gn(cbArg, acc, this[0], this[1]);
        if (++count == len) {
          cb(0, acc);
        }
      };
      if (!len) {
        (cb || noop)(0, acc);
        return acc;
      }
      var i = -1;
      while (++i < len) {
        var key = keys ? keys[i] : i;
        if (cb) {
          fn(callback.bind([key, arr[key]]), arr[key], key, arr);
        } else {
          gn(fn(arr[key], key, arr), acc, key, arr[key]);
        }
      }
      return acc;
    };
  };

  var series = function(isFold) {
    return function(arr, acc, fn, cb) {
      var keys = arr instanceof Array ? 0 : Object.keys(arr);
      var len = (keys || arr).length;
      var i = 0;
      var key;
      var callback = function(err, callbackAcc) {
        if (err) {
          return cb(err);
        }
        acc = callbackAcc;
        if (++i == len) {
          (cb || noop)(0, acc);
          return;
        }
        call(callbackAcc);
      };
      var call = function(args) {
        key = keys ? keys[i] : i;
        if (isFold) {
          fn(callback, acc, arr[key], key, arr);
        } else {
          arr[key](callback, args);
        }
      };
      if (!len) {
        (cb || noop)(0, acc);
        return acc;
      }
      if (isFold && !cb) {
        i = -1;
        while (++i < len) {
          key = keys ? keys[i] : i;
          acc = fn(acc, arr[key], key, arr);
        }
        return acc;
      }
      call();
    };
  };

  var waterfall = series();

  exports.each = parallel(noop);

  exports.filter = parallel(function(cbArg, acc, key, val) {
    if (cbArg) {
      acc[acc instanceof Array ? acc.length : key] = val;
    }
  });

  exports.map = parallel(function(cbArg, acc, key) {
    acc[key] = cbArg;
  });

  exports.fold = series(1);

  exports.waterfall = function(fns, cb) {
    return waterfall(fns, undefined, 0, cb);
  };

  exports.parallel = function(fns, cb) {
    exports.map(fns, function(mapCb, fn) {
      fn(function(err, cbArg) {
        mapCb(err, cbArg);
      });
    }, function(err, result) {
      (cb || noop)(err, result);
    });
  };

})(typeof exports == 'undefined' ? this.s : exports);
