import {
  shiftOperations, shiftTo, shiftBy, shiftPositive,
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

describe('shiftTo', () => {
  const shiftToString = shiftTo('string');

  it('none', () => {
    const initial = 'none';

    const actual = shiftToString(0)(initial);

    const expected = initial;

    assert.deepEqual(expected, actual);
  });

  it('up', () => {
    const initial = 'up';

    const actual = shiftToString(2)(initial);

    const expected = '⌈⌈up⌉⌉';

    assert.equal(expected, actual);
  });

  it('down', () => {
    const initial = 'down';

    const actual = shiftToString(-1)(initial);

    const expected = '⌊down⌋';

    assert.equal(expected, actual);
  });
});

describe('shiftBy', () => {
  it('none', () => {
    const initial = {
      shift: -1,
      precedence: 0,
      value: 'none',
    };

    const actual = shiftBy(0)(initial);

    const expected = {
      shift: -1,
      precedence: 0,
      value: 'none',
    };

    assert.deepEqual(expected, actual);
  });

  it('up', () => {
    const initial = {
      shift: 0,
      precedence: 0,
      value: 'up',
    };

    const actual = shiftBy(1)(initial);

    const expected = {
      shift: 1,
      precedence: 0,
      value: 'up',
    };

    assert.deepEqual(expected, actual);
  });

  it('down', () => {
    const initial = {
      shift: 1,
      precedence: 0,
      value: 'down',
    };

    const actual = shiftBy(-2)(initial);

    const expected = {
      shift: -1,
      precedence: 0,
      value: 'down',
    };

    assert.deepEqual(expected, actual);
  });
});

describe('shiftPositive', () => {
  const shiftPositiveString = shiftPositive('string');

  it('addition', () => {
    const a = {
      shift: -1,
      precedence: -1,
      value: 'a',
    };

    const b = {
      shift: 1,
      precedence: 1,
      value: 'b',
    };

    const actual = shiftPositiveString(a, b);

    const expected = {
      shift: 0,
      precedence: 0,
      value: '⌊a⌋ + ⌈b⌉',
    };

    assert.deepEqual(expected, actual);
  });
});
