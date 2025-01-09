import {evaluateF, z} from '../evaluate.js';

import assert from 'assert';

// const isClose = function(a, b, tolerance = 1e-10) {
//   return Math.abs(a - b) <= tolerance;
// };

const assertValues = function(graph) {
  const nodeVisit = (nodeId) => graph[nodeId];
  const envVisit = (nodeId) => Object.entries(nodeVisit(nodeId).env);
  const edgeVisit = (edge) => nodeVisit(edge[1]).value;

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
  it('negative infinity', () => {
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
            'value': -Infinity,
          },
          'd': {
            'env': {
              'c': true,
            },
            'value': -Infinity,
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
