/* globals jasmine, describe, it, expect */
'use strict';

var filter = require('../savoy.js').filter;

describe('filter', function() {

  describe('sync', function() {

    describe('array', function() {

      it('empty', function() {
        var arr = [];
        var calls = [];
        var result = filter(arr, function(val, i, arr) {
          calls.push([val, i, arr]);
          return val > 1;
        });
        expect(result).toEqual([]);
        expect(calls).toEqual([]);
        expect(arr).toEqual([]);
      });

      it('iterates through', function() {
        var arr = [1, 2, 3];
        var calls = [];
        var result = filter(arr, function(val, i, arr) {
          calls.push([val, i, arr]);
          return val > 1;
        });
        expect(result).toEqual([2, 3]);
        expect(calls).toEqual([
          [1, 0, arr],
          [2, 1, arr],
          [3, 2, arr]
        ]);
        expect(arr).toEqual([1, 2, 3]);
      });

    }); // filter sync array

    describe('object', function() {

      it('empty', function() {
        var obj = {};
        var calls = [];
        var result = filter(obj, function(val, key, obj) {
          calls.push([val, key, obj]);
          return val > 1;
        });
        expect(result).toEqual({});
        expect(calls).toEqual([]);
        expect(obj).toEqual({});
      });

      it('iterates through', function() {
        var obj = { a: 1, b: 2, c: 3 };
        var calls = [];
        var result = filter(obj, function(val, key, obj) {
          calls.push([val, key, obj]);
          return val > 1;
        });
        expect(result).toEqual({ b: 2, c: 3 });
        expect(calls).toEqual([
          [1, 'a', obj],
          [2, 'b', obj],
          [3, 'c', obj]
        ]);
        expect(obj).toEqual({ a: 1, b: 2, c: 3 });
      });

    }); // filter sync object

  }); // filter sync

  describe('async', function() {

    describe('array', function() {

      it('empty', function(done) {
        var arr = [];
        var calls = [];
        filter(arr, function(cb, val, i, arr) {
          calls.push([val, i, arr]);
          setTimeout(function() {
            cb(null, val > 1);
          }, 0);
        }, function(err, result) {
          expect(err).toBeFalsy();
          expect(result).toEqual([]);
          expect(calls).toEqual([]);
          expect(arr).toEqual([]);
          done();
        });
      });

      it('iterates through', function(done) {
        var arr = [1, 2, 3];
        var calls = [];
        filter(arr, function(cb, val, i, arr) {
          calls.push([val, i, arr]);
          setTimeout(function() {
            cb(null, val > 1);
          }, 0);
        }, function(err, result) {
          expect(err).toBeFalsy();
          expect(result).toEqual([2, 3]);
          expect(calls).toEqual([
            [1, 0, arr],
            [2, 1, arr],
            [3, 2, arr]
          ]);
          expect(arr).toEqual([1, 2, 3]);
          done();
        });
      });

      it('on error, calls `done` exactly once', function() {
        jasmine.clock().install();
        var done = jasmine.createSpy();
        var arr = [1, 2, 3];
        var duration = [20, 10, 30];
        filter(arr, function(cb, val, i) {
          setTimeout(function() {
            cb(val);
          }, duration[i]);
        }, done);
        jasmine.clock().tick(1000);
        expect(done.calls.count()).toBe(1);
        expect(done.calls.argsFor(0)[0]).toBe(2);
        expect(arr).toEqual([1, 2, 3]);
        jasmine.clock().uninstall();
      });

    }); // filter async array

    describe('object', function() {

      it('empty', function(done) {
        var obj = {};
        var calls = [];
        filter(obj, function(cb, val, key, obj) {
          calls.push([val, key, obj]);
          setTimeout(function() {
            cb(null, val > 1);
          }, 0);
        }, function(err, result) {
          expect(err).toBeFalsy();
          expect(result).toEqual({});
          expect(calls).toEqual([]);
          expect(obj).toEqual({});
          done();
        });
      });

      it('iterates through', function(done) {
        var obj = { a: 1, b: 2, c: 3 };
        var calls = [];
        filter(obj, function(cb, val, key, obj) {
          calls.push([val, key, obj]);
          setTimeout(function() {
            cb(null, val > 1);
          }, 0);
        }, function(err, result) {
          expect(err).toBeFalsy();
          expect(result).toEqual({ b: 2, c: 3 });
          expect(calls).toEqual([
            [1, 'a', obj],
            [2, 'b', obj],
            [3, 'c', obj]
          ]);
          expect(obj).toEqual({ a: 1, b: 2, c: 3 });
          done();
        });
      });

      it('on error, calls `done` exactly once', function() {
        jasmine.clock().install();
        var done = jasmine.createSpy();
        var obj = { a: 1, b: 2, c: 3 };
        var duration = { a: 20, b: 10, c: 30 };
        filter(obj, function(cb, val, key) {
          setTimeout(function() {
            cb(val);
          }, duration[key]);
        }, done);
        jasmine.clock().tick(1000);
        expect(done.calls.count()).toBe(1);
        expect(done.calls.argsFor(0)[0]).toBe(2);
        expect(obj).toEqual({ a: 1, b: 2, c: 3 });
        jasmine.clock().uninstall();
      });

    }); // filter async object

  }); // filter async

}); // filter
