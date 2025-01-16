import {evaluateF, z} from '../evaluate.js';

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

  const memoVisitF = (f) => function(stack) {
    const nodeId = stack[0];
    const node = graph[nodeId];

    if ('value' in node) {
      const fromId = stack[1];

      if (node.env[fromId] === false) {
        return node.value;
      }
    }

    return f(stack);
  };

  const f = evaluateF(envVisit);
  const g = (visit) => f(memoVisitF(visit));

  const evalOne = z(g);
  const evalAll = z(f);

  for (const [nodeId, node] of Object.entries(graph)) {
    // Only check nodes with a value
    if ('value' in node) {
      const expected = node.value;

      const actualOne = evalOne([nodeId]);
      assert(
          isClose(expected, actualOne),
          `One: ${nodeId}: ${expected} == ${actualOne}`,
      );

      const actualAll = evalAll([nodeId]);
      assert(
          isClose(expected, actualAll),
          `All: ${nodeId}: ${expected} == ${actualAll}`,
      );
    }
  }
};

describe('#evaluateF', () => {
  it('no edge', () => {
    assertValues(
        {
          'a': {
            env: {},
            value: 0,
          },
          'b': {
            env: {},
            value: 0,
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
            'value': 0,
          },
          'b': {
            'env': {
              'a': false,
            },
            'value': 0,
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
            'value': undefined,
          },
          'b': {
            'env': {
              'a': true,
            },
            'value': undefined,
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
            'value': -Infinity,
          },
          'b': {
            'env': {
              'a': false,
            },
            'value': 0,
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
            'value': 0,
          },
          'b': {
            'env': {
              'a': true,
            },
            'value': -Infinity,
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
            'value': 0,
          },
          'b': {
            'env': {
              'a': false,
              'c': true,
            },
            'value': 0,
          },
          'c': {
            'env': {
              'b': false,
              'd': true,
            },
            'value': 1,
          },
          'd': {
            'env': {
              'c': true,
            },
            'value': 1,
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
            'value': 0,
          },
          'b': {
            'env': {
              'a': false,
              'c': true,
            },
            'value': 0,
          },
          'c': {
            'env': {
              'b': false,
              'd': false,
              'e': true,
            },
            'value': 1,
          },
          'd': {
            'env': {
              'c': false,
              'e': true,
            },
            'value': 1,
          },
          'e': {
            'env': {
              'c': true,
              'd': true,
            },
            'value': 2,
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
            'value': 0,
          },
          '0b': {
            'env': {
              '0a': false,
              '1a': true,
            },
            'value': 0,
          },
          '1a': {
            'env': {
              '0b': false,
              '1b': false,
              '2a': true,
            },
            'value': 1,
          },
          '1b': {
            'env': {
              '1a': false,
              '1c': false,
              '2a': true,
            },
            'value': 1,
          },
          '2a': {
            'env': {
              '1a': true,
              '1b': true,
              '2b': false,
              'v6a': false,
              'v9a': false,
            },
            'value': 2,
          },
          '1c': {
            'env': {
              '1b': false,
              '1d': false,
              '3a': true,
            },
            'value': 1,
          },
          '1d': {
            'env': {
              '1c': false,
              '1e': false,
              '3a': true,
            },
            'value': 1,
          },
          '1e': {
            'env': {
              '1d': false,
              '3a': true,
            },
            'value': 1,
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
            'value': 3,
          },
          '2b': {
            'env': {
              '2a': false,
              '5a': true,
            },
            'value': 2,
          },
          '3b': {
            'env': {
              '3a': false,
              '5a': true,
            },
            'value': 3,
          },
          '5a': {
            'env': {
              '2b': true,
              '3b': true,
            },
            'value': 5,
          },
          'v6a': {
            'env': {
              '2a': true,
              '3a': true,
              'v6b': false,
            },
            'value': Math.log(6),
          },
          'v6b': {
            'env': {
              'v6a': false,
              '6a': true,
            },
            'value': Math.log(6),
          },
          '6a': {
            'env': {
              'v6b': false,
              '6b': true,
            },
            'value': 6,
          },
          '6b': {
            'env': {
              '6a': true,
            },
            'value': 6,
          },
          'v3a': {
            'env': {
              '3a': true,
              'vv9a': false,
            },
            'value': Math.log(3),
          },
          'vv9a': {
            'env': {
              '2a': true,
              'v3a': true,
              'vv9b': false,
            },
            'value': Math.log(Math.log(9)),
          },
          'vv9b': {
            'env': {
              'vv9a': false,
              'v9a': true,
            },
            'value': Math.log(Math.log(9)),
          },
          'v9a': {
            'env': {
              'vv9b': false,
              '9a': true,
            },
            'value': Math.log(9),
          },
          '9a': {
            'env': {
              'v9a': false,
              '9b': true,
            },
            'value': 9,
          },
          '9b': {
            'env': {
              '9a': true,
            },
            'value': 9,
          },
          '0c': {
            'env': {
              '0a': false,
              '1f': true,
            },
            'value': 0,
          },
          '1f': {
            'env': {
              '0c': false,
              '0d': true,
            },
            'value': 1,
          },
          '0d': {
            'env': {
              '0a': false,
              '1f': true,
              '-1a': true,
            },
            'value': 0,
          },
          '-1a': {
            'env': {
              '0d': true,
            },
            'value': -1,
          },
        },
    );
  });
});
