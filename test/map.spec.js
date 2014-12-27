/* globals jasmine, describe, it, expect */
'use strict';

var map = require('../savoy.js').map;

describe('map', function() {

  describe('sync', function() {

    describe('array', function() {

      it('empty', function() {
        var arr = [];
        var calls = [];
        var result = map(arr, function(val, i, arr) {
          calls.push([val, i, arr]);
          return val * 10;
        });
        expect(result).toEqual([]);
        expect(calls).toEqual([]);
        expect(arr).toEqual([]);
      });

      it('iterates through', function() {
        var arr = [1, 2, 3];
        var calls = [];
        var result = map(arr, function(val, i, arr) {
          calls.push([val, i, arr]);
          return val * 10;
        });
        expect(result).toEqual([10, 20, 30]);
        expect(calls).toEqual([
          [1, 0, arr],
          [2, 1, arr],
          [3, 2, arr]
        ]);
        expect(arr).toEqual([1, 2, 3]);
      });

    }); // map sync array

    describe('object', function() {

      it('empty', function() {
        var obj = {};
        var calls = [];
        var result = map(obj, function(val, key, obj) {
          calls.push([val, key, obj]);
          return val * 10;
        });
        expect(result).toEqual({});
        expect(calls).toEqual([]);
        expect(obj).toEqual({});
      });

      it('iterates through', function() {
        var obj = { a: 1, b: 2, c: 3 };
        var calls = [];
        var result = map(obj, function(val, key, obj) {
          calls.push([val, key, obj]);
          return val * 10;
        });
        expect(result).toEqual({ a: 10, b: 20, c: 30 });
        expect(calls).toEqual([
          [1, 'a', obj],
          [2, 'b', obj],
          [3, 'c', obj]
        ]);
        expect(obj).toEqual({ a: 1, b: 2, c: 3 });
      });

    }); // map sync object

  }); // map sync

  describe('async', function() {

    describe('array', function() {

      it('empty', function(done) {
        var arr = [];
        var calls = [];
        map(arr, function(cb, val, i, arr) {
          calls.push([val, i, arr]);
          setTimeout(function() {
            cb(null, val * 10);
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
        map(arr, function(cb, val, i, arr) {
          calls.push([val, i, arr]);
          setTimeout(function() {
            cb(null, val * 10);
          }, 0);
        }, function(err, result) {
          expect(err).toBeFalsy();
          expect(result).toEqual([10, 20, 30]);
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
        map(arr, function(cb, val, i) {
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

    }); // map async array

    describe('object', function() {

      it('empty', function(done) {
        var obj = {};
        var calls = [];
        map(obj, function(cb, val, key, obj) {
          calls.push([val, key, obj]);
          setTimeout(function() {
            cb(null, val * 10);
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
        map(obj, function(cb, val, key, obj) {
          calls.push([val, key, obj]);
          setTimeout(function() {
            cb(null, val * 10);
          }, 0);
        }, function(err, result) {
          expect(err).toBeFalsy();
          expect(result).toEqual({ a: 10, b: 20, c: 30 });
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
        map(obj, function(cb, val, key) {
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

    }); // map async object

  }); // map async

}); // map
