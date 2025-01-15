import {hyperlogarithmicOperations} from './operations.js';
import {objectIterable} from './struct.js';

// const prettyNumber = function(number) {
//   switch (number) {
//     case -Infinity:
//       return '-∞';
//     case Infinity:
//       return '∞';
//     default:
//       return number;
//   }
// };

// const operation = hyperlogarithmicOperations[1];

const undefinedF = (f) => function(...args) {
  if (args.some((arg) => arg === undefined)) {
    return undefined;
  } else {
    return f(...args);
  }
};

const shift = function(value, up) {
  if (up) {
    return Math.exp(value);
  } else {
    return Math.log(value);
  }
};

const ctx = {
  'identity': 0,
  'commutation': undefinedF((a, b) => a + b),
  'reversion': undefinedF((a, b) => a - b),
  'shift': undefinedF(shift),
};


// Note that any two nodes may have at most one edge between them.
//
// Stack must not be empty.
const evaluateF = (env) => (f) => function(stack) {
  const edges = Object.entries(env(stack[0]));

  const visit = function(id) {
    stack.unshift(id);
    const result = f(stack);
    stack.shift();
    return result;
  };

  let fromOp = false;
  let equal = undefined;
  let aggregation = ctx.identity;
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
      if (toOp) {
        aggregation = ctx.commutation(
            aggregation,
            ctx.shift(visit(toId), false),
        );
      } else {
        if (equal === undefined) {
          equal = visit(toId);
        }
      }
    }
  }

  let result;
  if (fromOp) {
    result = ctx.shift(ctx.reversion(equal, aggregation), true);
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

export {evaluateF, z};
