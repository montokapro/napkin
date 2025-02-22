import {
  floatCtx, shiftFloat, shiftFloatCtx,
  evaluateF, isEqualF, z, undefinedF,
} from '../evaluate.js';

import graphs from '../graphs.js';

import assert from 'assert';

const isClose = function(a, b, tolerance = 1e-10) {
  if (a === b) {
    return true;
  } else {
    return Math.abs(a - b) <= tolerance;
  }
};

const assertClose = function(expected, actual) {
  assert(
      isClose(expected, actual),
      `${expected} ~= ${actual}`,
  );
};

describe('graphs', () => {
  for (const [categoryId, category] of Object.entries(graphs)) {
    describe(categoryId, () => {
      for (const [graphId, graph] of Object.entries(category)) {
        const floatAllF = evaluateF({
          unit: (stack) => undefined,
          env: (nodeId) => graph[nodeId].env,
          ...floatCtx,
        });
        const floatAll = z(floatAllF);

        const floatOneF = evaluateF({
          unit: (stack) => {
            if (stack.length > 1) {
              const node = graph[stack[0]];
              if ('memo' in node && 'float' in node.memo) {
                return node.memo.float;
              }
            }

            return undefined;
          },
          env: (nodeId) => graph[nodeId].env,
          ...floatCtx,
        });
        const floatOne = z(floatOneF);

        const shiftAllF = evaluateF({
          unit: (stack) => undefined,
          env: (nodeId) => graph[nodeId].env,
          ...shiftFloatCtx,
        });
        const shiftAll = z(shiftAllF);

        describe(graphId, () => {
          for (const [nodeId, node] of Object.entries(graph)) {
            describe(nodeId, () => {
              // Only check nodes with a value
              if ('memo' in node && 'float' in node.memo) {
                const expected = node.memo.float;

                it('float one', () => {
                  assertClose(expected, floatOne([nodeId]));
                });

                it('float all', () => {
                  assertClose(expected, floatAll([nodeId]));
                });

                it('shift all', () => {
                  const format = undefinedF(shiftFloat);
                  // Equality isn't guaranteed,
                  // but it is likely due to integer-preserving optimizations
                  assert.equal(expected, format(shiftAll([nodeId])));
                });
              }
            });
          }
        });
      }
    });
  }
});

describe('#isEqualF', () => {
  let graph;
  const env = (nodeId) => graph[nodeId].env;

  it('identity', () => {
    graph = {
      'a': {
        'env': {},
        'float': 0,
      },
      'b': {
        'env': {},
        'float': 0,
      },
    };

    const expected = true;
    const actual = isEqualF(env)(() => {})('a', 'b');

    assert.equal(expected, actual);
  });

  it('equal', () => {
    graph = {
      'a': {
        'env': {
          'b': true,
          'c': true,
        },
      },
      'b': {
        'env': {
          'a': true,
          'c': false,
        },
      },
      'c': {
        'env': {
          'a': true,
          'b': false,
        },
      },
    };

    const expected = true;
    const actual = isEqualF(env)(() => {})('b', 'c');

    assert.equal(expected, actual);
  });

  it('like equal', () => {
    graph = {
      'a': {
        'env': {
          'b': true,
          'c': true,
        },
      },
      'b': {
        'env': {
          'a': false,
          'c': true,
          'd': false,
        },
      },
      'c': {
        'env': {
          'a': false,
          'b': true,
          'e': false,
        },
      },
      'd': {
        'env': {
          'b': false,

        },
      },
      'e': {
        'env': {
          'b': false,
        },
      },
    };

    const expected = true;
    const actual = isEqualF(env)(() => {})('d', 'e');

    assert.equal(expected, actual);
  });
});
