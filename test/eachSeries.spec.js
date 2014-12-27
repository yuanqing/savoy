/* globals jasmine, describe, it, expect */
'use strict';

var eachSeries = require('../savoy.js').eachSeries;

describe('eachSeries', function() {

  describe('sync', function() {

    describe('array', function() {

      it('empty', function() {
        var arr = [];
        var calls = [];
        eachSeries(arr, function(val, i, arr) {
          calls.push([val, i, arr]);
        });
        expect(calls).toEqual([]);
        expect(arr).toEqual([]);
      });

      it('iterates through', function() {
        var arr = [1, 2, 3];
        var calls = [];
        eachSeries(arr, function(val, i, arr) {
          calls.push([val, i, arr]);
        });
        expect(calls).toEqual([
          [1, 0, arr],
          [2, 1, arr],
          [3, 2, arr]
        ]);
        expect(arr).toEqual([1, 2, 3]);
      });

      it('stops iterating when `fn` returns false', function() {
        var arr = [1, 2, 3];
        var calls = [];
        eachSeries(arr, function(val, i, arr) {
          calls.push([val, i, arr]);
          if (val === 2) {
            return false;
          }
        });
        expect(calls).toEqual([
          [1, 0, arr],
          [2, 1, arr],
        ]);
        expect(arr).toEqual([1, 2, 3]);
      });

    }); // eachSeries sync array

    describe('object', function() {

      it('empty', function() {
        var obj = {};
        var calls = [];
        eachSeries(obj, function(val, key, obj) {
          calls.push([val, key, obj]);
        });
        expect(calls).toEqual([]);
        expect(obj).toEqual({});
      });

      it('iterates through', function() {
        var obj = { a: 1, b: 2, c: 3 };
        var calls = [];
        eachSeries(obj, function(val, key, obj) {
          calls.push([val, key, obj]);
        });
        expect(calls).toEqual([
          [1, 'a', obj],
          [2, 'b', obj],
          [3, 'c', obj]
        ]);
        expect(obj).toEqual({ a: 1, b: 2, c: 3 });
      });

      it('stops iterating when `fn` returns false', function() {
        var obj = { a: 1, b: 2, c: 3 };
        var calls = [];
        eachSeries(obj, function(val, key, obj) {
          calls.push([val, key, obj]);
          if (val === 2) {
            return false;
          }
        });
        expect(calls).toEqual([
          [1, 'a', obj],
          [2, 'b', obj],
        ]);
        expect(obj).toEqual({ a: 1, b: 2, c: 3 });
      });

    }); // eachSeries sync object

  }); // eachSeries sync

  describe('async', function() {

    describe('array', function() {

      it('empty', function(done) {
        var arr = [];
        var calls = [];
        eachSeries(arr, function(cb, val, i, arr) {
          calls.push([cb, val, i, arr]);
          setTimeout(cb, 0);
        }, function(err) {
          expect(err).toBeFalsy();
          expect(calls).toEqual([]);
          expect(arr).toEqual([]);
          done();
        });
      });

      it('iterates through', function() {
        jasmine.clock().install();
        var done = jasmine.createSpy();
        var arr = [1, 2, 3];
        var calls = [];
        var lastCall;
        eachSeries(arr, function(cb, val, i, arr) {
          setTimeout(function() {
            lastCall = [val, i, arr];
            calls.push([val, i, arr]);
            cb(null);
          }, 10);
        }, done);
        expect(calls).toEqual([]);
        jasmine.clock().tick(10);
        expect(calls).toEqual([
          [1, 0, arr]
        ]);
        jasmine.clock().tick(10);
        expect(calls).toEqual([
          [1, 0, arr],
          [2, 1, arr]
        ]);
        jasmine.clock().tick(10);
        expect(calls).toEqual([
          [1, 0, arr],
          [2, 1, arr],
          [3, 2, arr]
        ]);
        expect(done.calls.count()).toBe(1);
        expect(done.calls.argsFor(0)[0]).toBeFalsy();
        expect(arr).toEqual([1, 2, 3]);
        jasmine.clock().uninstall();
      });

      it('on error, calls `done` exactly once', function() {
        jasmine.clock().install();
        var done = jasmine.createSpy();
        var arr = [1, 2, 3];
        var calls = [];
        eachSeries(arr, function(cb, val, i, arr) {
          setTimeout(function() {
            calls.push([val, i, arr]);
            cb(val === 2 ? val : null); // errors when `val` === 2
          }, 10);
        }, done);
        expect(calls).toEqual([]);
        jasmine.clock().tick(10);
        expect(calls).toEqual([
          [1, 0, arr]
        ]);
        jasmine.clock().tick(1000);
        expect(calls).toEqual([
          [1, 0, arr],
          [2, 1, arr]
        ]);
        expect(done.calls.count()).toBe(1);
        expect(done.calls.argsFor(0)[0]).toBe(2);
        expect(arr).toEqual([1, 2, 3]);
        jasmine.clock().uninstall();
      });

    }); // eachSeries async array

    describe('object', function() {

      it('empty', function(done) {
        var obj = {};
        var calls = [];
        eachSeries(obj, function(cb, val, key, obj) {
          calls.push([cb, val, key, obj]);
          setTimeout(cb, 0);
        }, function(err) {
          expect(err).toBeFalsy();
          expect(calls).toEqual([]);
          expect(obj).toEqual({});
          done();
        });
      });

      it('iterates through', function() {
        jasmine.clock().install();
        var done = jasmine.createSpy();
        var obj = { a: 1, b: 2, c: 3 };
        var calls = [];
        var lastCall;
        eachSeries(obj, function(cb, val, key, obj) {
          setTimeout(function() {
            lastCall = [val, key, obj];
            calls.push([val, key, obj]);
            cb(null);
          }, 10);
        }, done);
        expect(calls).toEqual([]);
        jasmine.clock().tick(10);
        expect(calls).toEqual([
          [1, 'a', obj],
        ]);
        jasmine.clock().tick(10);
        expect(calls).toEqual([
          [1, 'a', obj],
          [2, 'b', obj]
        ]);
        jasmine.clock().tick(10);
        expect(calls).toEqual([
          [1, 'a', obj],
          [2, 'b', obj],
          [3, 'c', obj]
        ]);
        expect(done.calls.count()).toBe(1);
        expect(done.calls.argsFor(0)[0]).toBeFalsy();
        expect(obj).toEqual({ a: 1, b: 2, c: 3 });
        jasmine.clock().uninstall();
      });

      it('on error, calls `done` exactly once', function() {
        jasmine.clock().install();
        var done = jasmine.createSpy();
        var obj = { a: 1, b: 2, c: 3 };
        var calls = [];
        eachSeries(obj, function(cb, val, key, obj) {
          setTimeout(function() {
            calls.push([val, key, obj]);
            cb(val === 2 ? val : null); // errors when `val` === 2
          }, 10);
        }, done);
        expect(calls).toEqual([]);
        jasmine.clock().tick(10);
        expect(calls).toEqual([
          [1, 'a', obj]
        ]);
        jasmine.clock().tick(1000);
        expect(calls).toEqual([
          [1, 'a', obj],
          [2, 'b', obj]
        ]);
        expect(done.calls.count()).toBe(1);
        expect(done.calls.argsFor(0)[0]).toBe(2);
        expect(obj).toEqual({ a: 1, b: 2, c: 3 });
        jasmine.clock().uninstall();
      });

    }); // eachSeries async object

  }); // eachSeries async

}); // eachSeries
