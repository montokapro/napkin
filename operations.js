// https://observablehq.com/@ishi/arithmetic
const hyperlogarithmicOperations = [
  {
    identity: -Infinity,
    commutation: {
      name: 'maximization',
      symbol: '∨',
      operation: (a, b) => {
        return Math.log(Math.exp(a) + Math.exp(b));
      },
    },
    reversion: {
      name: 'minimization',
      symbol: '∧',
      operation: (a, b) => {
        return Math.log(Math.exp(a) - Math.exp(b));
      },
    },
    transaction: {
      name: 'incrementation',
      operation: (a, b) => {
        return a + Math.exp(b);
      },
    },
  },
  {
    identity: 0,
    commutation: {
      name: 'addition',
      symbol: '+',
      operation: (a, b) => {
        return a + b;
      },
    },
    reversion: {
      name: 'subtraction',
      symbol: '-',
      operation: (a, b) => {
        return a - b;
      },
    },
    transaction: {
      name: 'amplification',
      operation: (a, b) => {
        return a * Math.exp(b);
      },
    },
  },
  {
    identity: 1,
    commutation: {
      name: 'multiplication',
      symbol: '×',
      operation: (a, b) => {
        return a * b;
      },
    },
    reversion: {
      name: 'division',
      symbol: '÷',
      operation: (a, b) => {
        return a / b;
      },
    },
    transaction: {
      name: 'exponentiation',
      operation: (a, b) => {
        return Math.pow(a, b);
      },
    },
  },
  {
    identity: Math.E,
    commutation: {
      name: 'expansion',
      symbol: '#',
      operation: (a, b) => {
        return Math.exp(Math.log(a) * Math.log(b));
      },
    },
    reversion: {
      name: 'contraction',
      symbol: '\\',
      operation: (a, b) => {
        return Math.exp(Math.log(a) / Math.log(b));
      },
    },
    transaction: {
      name: 'elevation',
      operation: (a, b) => {
        return Math.pow(Math.log(a), Math.log(b));
      },
    },
  },
];

export {hyperlogarithmicOperations};
