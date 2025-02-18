// Assume javascript interpreter retains order of hashmaps
export default {
  simple: {
    one: {
      'a': {
        point: [0, 0],
        env: {
        },
        memo: {
          float: 0,
        },
      },
    },
    two: {
      // equal
      'a': {
        point: [0, 0],
        env: {
          'b': false,
        },
        memo: {
          float: 0,
        },
      },
      'b': {
        point: [1, 0],
        env: {
          'a': false,
        },
        memo: {
          float: 0,
        },
      },
      // shift
      'c': {
        point: [0, 1],
        env: {
          'd': false,
        },
        memo: {
          float: 0,
        },
      },
      'd': {
        point: [1, 1],
        env: {
          'c': true,
        },
        memo: {
          float: -Infinity,
        },
      },
      // operation
      'e': {
        point: [0, 2],
        env: {
          'f': true,
        },
        memo: {
          float: undefined,
        },
      },
      'f': {
        point: [1, 2],
        env: {
          'e': true,
        },
        memo: {
          float: undefined,
        },
      },
    },
    three: {
      // equal
      'a': {
        point: [0, 0],
        env: {
          'b': false,
        },
        memo: {
          float: 0,
        },
      },
      'b': {
        point: [1, 0],
        env: {
          'a': false,
          'c': false,
        },
        memo: {
          float: 0,
        },
      },
      'c': {
        point: [2, 0],
        env: {
          'b': false,
        },
        memo: {
          float: 0,
        },
      },
      // shift in
      'd': {
        point: [0, 1],
        env: {
          'e': false,
        },
        memo: {
          float: 0,
        },
      },
      'e': {
        point: [1, 1],
        env: {
          'd': true,
          'f': true,
        },
        memo: {
          float: -Infinity,
        },
      },
      'f': {
        point: [2, 1],
        env: {
          'd': false,
        },
        memo: {
          float: 0,
        },
      },
      // shift out
      'g': {
        point: [0, 2],
        env: {
          'h': true,
        },
        memo: {
          float: -Infinity,
        },
      },
      'h': {
        point: [1, 2],
        env: {
          'g': false,
          'j': false,
        },
        memo: {
          float: 0,
        },
      },
      'j': {
        point: [2, 2],
        env: {
          'h': true,
        },
        memo: {
          float: -Infinity,
        },
      },
      // operation
      'k': {
        point: [0, 3],
        env: {
          'l': true,
        },
        memo: {
          float: undefined,
        },
      },
      'l': {
        point: [1, 3],
        env: {
          'k': true,
          'm': true,
        },
        memo: {
          float: undefined,
        },
      },
      'm': {
        point: [2, 3],
        env: {
          'l': true,
        },
        memo: {
          float: undefined,
        },
      },
    },
    four: {
      // one
      'a': {
        point: [0, 0],
        env: {
          'b': false,
        },
        memo: {
          float: 0,
        },
      },
      'b': {
        point: [1, 0],
        env: {
          'a': false,
          'c': true,
        },
        memo: {
          float: 0,
        },
      },
      // shift
      'c': {
        point: [2, 0],
        env: {
          'b': false,
          'd': true,
        },
        memo: {
          float: 1,
        },
      },
      'd': {
        point: [3, 0],
        env: {
          'c': true,
        },
        memo: {
          float: 1,
        },
      },
    },
  },
  user: {
    operation: {
      // addition
      'a': {
        point: [0, 0],
        env: {
          'b': true,
        },
      },
      'b': {
        point: [1, 1],
        env: {
          'a': true,
          'c': true,
        },
      },
      'c': {
        point: [0, 2],
        env: {
          'b': true,
        },
      },
      // multiplication
      'd': {
        point: [0, 3],
        env: {
          'e': true,
        },
      },
      'e': {
        point: [1, 3],
        env: {
          'd': true,
          'h': false,
        },
      },
      'f': {
        point: [0, 5],
        env: {
          'g': true,
        },
      },
      'g': {
        point: [1, 5],
        env: {
          'f': true,
          'h': false,
        },
      },
      'h': {
        point: [2, 4],
        env: {
          'e': true,
          'g': true,
          'i': false,
        },
      },
      'i': {
        point: [3, 4],
        env: {
          'h': false,
          'j': true,
        },
      },
      'j': {
        point: [4, 4],
        env: {
          'i': false,
          'k': true,
        },
      },
      'k': {
        point: [5, 4],
        env: {
          'j': true,
        },
      },
      // exponentiation
      'l': {
        point: [1, 6],
        env: {
          'm': true,
        },
      },
      'm': {
        point: [2, 6],
        env: {
          'l': true,
          'q': false,
        },
      },
      'n': {
        point: [0, 8],
        env: {
          'o': true,
        },
      },
      'o': {
        point: [1, 8],
        env: {
          'n': true,
          'p': false,
        },
      },
      'p': {
        point: [2, 8],
        env: {
          'o': true,
          'q': false,
        },
      },
      'q': {
        point: [3, 7],
        env: {
          'm': true,
          'p': true,
          'r': false,
        },
      },
      'r': {
        point: [4, 7],
        env: {
          'q': false,
          's': true,
        },
      },
      's': {
        point: [5, 7],
        env: {
          'r': false,
          't': true,
        },
      },
      't': {
        point: [6, 7],
        env: {
          's': false,
          'u': true,
        },
      },
      'u': {
        point: [7, 7],
        env: {
          't': true,
        },
      },
    },
  },
  test: {
    sum: {
      'a': {
        point: [0, 0],
        env: {
          'b': false,
        },
        memo: {
          'float': 0,
        },
      },
      'b': {
        point: [0, 1],
        env: {
          'a': false,
          'c': true,
        },
        memo: {
          'float': 0,
        },
      },
      'c': {
        point: [1, 0],
        env: {
          'b': false,
          'd': false,
          'e': true,
        },
        memo: {
          'float': 1,
        },
      },
      'd': {
        point: [1, 1],
        env: {
          'c': false,
          'e': true,
        },
        memo: {
          'float': 1,
        },
      },
      'e': {
        point: [2, 0],
        env: {
          'c': true,
          'd': true,
        },
        memo: {
          'float': 2,
        },
      },
    },
    complex: {
      '0a': {
        point: [-1, -2],
        env: {
          '0b': false,
          '0c': false,
          '0d': false,
        },
        memo: {
          'float': 0,
        },
      },
      '0b': {
        point: [-1, -1],
        env: {
          '0a': false,
          '1a': true,
        },
        memo: {
          'float': 0,
        },
      },
      '1a': {
        point: [-1, 0],
        env: {
          '0b': false,
          '1b': false,
          '2a': true,
        },
        memo: {
          'float': 1,
        },
      },
      '1b': {
        point: [0, 0],
        env: {
          '1a': false,
          '1c': false,
          '2a': true,
        },
        memo: {
          'float': 1,
        },
      },
      '2a': {
        point: [-1, 1],
        env: {
          '1a': true,
          '1b': true,
          '2b': false,
          'v6a': false,
          'vv9a': false,
        },
        memo: {
          'float': 2,
        },
      },
      '1c': {
        point: [2, 0],
        env: {
          '1b': false,
          '1d': false,
          '3a': true,
        },
        memo: {
          'float': 1,
        },
      },
      '1d': {
        point: [3, 0],
        env: {
          '1c': false,
          '1e': false,
          '3a': true,
        },
        memo: {
          'float': 1,
        },
      },
      '1e': {
        point: [4, 0],
        env: {
          '1d': false,
          '3a': true,
        },
        memo: {
          'float': 1,
        },
      },
      '3a': {
        point: [3, 1],
        env: {
          '1c': true,
          '1d': true,
          '1e': true,
          '3b': false,
          'v6a': false,
          'v3a': false,
        },
        memo: {
          'float': 3,
        },
      },
      '2b': {
        point: [-3, 2],
        env: {
          '2a': false,
          '5a': true,
        },
        memo: {
          'float': 2,
        },
      },
      '3b': {
        point: [-1, 2],
        env: {
          '3a': false,
          '5a': true,
        },
        memo: {
          'float': 3,
        },
      },
      '5a': {
        point: [-2, 3],
        env: {
          '2b': true,
          '3b': true,
        },
        memo: {
          'float': 5,
        },
      },
      'v6a': {
        point: [1, 2],
        env: {
          '2a': true,
          '3a': true,
          'v6b': false,
        },
        memo: {
          'float': Math.log(6),
        },
      },
      'v6b': {
        point: [1, 3],
        env: {
          'v6a': false,
          '6a': true,
        },
        memo: {
          'float': Math.log(6),
        },
      },
      '6a': {
        point: [1, 4],
        env: {
          'v6b': false,
          '6b': true,
        },
        memo: {
          'float': 6,
        },
      },
      '6b': {
        point: [1, 5],
        env: {
          '6a': true,
        },
        memo: {
          'float': 6,
        },
      },
      'v3a': {
        point: [4, 1],
        env: {
          '3a': true,
          'vv9a': false,
        },
        memo: {
          'float': Math.log(3),
        },
      },
      'vv9a': {
        point: [3, 2],
        env: {
          '2a': true,
          'v3a': true,
          'vv9b': false,
        },
        memo: {
          'float': Math.log(Math.log(9)),
        },
      },
      'vv9b': {
        point: [3, 3],
        env: {
          'vv9a': false,
          'v9a': true,
        },
        memo: {
          'float': Math.log(Math.log(9)),
        },
      },
      'v9a': {
        point: [3, 4],
        env: {
          'vv9b': false,
          '9a': true,
        },
        memo: {
          'float': Math.log(9),
        },
      },
      '9a': {
        point: [3, 5],
        env: {
          'v9a': false,
          '9b': true,
        },
        memo: {
          'float': 9,
        },
      },
      '9b': {
        point: [3, 6],
        env: {
          '9a': true,
        },
        memo: {
          'float': 9,
        },
      },
      '0c': {
        point: [-2, -1],
        env: {
          '0a': false,
          '1f': true,
        },
        memo: {
          'float': 0,
        },
      },
      '1f': {
        point: [-2, 0],
        env: {
          '0c': false,
          '0d': true,
        },
        memo: {
          'float': 1,
        },
      },
      '0d': {
        point: [-3, -1],
        env: {
          '0a': false,
          '1f': true,
          '-1a': true,
        },
        memo: {
          'float': 0,
        },
      },
      '-1a': {
        point: [-3, 0],
        env: {
          '0d': true,
        },
        memo: {
          'float': -1,
        },
      },
    },
  },
};
