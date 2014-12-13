/* globals jasmine, describe, it, expect */
'use strict';

var waterfall = require('../savoy.js').waterfall;

describe('parallel', function() {

  describe('array', function() {

    it('empty', function(done) {
      waterfall([], function(err, lastArg) {
        expect(err).toBeFalsy();
        expect(lastArg).toBeUndefined();
        done();
      });
    });

    it('no `cb`, iterates through', function() {
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
            cb(null, 2);
          }, 10);
        },
        function(cb, arg) {
          setTimeout(function() {
            args.push(arg);
            cb(null, 3);
          }, 30);
        }
      ]);
      jasmine.clock().tick(1000);
      expect(args).toEqual([undefined, 1, 2]);
      jasmine.clock().uninstall();
    });

    it('with `cb`, iterates through', function(done) {
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
            cb(null, 2);
          }, 10);
        },
        function(cb, arg) {
          setTimeout(function() {
            args.push(arg);
            cb(null, 3);
          }, 30);
        }
      ], function(err, lastArg) {
        expect(err).toBeFalsy();
        expect(lastArg).toBe(3);
        expect(args).toEqual([undefined, 1, 2]);
        done();
      });
    });

    it('on error, calls `cb` exactly once', function() {
      jasmine.clock().install();
      var cb = jasmine.createSpy();
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
      ], cb);
      jasmine.clock().tick(1000);
      expect(cb.calls.count()).toBe(1);
      expect(cb.calls.allArgs()).toEqual([[1]]);
      jasmine.clock().uninstall();
    });

  }); // parallel array

  describe('object', function() {

    it('empty', function(done) {
      waterfall({}, function(err, lastArg) {
        expect(err).toBeFalsy();
        expect(lastArg).toBeUndefined();
        done();
      });
    });

    it('no `cb`, iterates through', function() {
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
            cb(null, 2);
          }, 10);
        },
        c: function(cb, arg) {
          setTimeout(function() {
            args.push(arg);
            cb(null, 3);
          }, 30);
        }
      });
      jasmine.clock().tick(1000);
      expect(args).toEqual([undefined, 1, 2]);
      jasmine.clock().uninstall();
    });

    it('with `cb`, iterates through', function(done) {
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
            cb(null, 2);
          }, 10);
        },
        c: function(cb, arg) {
          setTimeout(function() {
            args.push(arg);
            cb(null, 3);
          }, 30);
        }
      }, function(err, lastArg) {
        expect(err).toBeFalsy();
        expect(lastArg).toBe(3);
        expect(args).toEqual([undefined, 1, 2]);
        done();
      });
    });

    it('on error, calls `cb` exactly once', function() {
      jasmine.clock().install();
      var cb = jasmine.createSpy();
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
      }, cb);
      jasmine.clock().tick(1000);
      expect(cb.calls.count()).toBe(1);
      expect(cb.calls.allArgs()).toEqual([[1]]);
      jasmine.clock().uninstall();
    });

  }); // parallel object

}); // parallel
