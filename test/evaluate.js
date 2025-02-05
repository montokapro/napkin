import {
  floatCtx, shiftValueToFloat, shiftCtx,
  evaluateF, isEqualF, z, undefinedF,
  graphEdges,
} from '../evaluate.js';

import assert from 'assert';

const isClose = function(a, b, tolerance = 1e-10) {
  if (a === b) {
    return true;
  } else {
    return Math.abs(a - b) <= tolerance;
  }
};

const assertValues = function(graph) {
  const envVisit = (nodeId) => graph[nodeId].env;

  const memoFloatVisitF = (f) => function(stack) {
    const nodeId = stack[0];
    const node = graph[nodeId];

    if ('float' in node) {
      const fromId = stack[1];

      if (node.env[fromId] === false) {
        return node.float;
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

  for (const [nodeId, node] of Object.entries(graph)) {
    // Only check nodes with a value
    if ('float' in node) {
      const expected = node.float;

      const actualFloatOne = evalFloatOne([nodeId]);
      assert(
          isClose(expected, actualFloatOne),
          `Float One: ${nodeId}: ${expected} == ${actualFloatOne}`,
      );

      const actualFloatAll = evalFloatAll([nodeId]);
      assert(
          isClose(expected, actualFloatAll),
          `Float All: ${nodeId}: ${expected} == ${actualFloatAll}`,
      );

      const format = undefinedF(shiftValueToFloat);
      const actualShiftAll = format(evalShiftAll([nodeId]));
      assert(
          isClose(expected, actualShiftAll),
          `Shift All: ${nodeId}: ${expected} == ${actualShiftAll}`,
      );
    }
  }
};

describe('#evaluateF', () => {
  it('no edge', () => {
    assertValues(
        {
          'a': {
            'env': {},
            'float': 0,
            'string': '0',
          },
          'b': {
            'env': {},
            'float': 0,
            'string': '0',
          },
        },
    );
  });

  // a == b
  it('eq edge', () => {
    assertValues(
        {
          'a': {
            'env': {
              'b': false,
            },
            'float': 0,
            'string': '0 = 0',
          },
          'b': {
            'env': {
              'a': false,
            },
            'float': 0,
            'string': '0 = 0',
          },
        },
    );
  });

  // a -- b
  it('op edge', () => {
    assertValues(
        {
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
        },
    );
  });

  // a -= b
  it('forward edge', () => {
    assertValues(
        {
          'a': {
            'env': {
              'b': true,
            },
            'float': -Infinity,
          },
          'b': {
            'env': {
              'a': false,
            },
            'float': 0,
          },
        },
    );
  });

  // a =- b
  it('backward edge', () => {
    assertValues(
        {
          'a': {
            'env': {
              'b': false,
            },
            'float': 0,
          },
          'b': {
            'env': {
              'a': true,
            },
            'float': -Infinity,
          },
        },
    );
  });

  // a == b
  // b -= c
  // c -- d
  it('one', () => {
    assertValues(
        {
          'a': {
            'env': {
              'b': false,
            },
            'float': 0,
          },
          'b': {
            'env': {
              'a': false,
              'c': true,
            },
            'float': 0,
          },
          'c': {
            'env': {
              'b': false,
              'd': true,
            },
            'float': 1,
          },
          'd': {
            'env': {
              'c': true,
            },
            'float': 1,
          },
        },
    );
  });

  // a == b
  // b -= c
  // c == d
  // c -- e
  // d -- e
  it('two', () => {
    assertValues(
        {
          'a': {
            'env': {
              'b': false,
            },
            'float': 0,
          },
          'b': {
            'env': {
              'a': false,
              'c': true,
            },
            'float': 0,
          },
          'c': {
            'env': {
              'b': false,
              'd': false,
              'e': true,
            },
            'float': 1,
          },
          'd': {
            'env': {
              'c': false,
              'e': true,
            },
            'float': 1,
          },
          'e': {
            'env': {
              'c': true,
              'd': true,
            },
            'float': 2,
          },
        },
    );
  });

  it('add', () => {
    assertValues(
        {
          '0a': {
            'env': {
              '0b': false,
              '0c': false,
              '0d': false,
            },
            'float': 0,
          },
          '0b': {
            'env': {
              '0a': false,
              '1a': true,
            },
            'float': 0,
          },
          '1a': {
            'env': {
              '0b': false,
              '1b': false,
              '2a': true,
            },
            'float': 1,
          },
          '1b': {
            'env': {
              '1a': false,
              '1c': false,
              '2a': true,
            },
            'float': 1,
          },
          '2a': {
            'env': {
              '1a': true,
              '1b': true,
              '2b': false,
              'v6a': false,
              'v9a': false,
            },
            'float': 2,
          },
          '1c': {
            'env': {
              '1b': false,
              '1d': false,
              '3a': true,
            },
            'float': 1,
          },
          '1d': {
            'env': {
              '1c': false,
              '1e': false,
              '3a': true,
            },
            'float': 1,
          },
          '1e': {
            'env': {
              '1d': false,
              '3a': true,
            },
            'float': 1,
          },
          '3a': {
            'env': {
              '1c': true,
              '1d': true,
              '1e': true,
              '3b': false,
              'v6a': false,
              'v3a': false,
            },
            'float': 3,
          },
          '2b': {
            'env': {
              '2a': false,
              '5a': true,
            },
            'float': 2,
          },
          '3b': {
            'env': {
              '3a': false,
              '5a': true,
            },
            'float': 3,
          },
          '5a': {
            'env': {
              '2b': true,
              '3b': true,
            },
            'float': 5,
          },
          'v6a': {
            'env': {
              '2a': true,
              '3a': true,
              'v6b': false,
            },
            'float': Math.log(6),
          },
          'v6b': {
            'env': {
              'v6a': false,
              '6a': true,
            },
            'float': Math.log(6),
          },
          '6a': {
            'env': {
              'v6b': false,
              '6b': true,
            },
            'float': 6,
          },
          '6b': {
            'env': {
              '6a': true,
            },
            'float': 6,
          },
          'v3a': {
            'env': {
              '3a': true,
              'vv9a': false,
            },
            'float': Math.log(3),
          },
          'vv9a': {
            'env': {
              '2a': true,
              'v3a': true,
              'vv9b': false,
            },
            'float': Math.log(Math.log(9)),
          },
          'vv9b': {
            'env': {
              'vv9a': false,
              'v9a': true,
            },
            'float': Math.log(Math.log(9)),
          },
          'v9a': {
            'env': {
              'vv9b': false,
              '9a': true,
            },
            'float': Math.log(9),
          },
          '9a': {
            'env': {
              'v9a': false,
              '9b': true,
            },
            'float': 9,
          },
          '9b': {
            'env': {
              '9a': true,
            },
            'float': 9,
          },
          '0c': {
            'env': {
              '0a': false,
              '1f': true,
            },
            'float': 0,
          },
          '1f': {
            'env': {
              '0c': false,
              '0d': true,
            },
            'float': 1,
          },
          '0d': {
            'env': {
              '0a': false,
              '1f': true,
              '-1a': true,
            },
            'float': 0,
          },
          '-1a': {
            'env': {
              '0d': true,
            },
            'float': -1,
          },
        },
    );
  });
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
