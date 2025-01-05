import {prettyNumber, valueVisitF, equationVisitF, z} from '../evaluate.js';

import assert from 'assert';

// Note that any two nodes may have at most one edge between them.
describe('#evaluate', () => {
  it('empty', () => {
    assert.deepEqual(
        evaluate(
            {
              'a': {},
              'b': {},
            },
        ),
        {
          'a': 0,
          'b': 0,
        },
    );
  });

  it('eq edge', () => {
    assert.deepEqual(
        evaluate(
            {
              'a': {
                eqs: ['b'],
              },
              'b': {
                eqs: ['a'],
              },
            },
        ),
        {
          'a': 0,
          'b': 0,
        },
    );
  });

  it('op edge', () => {
    assert.deepEqual(
        evaluate(
            {
              'a': {
                ops: ['b'],
              },
              'b': {
                ops: ['a'],
              },
            },
        ),
        {},
    );
  });

  it('one', () => {
    assert.deepEqual(
        evaluate(
            {
              'a': {
                eqs: ['b'],
              },
              'b': {
                eqs: ['a'],
                ops: ['c'],
              },
              'c': {
                eqs: ['b'],
                ops: ['d'],
              },
              'd': {
                ops: ['c'],
              },
            },
        ),
        {
          'a': 0,
          'b': 0,
          'c': 1,
          'd': 1,
        },
    );
  });

  it('two', () => {
    assert.deepEqual(
        evaluate(
            {
              'a': {
                eqs: ['b'],
              },
              'b': {
                eqs: ['a'],
                ops: ['c'],
              },
              'c': {
                eqs: ['b', 'd'],
                ops: ['e'],
              },
              'd': {
                eqs: ['c'],
                ops: ['e'],
              },
              'e': {
                ops: ['d', 'e'],
              },
            },
        ),
        {
          'a': 0,
          'b': 0,
          'c': 1,
          'd': 1,
          'e': 2,
        },
    );
  });
});
