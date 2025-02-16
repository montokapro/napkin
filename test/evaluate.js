import {
  floatCtx, shiftValueToFloat, shiftCtx,
  evaluateF, isEqualF, z, undefinedF,
  graphEdges,
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
        const envVisit = (nodeId) => graph[nodeId].env;

        const memoFloatVisitF = (f) => function(stack) {
          const nodeId = stack[0];
          const node = graph[nodeId];

          if ('memo' in node && 'float' in node.memo) {
            const fromId = stack[1];

            if (node.env[fromId] === false) {
              return node.memo.float;
            }
          }

          return f(stack);
        };

        const f = evaluateF(envVisit);

        const floatAll = f(floatCtx);
        const floatOne = (visit) => floatAll(memoFloatVisitF(visit));
        const evalFloatAll = z(floatAll);
        const evalFloatOne = z(floatOne);

        const evalShiftAll = z(f(shiftCtx));

        describe(graphId, () => {
          for (const [nodeId, node] of Object.entries(graph)) {
            describe(nodeId, () => {
              // Only check nodes with a value
              if ('memo' in node && 'float' in node.memo) {
                const expected = node.memo.float;

                it('float one', () => {
                  assertClose(expected, evalFloatOne([nodeId]));
                });

                it('float all', () => {
                  assertClose(expected, evalFloatAll([nodeId]));
                });

                it('shift all', () => {
                  const format = undefinedF(shiftValueToFloat);
                  assertClose(expected, format(evalShiftAll([nodeId])));
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

describe('#graphEdges', () => {
  it('no edge', () => {
    const graph = {
      'a': {
        'env': {},
        'float': 0,
      },
      'b': {
        'env': {},
        'float': 0,
      },
    };

    const expected = [];

    assert.deepEqual(expected, graphEdges(graph));
  });

  // a == b
  it('eq edge', () => {
    const graph = {
      'a': {
        'env': {
          'b': false,
        },
        'float': 0,
      },
      'b': {
        'env': {
          'a': false,
        },
        'float': 0,
      },
    };

    const expected = [
      ['a-b', [graph['a'], graph['b']]],
    ];

    assert.deepEqual(expected, graphEdges(graph));
  });

  // a -- b
  it('op edge', () => {
    const graph = {
      'a': {
        'env': {
          'b': true,
        },
        'float': undefined,
      },
      'b': {
        'env': {
          'a': true,
        },
        'float': undefined,
      },
    };

    const expected = [
      ['a-b', [graph['a'], graph['b']]],
    ];

    assert.deepEqual(expected, graphEdges(graph));
  });
});
