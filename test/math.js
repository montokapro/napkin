import {
  shifts, shiftBy, shiftTo, shiftOperation,
  // undefinedF,
  // commutationWrapper,
} from '../math.js';

import assert from 'assert';

// const isClose = function(a, b, tolerance = 1e-10) {
//   if (a === b) {
//     return true;
//   } else {
//     return Math.abs(a - b) <= tolerance;
//   }
// };

// const assertClose = function(expected, actual) {
//   assert(
//     isClose(expected, actual),
//     `${expected} ~= ${actual}`,
//   );
// };

describe('shiftBy', () => {
  describe('string', () => {
    const stringShifts = Object.fromEntries(
        Object.entries(shifts).map(([k, v]) => [k, v.string]),
    );

    const by = shiftBy(stringShifts);

    it('none', () => {
      const initial = 'none';

      const actual = by(0, initial);

      const expected = initial;

      assert.deepEqual(expected, actual);
    });

    it('up', () => {
      const initial = 'up';

      const actual = by(2, initial);

      const expected = '⌈⌈up⌉⌉';

      assert.equal(expected, actual);
    });

    it('down', () => {
      const initial = 'down';

      const actual = by(-1, initial);

      const expected = '⌊down⌋';

      assert.equal(expected, actual);
    });
  });

  describe('lazy.string', () => {
    const stringShifts = Object.fromEntries(
        Object.entries(shifts).map(([k, v]) => [k, v.lazy.string]),
    );

    const by = shiftBy(stringShifts);

    it('none', () => {
      const initial = {
        shift: -1,
        precedence: 0,
        string: 'none',
      };

      const actual = by(0, initial);

      const expected = {
        shift: -1,
        precedence: 0,
        string: 'none',
      };

      assert.deepEqual(expected, actual);
    });

    it('up', () => {
      const initial = {
        shift: 0,
        precedence: 0,
        string: 'up',
      };

      const actual = by(1, initial);

      const expected = {
        shift: 1,
        precedence: Infinity,
        string: '⌈up⌉',
      };

      assert.deepEqual(expected, actual);
    });

    it('down', () => {
      const initial = {
        shift: 1,
        precedence: 0,
        string: 'down',
      };

      const actual = by(-2, initial);

      const expected = {
        shift: -1,
        precedence: Infinity,
        string: '⌊⌊down⌋⌋',
      };

      assert.deepEqual(expected, actual);
    });
  });
});

describe('shiftTo', () => {
  describe('lazy.string', () => {
    const stringShifts = Object.fromEntries(
        Object.entries(shifts).map(([k, v]) => [k, v.lazy.string]),
    );

    const to = shiftTo(stringShifts);

    it('none', () => {
      const initial = {
        shift: -1,
        precedence: 0,
        string: 'none',
      };

      const actual = to(0, initial);

      const expected = {
        shift: 0,
        precedence: Infinity,
        string: '⌈none⌉',
      };

      assert.deepEqual(expected, actual);
    });

    it('up', () => {
      const initial = {
        shift: 0,
        precedence: 0,
        string: 'up',
      };

      const actual = to(1, initial);

      const expected = {
        shift: 1,
        precedence: Infinity,
        string: '⌈up⌉',
      };

      assert.deepEqual(expected, actual);
    });

    it('down', () => {
      const initial = {
        shift: 1,
        precedence: 0,
        string: 'down',
      };

      const actual = to(-2, initial);

      const expected = {
        shift: -2,
        precedence: Infinity,
        string: '⌊⌊⌊down⌋⌋⌋',
      };

      assert.deepEqual(expected, actual);
    });
  });
});

describe('shiftOperation', () => {
  const stringShifts = Object.fromEntries(
    Object.entries(shifts).map(([k, v]) => [k, v.lazy.string]),
  );

  const to = shiftTo(stringShifts);

  const op = (a, b) => a + ' + ' + b;

  it('addition', () => {
    const a = {
      shift: -1,
      precedence: -1,
      string: 'a',
    };

    const b = {
      shift: 1,
      precedence: 1,
      string: 'b',
    };

    const actual = shiftOperation(to, op, 0, 0, 0)(a, b);

    const expected = {
      shift: 0,
      precedence: 0,
      string: '⌈a⌉ + ⌊b⌋',
    };

    assert.deepEqual(expected, actual);
  });
});
