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
  },
};
