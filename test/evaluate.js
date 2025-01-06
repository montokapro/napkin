import {prettyNumber, envValueVisitF, z} from '../evaluate.js';

import assert from 'assert';

// Note that any two nodes may have at most one edge between them.
describe('#evaluate', () => {
  it('no edge', () => {
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
                'b': false,
              },
              'b': {
                'a': false,
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
                'b': true,
              },
              'b': {
                'a': true,
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
                'b': false,
              },
              'b': {
                'a': false,
                'c': true,
              },
              'c': {
                'b': false,
                'd': true,
              },
              'd': {
                'c': true,
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
                'b': false,
              },
              'b': {
                'a': false,
                'c': true,
              },
              'c': {
                'b': false,
                'd': false,
                'e': true,
              },
              'd': {
                'c': false,
                'e': true,
              },
              'd': {
                'c': true,
                'd': true,
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
