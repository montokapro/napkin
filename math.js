const shifts = {
  down: {
    shift: -1,
    symbol: ['⌊', '⌋'],
    float: Math.log,
  },
  identity: {
    shift: 0,
    symbol: ['(', ')'],
    float: (a) => a,
  },
  up: {
    shift: 1,
    symbol: ['⌈', '⌉'],
    float: Math.exp,
  },
};

Object.values(shifts).forEach((o) => {
  o.string = (a) => o.symbol[0] + a + o.symbol[1];

  // TODO: remove?
  o.eager = {
    string: (a) => ({
      shift: o.shift,
      string: o.string(a.string),
    }),

    float: (a) => ({
      shift: o.shift,
      float: o.float(a.float),
    }),
  };

  o.lazy = {
    string: (a) => ({
      shift: o.shift + a.shift,
      precedence: Infinity,
      string: o.string(a.string),
    }),

    float: (a) => ({
      shift: o.shift + a.shift,
      precedence: Infinity,
      float: o.float(a.float),
    }),
  };
});

// Assumes n is a safe integer
const shiftBy = function(shifts) {
  return function(n, a) {
    let i = 0;
    if (n >= i) {
      while (n > i) {
        a = shifts.up(a);
        i++;
      }
    } else {
      while (n < i) {
        a = shifts.down(a);
        i--;
      }
    }

    return a;
  };
};

// Assumes n is a safe integer
const shiftTo = function(shifts) {
  const by = shiftBy(shifts);

  return function(n, a) {
    const b = by(n - a.shift, a)

    // consider passing whether equal is acceptable
    if (b.precedence < n) {
      return shifts.identity(b)
    }

    return b;
  };
};

// https://observablehq.com/@ishi/arithmetic
// const hyperlogarithmicOperations = [
//   {
//     identity: {
//       shift: -1,
//       symbol: '-∞',
//       float: -Infinity,
//     }
//     commutation: {
//       shift: [-1, -1, -1],
//       name: 'maximization',
//       symbol: '∨',
//     },
//     reversion: {
//       shift: [-1, -1, -1],
//       name: 'minimization',
//       symbol: '∧',
//     },
//     transaction: {
//       shift: [-1, 0, 0],
//       name: 'incrementation',
//       symbol: '⇦',
//     },
//   },
//   {
//     identity: {
//       shift: 0,
//       symbol: '0',
//       float: 0,
//     },
//     commutation: {
//       shift: [0, 0, 0],
//       name: 'addition',
//       symbol: '+',
//       float: (a, b) => a + b,
//       string: (a, b) => a + ' + ' + b,
//     },
//     reversion: {
//       shift: [0, 0, 0],
//       bias: 'left',
//       name: 'subtraction',
//       symbol: '-',
//       float: (a, b) => b === -Infinity ? NaN : a - b,
//       string: (a, b) => a + ' - ' + b,
//     },
//     transaction: {
//       shift: [0, 1, 1],
//       name: 'amplification',
//       symbol: '⇐',
//     },
//   },
//   {
//     identity: {
//       shift: 1,
//       symbol: '1',
//       float: 1,
//     },
//     commutation: {
//       name: 'multiplication',
//       symbol: '×',
//       float: (a, b) => a * b,
//       string: (a, b) => a + ' × ' + b,
//     },
//     reversion: {
//       name: 'division',
//       symbol: '÷',
//       float: (a, b) => b === 0 ? NaN : a / b,
//       string: (a, b) => a + ' ÷ ' + b,
//     },
//     transaction: {
//       name: 'exponentiation',
//       symbol: '←',
//       float: (a, b) => math.pow(a, b),
//       string: (a, b) => a + ' ← ' + b,
//     },
//   },
//   {
//     identity: {
//       shift: 2,
//       symbol: 'e',
//       float: Math.E,
//     },
//     commutation: {
//       name: 'expansion',
//       symbol: '#',
//     },
//     reversion: {
//       name: 'contraction',
//       symbol: '\\',
//     },
//     transaction: {
//       name: 'elevation',
//       symbol: '↞',
//     },
//   },
// ];

const undefinedF = (f) => function(...args) {
  if (args.some((arg) => arg === undefined)) {
    return undefined;
  } else {
    return f(...args);
  }
};

const shiftOperation = function(to, op, l, r, o) {
  return function(a, b) {
    console.log(a);
    console.log(b);

    a = to(l, a);
    b = to(r, b);

    console.log(a);
    console.log(b);

    return {
      shift: o,
      precedence: o,
      string: op(a.string, b.string),
    };
  };
};

// const matchOperation = function(l, r, o) {

// }


// const shiftOperation = function(shifts, operations) {
//   // const operations = [];
//   // const j = hyperlogarithmicOperations.findIndex((a) => a.identity === 0);
//   // hyperlogarithmicOperations.forEach((operation, i) => {
//   //   const commutation = operation.commutation;
//   //   if (field in commutation) {
//   //     operations.push([[i - j, i - j, i - j], operation.commutation[field]]);
//   //   }

//   //   const transaction = operation.transaction;
//   //   if (field in transaction) {
//   //     operations.push([[i - j, i, i - k], operation.commutation[field]]);
//   //   }
//   // });

//   // const shiftOps = Object.fromEntries(
//   //   Object.entries(obj).map(
//   //     ([k, v], i) => [k, fn(v, k, i)]
//   //   )
//   // )


//   // shiftOperations.map((k, v) [field];
//   // const down = shiftOperations.down[field];


//   const to = shiftTo(shifts);

//   return function(a, b) {
//     let operation;
//     let heuristic;

//     operations.forEach((o) => {
//       const s = o[0];
//       const h = Math.abs(a.shift - s[0]) - Math.abs(a.shift - s[1]);

//       if (heuristic === undefined || heuristic > h) {
//         operation = o;
//         heuristic = h;
//       }
//     });

//     if (operation === undefined) {
//       return undefined;
//     }

//     const s = operation[0];
//     const f = operation[1];

//     console.log(a);
//     console.log(b);

//     a = to(s[0])(a);
//     b = to(s[1])(b);

//     console.log(a);
//     console.log(b);

//     return {
//       shift: s[2],
//       precedence: s[2],
//       value: f(a, b),
//     };
//   };
// };


// identities

// inversion
//
// commutation
// reversion
//
// transaction
// extraction
// execution

export {
  shifts, shiftBy, shiftTo, shiftOperation,
  // undefinedF,
  // commutationWrapper,
};
