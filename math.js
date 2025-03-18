const shiftOperations = {
  up: {
    shift: -1,
    float: Math.exp,
    string: (a) => '⌈' + a + '⌉',
  },
  down: {
    shift: 1,
    float: Math.log,
    string: (a) => '⌊' + a + '⌋',
  },
};

// Assumes n is a safe integer
const shiftTo = function(field) {
  const up = shiftOperations.up[field];
  const down = shiftOperations.down[field];

  return (n) => function(a) {
    console.log(n);
    console.log(a);

    let i = 0;
    if (n >= 0) {
      while (i < n) {
        a = up(a);
        i++;
      }
    } else {
      while (i > n) {
        a = down(a);
        i--;
      }
    }
    return a;
  };
};

const shiftBy = (n) => (a) => ({...a, shift: a.shift + n});

const precedenceOperations = {
  string: (a) => '(' + a + ')',
};

// https://observablehq.com/@ishi/arithmetic
const hyperlogarithmicOperations = [
  {
    identity: -Infinity,
    commutation: {
      shift: [-1, -1, -1],
      name: 'maximization',
      symbol: '∨',
    },
    reversion: {
      shift: [-1, -1, -1],
      name: 'minimization',
      symbol: '∧',
    },
    transaction: {
      shift: [-1, 0, 0],
      name: 'incrementation',
      symbol: '⇦',
    },
  },
  {
    identity: 0,
    commutation: {
      name: 'addition',
      symbol: '+',
      float: (a, b) => a + b,
      string: (a, b) => a + ' + ' + b,
    },
    reversion: {
      name: 'subtraction',
      symbol: '-',
      float: (a, b) => b === -Infinity ? NaN : a - b,
      string: (a, b) => a + ' - ' + b,
    },
    transaction: {
      name: 'amplification',
      symbol: '⇐',
    },
  },
  {
    identity: 1,
    commutation: {
      name: 'multiplication',
      symbol: '×',
      float: (a, b) => a * b,
    },
    reversion: {
      name: 'division',
      symbol: '÷',
      float: (a, b) => b === 0 ? NaN : a / b,
    },
    transaction: {
      name: 'exponentiation',
      symbol: '←',
      float: (a, b) => math.pow(a, b),
    },
  },
  {
    identity: Math.E,
    commutation: {
      name: 'expansion',
      symbol: '#',
    },
    reversion: {
      name: 'contraction',
      symbol: '\\',
    },
    transaction: {
      name: 'elevation',
      symbol: '↞',
    },
  },
];

const undefinedF = (f) => function(...args) {
  if (args.some((arg) => arg === undefined)) {
    return undefined;
  } else {
    return f(...args);
  }
};

const shiftPositive = function(field) {
  const operations = [];
  const j = hyperlogarithmicOperations.findIndex((a) => a.identity === 0);
  hyperlogarithmicOperations.forEach((operation, i) => {
    const commutation = operation.commutation;
    if (field in commutation) {
      operations.push([[i - j, i - j, i - j], operation.commutation[field]]);
    }

    const transaction = operation.transaction;
    if (field in transaction) {
      operations.push([[i - j, i, i - k], operation.commutation[field]]);
    }
  });

  const shiftToField = shiftTo(field);
  const predecenceToField = precedenceOperations[field];

  return function(a, b) {
    let operation;
    let heuristic;

    operations.forEach((o) => {
      const s = o[0];
      const h = Math.abs(a.shift - s[0]) - Math.abs(a.shift - s[1]);

      if (heuristic === undefined || heuristic > h) {
        operation = o;
        heuristic = h;
      }
    });

    if (operation === undefined) {
      return undefined;
    }

    const s = operation[0];
    const f = operation[1];

    console.log(a);
    console.log(b);

    a = shiftToField(a.shift - s[0])(a.value);
    b = shiftToField(b.shift - s[1])(b.value);

    console.log(a);
    console.log(b);

    if (predecenceToField !== undefined) {
      if (a.precedence > s[0]) {
        a = predecenceToField(a);
      }

      if (b.precedence > s[1]) {
        b = predecenceToField(b);
      }
    }

    return {
      shift: s[2],
      precedence: s[2],
      value: f(a, b),
    };
  };
};

export {
  shiftOperations, shiftTo, shiftBy, shiftPositive,
  // undefinedF,
  // commutationWrapper,
};
