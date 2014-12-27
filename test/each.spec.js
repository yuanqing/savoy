/* globals jasmine, describe, it, expect */
'use strict';

var each = require('../savoy.js').each;

describe('each', function() {

  describe('sync', function() {

    describe('array', function() {

      it('empty', function() {
        var arr = [];
        var calls = [];
        each(arr, function(val, i, arr) {
          calls.push([val, i, arr]);
        });
        expect(calls).toEqual([]);
        expect(arr).toEqual([]);
      });

      it('iterates through', function() {
        var arr = [1, 2, 3];
        var calls = [];
        each(arr, function(val, i, arr) {
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
        each(arr, function(val, i, arr) {
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

    }); // each sync array

    describe('object', function() {

      it('empty', function() {
        var obj = {};
        var calls = [];
        each(obj, function(val, key, obj) {
          calls.push([val, key, obj]);
        });
        expect(calls).toEqual([]);
        expect(obj).toEqual({});
      });

      it('iterates through', function() {
        var obj = { a: 1, b: 2, c: 3 };
        var calls = [];
        each(obj, function(val, key, obj) {
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
        each(obj, function(val, key, obj) {
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

    }); // each sync object

  }); // each sync

  describe('async', function() {

    describe('array', function() {

      it('empty', function(done) {
        var arr = [];
        var calls = [];
        each(arr, function(cb, val, i, arr) {
          calls.push([cb, val, i, arr]);
          setTimeout(cb, 0);
        }, function(err) {
          expect(err).toBeFalsy();
          expect(calls).toEqual([]);
          expect(arr).toEqual([]);
          done();
        });
      });

      it('iterates through', function(done) {
        var arr = [1, 2, 3];
        var calls = [];
        each(arr, function(cb, val, i, arr) {
          calls.push([val, i, arr]);
          setTimeout(cb, 0);
        }, function(err) {
          expect(err).toBeFalsy();
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
        each(arr, function(cb, val, i) {
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

    }); // each async array

    describe('object', function() {

      it('empty', function(done) {
        var obj = {};
        var calls = [];
        each(obj, function(cb, val, key, obj) {
          calls.push([cb, val, key, obj]);
          setTimeout(cb, 0);
        }, function(err) {
          expect(err).toBeFalsy();
          expect(calls).toEqual([]);
          expect(obj).toEqual({});
          done();
        });
      });

      it('iterates through', function(done) {
        var obj = { a: 1, b: 2, c: 3 };
        var calls = [];
        each(obj, function(cb, val, key, obj) {
          calls.push([val, key, obj]);
          setTimeout(cb, 0);
        }, function(err) {
          expect(err).toBeFalsy();
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
        each(obj, function(cb, val, key) {
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

    }); // each async object

  }); // each async

}); // each
