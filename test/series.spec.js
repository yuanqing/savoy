/* globals jasmine, describe, it, expect */
'use strict';

var series = require('../savoy.js').series;

describe('series', function() {

  describe('array', function() {

    it('empty', function(done) {
      series([], function(err, results) {
        expect(err).toBeFalsy();
        expect(results).toEqual([]);
        done();
      });
    });

    it('no `done`, iterates through', function() {
      jasmine.clock().install();
      var calls = [];
      series([
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
      expect(calls).toEqual([1, 2, 3]);
      jasmine.clock().uninstall();
    });

    it('with `done`, iterates through', function(done) {
      var calls = [];
      series([
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
        expect(calls).toEqual([1, 2, 3]);
        done();
      });
    });

    it('on error, calls `done` exactly once', function() {
      jasmine.clock().install();
      var done = jasmine.createSpy();
      series([
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
      expect(done.calls.argsFor(0)[0]).toBe(1);
      jasmine.clock().uninstall();
    });

  }); // series array

  describe('object', function() {

    it('empty', function(done) {
      series({}, function(err, results) {
        expect(err).toBeFalsy();
        expect(results).toEqual({});
        done();
      });
    });

    it('no `done`, iterates through', function() {
      jasmine.clock().install();
      var calls = [];
      series({
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
      expect(calls).toEqual([1, 2, 3]);
      jasmine.clock().uninstall();
    });

    it('with `done`, iterates through', function(done) {
      var calls = [];
      series({
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
        expect(calls).toEqual([1, 2, 3]);
        done();
      });
    });

    it('on error, calls `done` exactly once', function() {
      jasmine.clock().install();
      var done = jasmine.createSpy();
      series({
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
      expect(done.calls.argsFor(0)[0]).toBe(1);
      jasmine.clock().uninstall();
    });

  }); // series object

}); // series
