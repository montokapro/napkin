import { centerPoint, targetSlope } from '../geometry.js';

import assert from 'assert';

describe('#centerPoint', () =>  {
  describe('line', () =>  {
    it('horizontal', () => {
      assert.deepEqual(
        centerPoint([1, 1], 0, [1, 3]),
        [1, 2]
      );
    });

    it('vertical', () => {
      assert.deepEqual(
        centerPoint([1, 1], Infinity, [3, 1]),
        [2, 1]
      );
    });

    it('diagonal', () => {
      assert.deepEqual(
        centerPoint([1, 1], 1, [3, 3]),
        [2, 2]
      );
    });

    it('fractional', () => {
      assert.deepEqual(
        centerPoint([9, 1], -3/4, [1, 7]),
        [5, 4]
      );
    });
  });

  describe('quarter', () =>  {
    it('horizontal source slope', () => {
      assert.deepEqual(
        centerPoint([1, 1], 0, [3, 3]),
        [1, 3]
      );
    });

    it('vertical source slope', () => {
      assert.deepEqual(
        centerPoint([3, 3], Infinity, [1, 1]),
        [1, 3]
      );
    });

    it('horizontal mid slope', () => {
      assert.deepEqual(
        centerPoint([1, 1], -1, [3, 1]),
        [2, 2]
      );
    });

    it('vertical mid slope', () => {
      assert.deepEqual(
        centerPoint([1, 3], 1, [1, 1]),
        [2, 2]
      );
    });

    it('fractional', () => {
      assert.deepEqual(
        centerPoint([9, 1], 4/3, [2, 0]),
        [5, 4]
      );
    });
  });

  describe('semi', () =>  {
    it('horizontal', () => {
      assert.deepEqual(
        centerPoint([1, 1], Infinity, [1, 3]),
        [1, 2]
      );
    });

    it('vertical', () => {
      assert.deepEqual(
        centerPoint([1, 1], 0, [3, 1]),
        [2, 1]
      );
    });

    it('diagonal', () => {
      assert.deepEqual(
        centerPoint([1, 1], -1, [3, 3]),
        [2, 2]
      );
    });

    it('fractional', () => {
      assert.deepEqual(
        centerPoint([9, 1], 4/3, [1, 7]),
        [5, 4]
      );
    });
  });
});
