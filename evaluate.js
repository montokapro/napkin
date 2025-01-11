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
//
// Stack must not be empty.
const evaluateF = (envVisit) => (valueVisit) => function(stack) {
  const commutation = operation.commutation.operation;
  const reversion = operation.reversion.operation;

  const edges = Object.entries(envVisit(stack[0]));

  const stackVisit = function(id) {
    stack.unshift(id);
    const result = valueVisit(stack);
    stack.shift();
    return result;
  };

  let fromOp = false;
  let equal = undefined;
  let aggregation = operation.identity;
  for (const [toId, toOp] of edges) {
    const toIndex = stack.indexOf(toId);

    if (toIndex >= 0) {
      // TODO: consider supporting self references
      if (toOp) {
        if (toIndex != 1) {
          // Optimization: return undefined;
          aggregation = undefined;
        } else {
          fromOp = toOp;
        }
      }
    } else {
      const value = stackVisit(toId);
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

  let result;
  if (fromOp) {
    if (aggregation === undefined || equal === undefined) {
      result = undefined;
    } else {
      result = shift(reversion(equal, aggregation), true);
    }
  } else {
    if (aggregation === undefined) {
      result = equal;
    } else {
      result = aggregation;
    }
  }

  // console.log(stack)
  // console.log(fromOp)
  // console.log(equal)
  // console.log(aggregation)
  // console.log(result)
  // console.log("")

  return result;
};

// Use strict fixed point combinator so that we can test steps independently
// https://en.wikipedia.org/wiki/Fixed-point_combinator#Strict_fixed-point_combinator
const z = function(f) {
  const g = (a) => f((v) => a(a)(v));

  return g(g);
};

export {evaluateF, shift, z};
