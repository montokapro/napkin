import {hyperlogarithmicOperations} from './operations.js';
import {objectIterable} from './struct.js';

const prettyNumber = function(number) {
  switch (number) {
    case -Infinity:
      return '-∞';
    case Infinity:
      return '∞';
    default:
      return number;
  }
};

// Cannot be used concurrently
const withStackTraceF = function(visit) {
  const trace = [];
  return function(focusId) {
    trace.unshift(focusId);
    const result = visit(focusId);
    trace.shift();
    return result;
  };
}

const operation = hyperlogarithmicOperations[0];

const shift = function (value, up) {
  if (up) {
    return Math.exp(value);
  } else {
    return Math.log(value);
  }
}

// Note that any two nodes may have at most one edge between them.
const evaluateF = (envVisit) => (valueVisit) => function(focusId) {
    const edges = envVisit(focusId);

    const commutation = operation.commutation.operation;
    const reversion = operation.reversion.operation;

    let traceOp = false;
    var equal = undefined;
    var aggregation = operation.identity;
    for (const [id, op] of edges) {
      // TODO: check only previous node
      // This can be wrong if there is a cycle
      // if (trace.includes(id)) {
      //   traceOp = traceOp || op
      // } else {
        // const value = traceVisit(id);

        const value = valueVisit(id);
        if (op) {
          if (value === undefined) {
            aggregation = undefined
          } else if (aggregation !== undefined) {
            aggregation = commutation(aggregation, value)
          }
        } else {
          if (value !== undefined) {
            equal = value;
          }
        }
      // }
    }

    if (aggregation !== undefined) {
      aggregation = shift(aggregation, true)

      if (traceOp) {
        equal = reversion(equal, aggregation)
      } else {
        equal = aggregation;
      }
    }

    return equal;
};

// Use strict fixed point combinator so that we can test steps independently
// https://en.wikipedia.org/wiki/Fixed-point_combinator#Strict_fixed-point_combinator
const z = function(f) {
  const g = (a) => f((v) => a(a)(v));

  return g(g);
};

export {evaluateF, withStackTraceF, z};
