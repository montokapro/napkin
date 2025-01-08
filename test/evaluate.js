import {evaluateF, z} from '../evaluate.js';

import assert from 'assert';

// const isClose = function(a, b, tolerance = 1e-10) {
//   return Math.abs(a - b) <= tolerance;
// };

const assertValues = function(graph) {
  const nodeVisit = (nodeId) => graph[nodeId];
  const envVisit = (nodeId) => Object.entries(nodeVisit(nodeId).env);
  const valueVisit = (nodeId) => nodeVisit(nodeId).value;

  const evalF = evaluateF(envVisit);
  const evalOne = evalF(valueVisit)([]);
  const evalAll = z(evalF)([]);

  for (const [nodeId, node] of Object.entries(graph)) {
    // Only check nodes with a value
    if ('value' in node) {
      const expected = node.value;

      const actualOne = evalOne(nodeId);
      assert.equal(
          expected,
          actualOne,
          `One: ${nodeId}: ${expected} == ${actualOne}`,
      );

      const actualAll = evalAll(nodeId);
      assert.equal(
          expected,
          actualAll,
          `One: ${nodeId}: ${expected} == ${actualAll}`,
      );
    }
  }
};

describe('#envValueVisit', () => {
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

  // it('eq edge', () => {
  //   assertValueEqual(
  //       {
  //         'a': {
  //           'b': false,
  //         },
  //         'b': {
  //           'a': false,
  //         },
  //       },
  //       {
  //         'a': 0,
  //         'b': 0,
  //       },
  //   );
  // });

  // it('op edge', () => {
  //   assertValueEqual(
  //       {
  //         'a': {
  //           'b': true,
  //         },
  //         'b': {
  //           'a': true,
  //         },
  //       },
  //       {},
  //   );
  // });

  // it('one', () => {
  //   assertValueEqual(
  //       {
  //         'a': {
  //           'b': false,
  //         },
  //         'b': {
  //           'a': false,
  //           'c': true,
  //         },
  //         'c': {
  //           'b': false,
  //           'd': true,
  //         },
  //         'd': {
  //           'c': true,
  //         },
  //       },
  //       {
  //         'a': 0,
  //         'b': 0,
  //         'c': 1,
  //         'd': 1,
  //       },
  //   );
  // });

  // it('two', () => {
  //   assertValueEqual(
  //       {
  //         'a': {
  //           'b': false,
  //         },
  //         'b': {
  //           'a': false,
  //           'c': true,
  //         },
  //         'c': {
  //           'b': false,
  //           'd': false,
  //           'e': true,
  //         },
  //         'd': {
  //           'c': false,
  //           'e': true,
  //         },
  //         'd': {
  //           'c': true,
  //           'd': true,
  //         },
  //       },
  //       {
  //         'a': 0,
  //         'b': 0,
  //         'c': 1,
  //         'd': 1,
  //         'e': 2,
  //       },
  //   );
  // });
});
