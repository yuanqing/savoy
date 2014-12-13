/* globals jasmine, describe, it, expect */
'use strict';

var parallel = require('../savoy.js').parallel;

describe('parallel', function() {

  describe('array', function() {

    it('empty', function(done) {
      parallel([], function(err, results) {
        expect(err).toBeFalsy();
        expect(results).toEqual([]);
        done();
      });
    });

    it('no `cb`, iterates through', function() {
      jasmine.clock().install();
      var calls = [];
      parallel([
        function(cb) {
          setTimeout(function() {
            calls.push(1);
            cb(null, 1);
          }, 20);
        },
        function(cb) {
          setTimeout(function() {
            calls.push(2);
            cb(null, 2);
          }, 10);
        },
        function(cb) {
          setTimeout(function() {
            calls.push(3);
            cb(null, 3);
          }, 30);
        }
      ]);
      jasmine.clock().tick(1000);
      expect(calls).toEqual([2, 1, 3]);
      jasmine.clock().uninstall();
    });

    it('with `cb`, iterates through', function(done) {
      var calls = [];
      parallel([
        function(cb) {
          setTimeout(function() {
            calls.push(1);
            cb(null, 1);
          }, 20);
        },
        function(cb) {
          setTimeout(function() {
            calls.push(2);
            cb(null, 2);
          }, 10);
        },
        function(cb) {
          setTimeout(function() {
            calls.push(3);
            cb(null, 3);
          }, 30);
        }
      ], function(err, results) {
        expect(err).toBeFalsy();
        expect(results).toEqual([1, 2, 3]);
        expect(calls).toEqual([2, 1, 3]);
        done();
      });
    });

    it('on error, calls `cb` exactly once', function() {
      jasmine.clock().install();
      var cb = jasmine.createSpy();
      parallel([
        function(cb) {
          setTimeout(function() {
            cb(1);
          }, 20);
        },
        function(cb) {
          setTimeout(function() {
            cb(2);
          }, 10);
        },
        function(cb) {
          setTimeout(function() {
            cb(3);
          }, 30);
        }
      ], cb);
      jasmine.clock().tick(1000);
      expect(cb.calls.count()).toBe(1);
      expect(cb.calls.allArgs()).toEqual([[2, undefined]]);
      jasmine.clock().uninstall();
    });

  }); // parallel array

  describe('object', function() {

    it('empty', function(done) {
      parallel({}, function(err, results) {
        expect(err).toBeFalsy();
        expect(results).toEqual({});
        done();
      });
    });

    it('no `cb`, iterates through', function() {
      jasmine.clock().install();
      var calls = [];
      parallel({
        a: function(cb) {
          setTimeout(function() {
            calls.push(1);
            cb(null, 1);
          }, 20);
        },
        b: function(cb) {
          setTimeout(function() {
            calls.push(2);
            cb(null, 2);
          }, 10);
        },
        c: function(cb) {
          setTimeout(function() {
            calls.push(3);
            cb(null, 3);
          }, 30);
        }
      });
      jasmine.clock().tick(1000);
      expect(calls).toEqual([2, 1, 3]);
      jasmine.clock().uninstall();
    });

    it('with `cb`, iterates through', function(done) {
      var calls = [];
      parallel({
        a: function(cb) {
          setTimeout(function() {
            calls.push(1);
            cb(null, 1);
          }, 20);
        },
        b: function(cb) {
          setTimeout(function() {
            calls.push(2);
            cb(null, 2);
          }, 10);
        },
        c: function(cb) {
          setTimeout(function() {
            calls.push(3);
            cb(null, 3);
          }, 30);
        }
      }, function(err, results) {
        expect(err).toBeFalsy();
        expect(results).toEqual({ a: 1, b: 2, c: 3 });
        expect(calls).toEqual([2, 1, 3]);
        done();
      });
    });

    it('on error, calls `cb` exactly once', function() {
      jasmine.clock().install();
      var cb = jasmine.createSpy();
      parallel({
        a: function(cb) {
          setTimeout(function() {
            cb(1);
          }, 20);
        },
        b: function(cb) {
          setTimeout(function() {
            cb(2);
          }, 10);
        },
        c: function(cb) {
          setTimeout(function() {
            cb(3);
          }, 30);
        }
      }, cb);
      jasmine.clock().tick(1000);
      expect(cb.calls.count()).toBe(1);
      expect(cb.calls.allArgs()).toEqual([[2, undefined]]);
      jasmine.clock().uninstall();
    });

  }); // parallel object

}); // parallel
