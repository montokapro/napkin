import {prettyNumber, valueVisitF, equationVisitF, z} from '../evaluate.js';

import assert from 'assert';

// Note that any two nodes may have at most one edge between them.
describe('#evaluate', () => {
  it('no edge', () => {
    assert.deepEqual(
        evaluate(
            {
              'a': {
                env: {}
              },
              'b': {
                env: {}
              },
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
                env: {
                  'b': false,
                },
              },
              'b': {
                env: {
                  'a': false,
                },
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
                env: {
                  'b': true,
                },
              },
              'b': {
                env: {
                  'a': true,
                },
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
                env: {
                  'b': false,
                },
              },
              'b': {
                env: {
                  'a': false,
                  'c': true,
                },
              },
              'c': {
                env: {
                  'b': false,
                  'd': true,
                },
              },
              'd': {
                env: {
                  'c': true,
                },
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
                env: {
                  'b': false,
                },
              },
              'b': {
                env: {
                  'a': false,
                  'c': true,
                },
              },
              'c': {
                env: {
                  'b': false,
                  'd': false,
                  'e': true,
                },
              },
              'd': {
                env: {
                  'c': false,
                  'e': true,
                },
              },
              'd': {
                env: {
                  'c': true,
                  'd': true,
                },
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
