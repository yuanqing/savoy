/* globals jasmine, describe, it, expect */
'use strict';

var waterfall = require('../savoy.js').waterfall;

describe('waterfall', function() {

  describe('array', function() {

    it('empty', function(done) {
      waterfall([], function(err, lastArg) {
        expect(err).toBeFalsy();
        expect(lastArg).toBeUndefined();
        done();
      });
    });

    it('no `done`, iterates through', function() {
      jasmine.clock().install();
      var args = [];
      waterfall([
        function(cb, arg) {
          setTimeout(function() {
            args.push(arg);
            cb(null, 1);
          }, 20);
        },
        function(cb, arg) {
          setTimeout(function() {
            args.push(arg);
            cb(null, 2, 3);
          }, 10);
        },
        function(cb, arg1, arg2) {
          setTimeout(function() {
            args.push([arg1, arg2]);
            cb(null, 4);
          }, 30);
        }
      ]);
      jasmine.clock().tick(1000);
      expect(args).toEqual([undefined, 1, [2, 3]]);
      jasmine.clock().uninstall();
    });

    it('with `done`, iterates through', function(done) {
      var args = [];
      waterfall([
        function(cb, arg) {
          setTimeout(function() {
            args.push(arg);
            cb(null, 1);
          }, 20);
        },
        function(cb, arg) {
          setTimeout(function() {
            args.push(arg);
            cb(null, 2, 3);
          }, 10);
        },
        function(cb, arg1, arg2) {
          setTimeout(function() {
            args.push([arg1, arg2]);
            cb(null, 4);
          }, 30);
        }
      ], function(err, arg) {
        expect(err).toBeFalsy();
        expect(arg).toBe(4);
        expect(args).toEqual([undefined, 1, [2, 3]]);
        done();
      });
    });

    it('on error, calls `done` exactly once', function() {
      jasmine.clock().install();
      var done = jasmine.createSpy();
      waterfall([
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

  }); // waterfall array

  describe('object', function() {

    it('empty', function(done) {
      waterfall({}, function(err, lastArg) {
        expect(err).toBeFalsy();
        expect(lastArg).toBeUndefined();
        done();
      });
    });

    it('no `done`, iterates through', function() {
      jasmine.clock().install();
      var args = [];
      waterfall({
        a: function(cb, arg) {
          setTimeout(function() {
            args.push(arg);
            cb(null, 1);
          }, 20);
        },
        b: function(cb, arg) {
          setTimeout(function() {
            args.push(arg);
            cb(null, 2, 3);
          }, 10);
        },
        c: function(cb, arg1, arg2) {
          setTimeout(function() {
            args.push([arg1, arg2]);
            cb(null, 4);
          }, 30);
        }
      });
      jasmine.clock().tick(1000);
      expect(args).toEqual([undefined, 1, [2, 3]]);
      jasmine.clock().uninstall();
    });

    it('with `done`, iterates through', function(done) {
      var args = [];
      waterfall({
        a: function(cb, arg) {
          setTimeout(function() {
            args.push(arg);
            cb(null, 1);
          }, 20);
        },
        b: function(cb, arg) {
          setTimeout(function() {
            args.push(arg);
            cb(null, 2, 3);
          }, 10);
        },
        c: function(cb, arg1, arg2) {
          setTimeout(function() {
            args.push([arg1, arg2]);
            cb(null, 4);
          }, 30);
        }
      }, function(err, arg) {
        expect(err).toBeFalsy();
        expect(arg).toBe(4);
        expect(args).toEqual([undefined, 1, [2, 3]]);
        done();
      });
    });

    it('on error, calls `done` exactly once', function() {
      jasmine.clock().install();
      var done = jasmine.createSpy();
      waterfall({
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

  }); // waterfall object

}); // waterfall
