/* globals jasmine, describe, it, expect */
'use strict';

var fold = require('../savoy.js').fold;

describe('fold', function() {

  describe('sync', function() {

    describe('array', function() {

      it('empty', function() {
        var arr = [];
        var calls = [];
        var result = fold(arr, 100, function(acc, val, i, arr) {
          calls.push([acc, val, i, arr]);
          return acc + val;
        });
        expect(result).toBe(100);
        expect(calls).toEqual([]);
        expect(arr).toEqual([]);
      });

      it('iterates through', function() {
        var arr = [1, 2, 3];
        var calls = [];
        var result = fold(arr, 100, function(acc, val, i, arr) {
          calls.push([acc, val, i, arr]);
          return acc + val;
        });
        expect(result).toBe(106);
        expect(calls).toEqual([
          [100, 1, 0, arr],
          [101, 2, 1, arr],
          [103, 3, 2, arr]
        ]);
        expect(arr).toEqual([1, 2, 3]);
      });

    }); // fold sync array

    describe('object', function() {

      it('empty', function() {
        var obj = {};
        var calls = [];
        var result = fold(obj, 100, function(acc, val, i, arr) {
          calls.push([acc, val, i, arr]);
          return acc + val;
        });
        expect(result).toEqual(100);
        expect(calls).toEqual([]);
        expect(obj).toEqual({});
      });

      it('iterates through', function() {
        var obj = { a: 1, b: 2, c: 3 };
        var calls = [];
        var result = fold(obj, 100, function(acc, val, i, arr) {
          calls.push([acc, val, i, arr]);
          return acc + val;
        });
        expect(result).toBe(106);
        expect(calls).toEqual([
          [100, 1, 'a', obj],
          [101, 2, 'b', obj],
          [103, 3, 'c', obj]
        ]);
        expect(obj).toEqual({ a: 1, b: 2, c: 3 });
      });

    }); // fold sync object

  }); // fold sync

  describe('async', function() {

    describe('array', function() {

      it('empty', function(done) {
        var arr = [];
        var calls = [];
        fold(arr, 100, function(cb, acc, val, i, arr) {
          calls.push([acc, val, i, arr]);
          setTimeout(function() {
            cb(null, acc + val);
          }, 0);
        }, function(err, result) {
          expect(err).toBeFalsy();
          expect(result).toBe(100);
          expect(calls).toEqual([]);
          expect(arr).toEqual([]);
          done();
        });
      });

      it('iterates through', function(done) {
        var arr = [1, 2, 3];
        var calls = [];
        fold(arr, 100, function(cb, acc, val, i, arr) {
          calls.push([acc, val, i, arr]);
          setTimeout(function() {
            cb(null, acc + val);
          }, 0);
        }, function(err, result) {
          expect(err).toBeFalsy();
          expect(result).toBe(106);
          expect(calls).toEqual([
            [100, 1, 0, arr],
            [101, 2, 1, arr],
            [103, 3, 2, arr]
          ]);
          expect(arr).toEqual([1, 2, 3]);
          done();
        });
      });

      it('on error, calls `done` exactly once', function() {
        jasmine.clock().install();
        var done = jasmine.createSpy();
        var arr = [1, 2, 3];
        fold(arr, 100, function(cb, acc, val) {
          setTimeout(function() {
            cb(val);
          }, 0);
        }, done);
        jasmine.clock().tick(1000);
        expect(done.calls.count()).toBe(1);
        expect(done.calls.argsFor(0)[0]).toBe(1);
        expect(arr).toEqual([1, 2, 3]);
        jasmine.clock().uninstall();
      });

    }); // fold async array

    describe('object', function() {

      it('empty', function(done) {
        var obj = {};
        var calls = [];
        fold(obj, 100, function(cb, acc, val, i, arr) {
          calls.push([acc, val, i, arr]);
          setTimeout(function() {
            cb(null, acc + val);
          }, 0);
        }, function(err, result) {
          expect(err).toBeFalsy();
          expect(result).toBe(100);
          expect(calls).toEqual([]);
          expect(obj).toEqual({});
          done();
        });
      });

      it('iterates through', function(done) {
        var obj = { a: 1, b: 2, c: 3 };
        var calls = [];
        fold(obj, 100, function(cb, acc, val, i, arr) {
          calls.push([acc, val, i, arr]);
          setTimeout(function() {
            cb(null, acc + val);
          }, 0);
        }, function(err, result) {
          expect(err).toBeFalsy();
          expect(result).toBe(106);
          expect(calls).toEqual([
            [100, 1, 'a', obj],
            [101, 2, 'b', obj],
            [103, 3, 'c', obj]
          ]);
          expect(obj).toEqual({ a: 1, b: 2, c: 3 });
          done();
        });
      });

      it('on error, calls `done` exactly once', function() {
        jasmine.clock().install();
        var done = jasmine.createSpy();
        var obj = { a: 1, b: 2, c: 3 };
        fold(obj, 100, function(cb, acc, val) {
          setTimeout(function() {
            cb(val);
          }, 0);
        }, done);
        jasmine.clock().tick(1000);
        expect(done.calls.count()).toBe(1);
        expect(done.calls.argsFor(0)[0]).toBe(1);
        expect(obj).toEqual({ a: 1, b: 2, c: 3 });
        jasmine.clock().uninstall();
      });

    }); // fold async object

  }); // fold async

}); // fold
