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

const operation = hyperlogarithmicOperations[2];

const shift = function(value, up) {
  if (up) {
    return Math.exp(value);
  } else {
    return Math.log(value);
  }
};

// Note that any two nodes may have at most one edge between them.
const evaluateF = (envVisit) => (valueVisit) => function(edge) {
  const [fromId, focusId] = edge;

  const edges = envVisit(focusId);

  const commutation = operation.commutation.operation;
  const reversion = operation.reversion.operation;

  let traceOp = false;
  let equal = undefined;
  let aggregation = operation.identity;
  for (const [toId, op] of edges) {
    // TODO: check only previous node
    // This can be wrong if there is a cycle
    if (fromId == toId) {
      traceOp = traceOp || op;
    } else {
      const value = valueVisit([focusId, toId]);
      if (op) {
        if (value === undefined) {
          aggregation = undefined;
        } else if (aggregation !== undefined) {
          aggregation = commutation(aggregation, value);
        }
      } else {
        if (value !== undefined) {
          equal = value;
        }
      }
    }
  }

  if (aggregation !== undefined) {
    aggregation = shift(aggregation, false);

    if (traceOp) {
      equal = reversion(equal, aggregation);
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

export {evaluateF, z};
