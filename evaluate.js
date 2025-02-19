// import {hyperlogarithmicOperations} from './operations.js';
// import {objectIterable} from './struct.js';

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

// Assumes n is a safe integer
const shift = function(n, float) {
  let i = 0;
  if (n >= 0) {
    while (i < n) {
      float = Math.exp(float);
      i++;
    }
  } else {
    while (i > n) {
      float = Math.log(float);
      i--;
    }
  }
  return float;
};

const floatCtx = {
  'identity': 0,
  'commutation': undefinedF((a, b) => a + b),
  'reversion': undefinedF((a, b) => a - b),
  'shift': undefinedF((value, up) => up ? shift(1, value) : shift(-1, value)),
};

const shiftValueToFloat = (value) => shift(value.shift, value.float);

const shiftCtx = {
  'identity': {
    'shift': 0,
    'float': 0,
  },
  'commutation': undefinedF(
      (a, b) => (
        {
          'shift': 0,
          'float': shiftValueToFloat(a) + shiftValueToFloat(b),
        }
      ),
  ),
  'reversion': undefinedF(
      (a, b) => (
        {
          'shift': 0,
          'float': shiftValueToFloat(a) - shiftValueToFloat(b),
        }
      ),
  ),
  'shift': undefinedF(
      (value, up) => (
        {
          'shift': up ? value.shift + 1 : value.shift - 1,
          'float': value.float,
        }
      ),
  ),
};

const stringCtx = {
  'identity': '',
  'commutation': undefinedF((a, b) => a + ' + ' + b),
  'reversion': undefinedF((a, b) => a - b),
  'shift': undefinedF((value, up) => up ? shift(1, value) : shift(-1, value)),
};

// Note that any two nodes may have at most one edge between them.
//
// Stack must not be empty.
const evaluateF = (ctx) => (f) => function(stack) {
  const edges = Object.entries(ctx.env(stack[0]));

  const visit = function(id) {
    stack.unshift(id);
    const result = f(stack);
    stack.shift();
    return result;
  };

  let fromOp = false;
  let equal = ctx.unit(stack);
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

  // console.log(stack);
  // console.log(fromOp);
  // console.log(equal);
  // console.log(aggregation);
  // console.log(result);
  // console.log('');

  return result;
};

const isEqualF = (env) => (f) => function(aId, bId) {
  const aEnv = env(aId);
  const bEnv = env(bId);

  if (aEnv[bId] == false && bEnv[aId] == false) {
    return true;
  }

  const aIdentity = Object.values(aEnv).every((value) => value !== false);
  const bIdentity = Object.values(bEnv).every((value) => value !== false);

  if (aIdentity && bIdentity) {
    return true;
  }

  return undefined;
};

// Use strict fixed point combinator so that we can test steps independently
// https://en.wikipedia.org/wiki/Fixed-point_combinator#Strict_fixed-point_combinator
const z = function(f) {
  const g = (a) => f((v) => a(a)(v));

  return g(g);
};

export {
  floatCtx, shiftValueToFloat, shiftCtx,
  evaluateF, isEqualF, z, undefinedF,
};
