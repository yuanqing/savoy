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

    it('no `done`, iterates through', function() {
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

    it('with `done`, iterates through', function(done) {
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

    it('on error, calls `done` exactly once', function() {
      jasmine.clock().install();
      var done = jasmine.createSpy();
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
      ], done);
      jasmine.clock().tick(1000);
      expect(done.calls.count()).toBe(1);
      expect(done.calls.argsFor(0)[0]).toBe(2);
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

    it('no `done`, iterates through', function() {
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

    it('with `done`, iterates through', function(done) {
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

    it('on error, calls `done` exactly once', function() {
      jasmine.clock().install();
      var done = jasmine.createSpy();
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
      }, done);
      jasmine.clock().tick(1000);
      expect(done.calls.count()).toBe(1);
      expect(done.calls.argsFor(0)[0]).toBe(2);
      jasmine.clock().uninstall();
    });

  }); // parallel object

}); // parallel
