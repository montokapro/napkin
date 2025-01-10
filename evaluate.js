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

const operation = hyperlogarithmicOperations[1];

const shift = function(value, up) {
  if (value === undefined) {
    return undefined;
  }

  if (up) {
    return Math.exp(value);
  } else {
    return Math.log(value);
  }
};

// Note that any two nodes may have at most one edge between them.
const evaluateF = (envVisit) => (valueVisit) => function(edge) {
  const [fromId, focusId] = edge;

  const edges = Object.entries(envVisit(focusId));

  const commutation = operation.commutation.operation;
  const reversion = operation.reversion.operation;

  let fromOp = false;
  let equal = undefined;
  let aggregation = operation.identity;
  for (const [toId, toOp] of edges) {
    // TODO: check only previous node
    // This can be wrong if there is a cycle
    if (fromId == toId) {
      fromOp = toOp;
    } else {
      const value = valueVisit([focusId, toId]);
      if (toOp) {
        if (value === undefined) {
          aggregation = undefined;
        } else if (aggregation !== undefined) {
          aggregation = commutation(aggregation, shift(value, false));
        }
      } else {
        if (value !== undefined) {
          equal = value;
        }
      }
    }
  }

  if (fromOp) {
    if (aggregation === undefined || equal === undefined) {
      return undefined;
    } else {
      return shift(reversion(equal, aggregation), true);
    }
  } else {
    if (aggregation === undefined) {
      return equal;
    } else {
      return aggregation;
    }
  }
};

// Use strict fixed point combinator so that we can test steps independently
// https://en.wikipedia.org/wiki/Fixed-point_combinator#Strict_fixed-point_combinator
const z = function(f) {
  const g = (a) => f((v) => a(a)(v));

  return g(g);
};

export {evaluateF, shift, z};
