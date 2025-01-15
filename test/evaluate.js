import {evaluateF, z} from '../evaluate.js';

import assert from 'assert';

// const isClose = function(a, b, tolerance = 1e-10) {
//   return Math.abs(a - b) <= tolerance;
// };

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
      assert.equal(
          expected,
          actualOne,
          `One: ${nodeId}: ${expected} == ${actualOne}`,
      );

      const actualAll = evalAll([nodeId]);
      assert.equal(
          expected,
          actualAll,
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

  // 0a == 0b
  // 0b -= 1a
  // 1a == 1b
  // 1a -- 2a
  // 1b -- 2a
  // 1b == 1c
  // 1c == 1d
  // 1d == 1e
  // 1c -- 3a
  // 1d -- 3a
  // 1e -- 3a
  // 2a -- 5a
  // 3a -- 5a
  it('add', () => {
    assertValues(
        {
          '0a': {
            'env': {
              '0b': false,
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
        },
    );
  });
});
