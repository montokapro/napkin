import {evaluateF, shift, z} from '../evaluate.js';

import assert from 'assert';

// const isClose = function(a, b, tolerance = 1e-10) {
//   return Math.abs(a - b) <= tolerance;
// };

const assertValues = function(graph) {
  const nodeVisit = (nodeId) => graph[nodeId];
  const envVisit = (nodeId) => nodeVisit(nodeId).env;

  const edgeVisit = function(edge) {
    const [fromId, toId] = edge;

    const value = nodeVisit(edge[1]).value;

    if (edge[0] != null) {
      const env = envVisit(toId);
      if (env[fromId]) {
        return shift(value, true);
      } else {
        return value;
      }
    } else {
      return value;
    }
  };

  const f = evaluateF(envVisit);
  const evalOne = f(edgeVisit);
  const evalAll = z(f);

  for (const [nodeId, node] of Object.entries(graph)) {
    // Only check nodes with a value
    if ('value' in node) {
      const expected = node.value;

      const actualOne = evalOne([null, nodeId]);
      assert.equal(
          expected,
          actualOne,
          `One: ${nodeId}: ${expected} == ${actualOne}`,
      );

      const actualAll = evalAll([null, nodeId]);
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

  // a =- b
  it('directed edge', () => {
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

  // TODO: support cycles
  //
  // it('two', () => {
  //   assertValues(
  //       {
  //         'a': {
  //           'env': {
  //             'b': false,
  //           },
  //           'value': 0,
  //         },
  //         'b': {
  //           'env': {
  //             'a': false,
  //             'c': true,
  //           },
  //           'value': 0,
  //         },
  //         'c': {
  //           'env': {
  //             'b': false,
  //             'd': false,
  //             'e': true,
  //           },
  //           'value': 1,
  //         },
  //         'd': {
  //           'env': {
  //             'c': false,
  //             'e': true,
  //           },
  //           'value': 1,
  //         },
  //         'e': {
  //           'env': {
  //             'c': true,
  //             'd': true,
  //           },
  //           'value': 2,
  //         },
  //       },
  //   );
  // });
});
