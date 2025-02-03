// Assume javascript interpreter retains order of hashmaps
const graphs = {
  simple: {
    one: {
      // equal
      'a': {
        point: [0, 0],
        env: {
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
      },
      'b': {
        point: [1, 0],
        env: {
          'a': false,
        },
      },
      // shift
      'c': {
        point: [0, 1],
        env: {
          'd': false,
        },
      },
      'd': {
        point: [1, 1],
        env: {
          'c': true,
        },
      },
      // operation
      'e': {
        point: [0, 2],
        env: {
          'f': true,
        },
      },
      'f': {
        point: [1, 2],
        env: {
          'e': true,
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
      },
      'b': {
        point: [1, 0],
        env: {
          'a': false,
          'c': false,
        },
      },
      'c': {
        point: [2, 0],
        env: {
          'b': false,
        },
      },
      // shift down
      'd': {
        point: [0, 1],
        env: {
          'e': false,
        },
      },
      'e': {
        point: [1, 1],
        env: {
          'd': true,
          'f': true,
        },
      },
      'f': {
        point: [2, 1],
        env: {
          'd': false,
        },
      },
      // shift up
      'g': {
        point: [0, 2],
        env: {
          'h': true,
        },
      },
      'h': {
        point: [1, 2],
        env: {
          'g': false,
          'j': false,
        },
      },
      'j': {
        point: [2, 2],
        env: {
          'h': true,
        },
      },
      // operation
      'k': {
        point: [0, 3],
        env: {
          'l': true,
        },
      },
      'l': {
        point: [1, 3],
        env: {
          'k': true,
          'm': true,
        },
      },
      'm': {
        point: [2, 3],
        env: {
          'l': true,
        },
      },
    },
  },
};

export {graphs};
