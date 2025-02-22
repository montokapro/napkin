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
const shiftFloat = function(n, float) {
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

// simplest way to compute integers,
// but can lose precision through repeated operations
const floatCtx = {
  'identity': 0,
  'commutation': undefinedF((a, b) => a + b),
  'reversion': undefinedF((a, b) => a - b),
  'shift': undefinedF((value, up) => up ? shiftFloat(1, value) : shiftFloat(-1, value)),
  'equation': (a, f) => a === undefined ? f() : a,
};

const shiftFloatValue = undefinedF((value) => shiftFloat(value.shift, value.float));

// optimized to preserve integers through transformations
const shiftFloatCtx = {
  'identity': {
    'shift': 0,
    'float': 0,
  },
  'commutation': undefinedF(
      function(...args) {
        return args
            .sort((a, b) => b.shift - a.shift) // reordering possible due to commutation
            .reduce(
                (acc, v) => {
                  if (acc.shift === 0 && acc.float === 0) {
                    return v;
                  }

                  if (v.shift === 0 && v.float === 0) {
                    return acc;
                  }

                  if (acc.shift >= 0) {
                    return {
                      'shift': 0,
                      'float': shiftFloat(acc.shift, acc.float) + shiftFloat(v.shift, v.float),
                    };
                  }

                  if (v.shift >= -1) {
                    return {
                      'shift': -1,
                      'float': shiftFloat(acc.shift + 1, acc.float) * shiftFloat(v.shift + 1, v.float),
                    };
                  }

                  return {
                    'shift': -2,
                    'float': shiftFloat(v.shift + 2, v.float) ** shiftFloat(acc.shift + 1, acc.float),
                  };
                },
            );
      },
  ),
  'reversion': undefinedF(
      function(...args) {
        return args
            .reduce(
                (acc, v) => {
                  if (acc.shift === 0 && acc.float === 0) {
                    return {
                      'shift': 0,
                      'float': 0 - shiftFloat(v.shift, v.float),
                    };
                  }

                  if (v.shift === 0 && v.float === 0) {
                    return acc;
                  }

                  if (acc.shift >= 0 && v.shift >= 0) {
                    return {
                      'shift': 0,
                      'float': shiftFloat(acc.shift, acc.float) - shiftFloat(v.shift, v.float),
                    };
                  }

                  return {
                    'shift': -1,
                    'float': shiftFloat(acc.shift + 1, acc.float) / shiftFloat(v.shift + 1, v.float),
                  };

                  // exponentiation with a negative number base is broken
                  // in javascript so just multiply instead
                  //
                  //   return {
                  //     'shift': -2,
                  //     'float': shiftFloat(v.shift + 2, v.float) ** (1 / shiftFloat(acc.shift + 1, acc.float)),
                  //   };
                },
            );
      },
  ),
  'shift': undefinedF(
      (value, up) => (
        {
          'shift': up ? value.shift + 1 : value.shift - 1,
          'float': value.float,
        }
      ),
  ),
  'equation': (a, f) => a === undefined ? f() : a,
};

// Assumes n is a safe integer
const shiftString = function(n, string) {
  let i = 0;
  if (n >= 0) {
    while (i < n) {
      string = '⌈' + string + '⌉';
      i++;
    }
  } else {
    while (i > n) {
      string = '⌊' + string + '⌋';
      i--;
    }
  }
  return string;
};

// simplest way to represent equations,
// but is highly verbose
const stringCtx = {
  'identity': '0',
  'commutation': undefinedF((a, b) => a + ' + ' + b),
  'reversion': undefinedF((a, b) => a + ' - ' + b),
  'shift': undefinedF(
      (value, up) => up ? shiftString(1, value) : shiftString(-1, value),
  ),
  'equation': (a, f) => {
    const b = f();

    if (a === undefined) {
      return b;
    }

    if (b === undefined) {
      return a;
    }

    return a + ' = ' + b;
  },
};

const shiftStringValue = undefinedF((value) => shiftString(value.shift, value.string));

// more concise way to represent equations
const shiftStringCtx = {
  'identity': {
    'shift': 0,
    'string': '0',
  },
  'commutation': function(...args) {
    return args
        .reduce(
            (acc, v) => {
              if (v === undefined) {
                return acc;
              }

              if (acc === undefined) {
                // Consider supporting division, or arbitrary hyperoperations
                return v;
              }

              if (acc.shift >= 0 && v.shift >= 0) {
                return {
                  'shift': 0,
                  'string': shiftString(acc.shift, acc.string) + ' + ' + shiftString(v.shift, v.string),
                };
              }

              return {
                'shift': -1,
                'string': shiftString(acc.shift + 1, acc.string) + ' * ' + shiftString(v.shift + 1, v.string),
              };
            },
        );
  },
  'reversion': function(...args) {
    return args
        .reduce(
            (acc, v) => {
              if (v === undefined) {
                return acc;
              }

              if (acc === undefined) {
                // Consider supporting division, or arbitrary hyperoperations
                return {
                  'shift': 0,
                  'string': '0 - ' + shiftString(v.shift, v.string),
                };
              }

              if (acc.shift >= 0 && v.shift >= 0) {
                return {
                  'shift': 0,
                  'string': shiftString(acc.shift, acc.string) + ' - ' + shiftString(v.shift, v.string),
                };
              }

              return {
                'shift': -1,
                'string': shiftString(acc.shift + 1, acc.string) + ' / ' + shiftString(v.shift + 1, v.string),
              };
            },
        );
  },
  'shift': undefinedF(
      (value, up) => (
        {
          'shift': up ? value.shift + 1 : value.shift - 1,
          'string': value.string,
        }
      ),
  ),
  'equation': (a, f) => {
    const b = f();

    if (a === undefined) {
      return b;
    }

    if (b === undefined) {
      return a;
    }

    // Consider shifting at closest level
    return {
      'shift': 0,
      'string': shiftString(a.shift, a.string) + ' = ' + shiftString(b.shift, b.string),
    };
  },
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
        equal = ctx.equation(equal, () => visit(toId));
      }
    }
  }

  let result;
  if (fromOp) {
    result = ctx.shift(ctx.reversion(equal, aggregation), true);
  } else {
    result = ctx.equation(aggregation, () => equal);
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
  floatCtx, shiftFloatValue, shiftFloatCtx,
  stringCtx, shiftStringValue, shiftStringCtx,
  evaluateF, isEqualF, z, undefinedF,
};
