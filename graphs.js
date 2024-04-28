// Assume javascript interpreter retains order of hashmaps
const graphs = {
  one: {
    identity: [
      {
        point: [1, 1],
        name: 'a',
        ports: [
          {
            point: [1, 0],
            edgeIds: [0],
          },
          {
            point: [0, 1],
            edgeIds: [0],
          },
        ],
      },
    ],
    reflexivity: [
      {
        point: [2, 1],
        name: 'a',
        ports: [
          {
            point: [-1, 0],
            edgeIds: [0],
          },
          {
            point: [1, 0],
            edgeIds: [1],
          },
        ],
      },
      {
        point: [2, 3],
        name: 'b',
        ports: [
          {
            point: [1, 0],
            edgeIds: [1],
          },
          {
            point: [-1, 0],
            edgeIds: [0],
          },
        ],
      },
    ],
    transitivity: [
      {
        point: [2, 1],
        name: 'a',
        ports: [
          {
            point: [-1, 0],
            edgeIds: [0],
          },
          {
            point: [1, 0],
            edgeIds: [1],
          },
        ],
      },
      {
        point: [3, 2],
        name: 'b',
        ports: [
          {
            point: [0, -1],
            edgeIds: [1],
          },
          {
            point: [0, 1],
            edgeIds: [2],
          },
        ],
      },
      {
        point: [2, 3],
        name: 'c',
        ports: [
          {
            point: [1, 0],
            edgeIds: [2],
          },
          {
            point: [-1, 0],
            edgeIds: [0],
          },
        ],
      },
    ],
  },
  two: {
    equality: [
      {
        point: [1, 2],
        name: 'a',
        ports: [
          {
            point: [0, -1],
            edgeIds: [0],
          },
          {
            point: [0, 1],
            edgeIds: [1],
          },
        ],
      },
      {
        point: [3, 2],
        ports: [
          {
            point: [0, -1],
            edgeIds: [0, 2],
          },
          {
            point: [0, 1],
            edgeIds: [1, 3],
          },
        ],
      },
      {
        point: [5, 2],
        name: 'b',
        ports: [
          {
            point: [0, -1],
            edgeIds: [2],
          },
          {
            point: [0, 1],
            edgeIds: [3],
          },
        ],
      },
    ],
    addition: [
      {
        point: [1, 2],
        name: 'a',
        ports: [
          {
            point: [0, -1],
            edgeIds: [0],
          },
          {
            point: [0, 1],
            edgeIds: [1],
          },
        ],
      },
      {
        point: [3, 2],
        operator: 1,
        ports: [
          {
            point: [0, -1],
            edgeIds: [0, 2],
          },
          {
            point: [0, 1],
            edgeIds: [1, 3],
          },
        ],
      },
      {
        point: [5, 2],
        name: 'b',
        ports: [
          {
            point: [0, -1],
            edgeIds: [2],
          },
          {
            point: [0, 1],
            edgeIds: [3],
          },
        ],
      },
    ],
  },
  inverse: {
    addition: [
      {
        point: [1, 1],
        name: 'a',
        ports: [
          {
            point: [0, 1],
            edgeIds: [0],
          },
        ],
      },
      {
        point: [2, 2],
        operator: 1,
        ports: [
          {
            point: [-1, 0],
            edgeIds: [0, 1],
          },
          {
            point: [1, 0],
          },
        ],
      },
      {
        point: [1, 3],
        name: 'b',
        ports: [
          {
            point: [0, -1],
            edgeIds: [1],
          },
        ],
      },
    ],
    multiplication: [
      {
        point: [1, 1],
        name: '2',
        value: 2,
        float: {
          value: 2,
        },
        ports: [
          {
            point: [0, 1],
            edgeIds: [0],
          },
        ],
      },
      {
        point: [2, 2],
        operator: 2,
        ports: [
          {
            point: [-1, 0],
            edgeIds: [0, 1],
          },
          {
            point: [1, 0],
          },
        ],
      },
      {
        point: [1, 3],
        ports: [
          {
            point: [0, -1],
            edgeIds: [1],
          },
        ],
      },
    ],
  },
  fraction: {
    addition: [
      {
        point: [1, 1],
        ports: [
          {
            point: [1, 0],
            edgeIds: [0],
          },
        ],
      },
      {
        point: [1, 2],
        name: '3',
        value: {
          float: 3,
        },
        ports: [
          {
            point: [1, 0],
            edgeIds: [1],
          },
        ],
      },
      {
        point: [2, 2],
        operator: 1,
        ports: [
          {
            point: [-1, 0],
            edgeIds: [0, 1],
          },
          {
            point: [1, 0],
            edgeIds: [2],
          },
        ],
      },
      {
        point: [3, 2],
        name: '2',
        value: {
          float: 2,
        },
        ports: [
          {
            point: [-1, 0],
            edgeIds: [2],
          },
        ],
      },
    ],
    multiplication: [
      {
        point: [1, 1],
        ports: [
          {
            point: [1, 0],
            edgeIds: [0],
          },
        ],
      },
      {
        point: [1, 2],
        name: '3',
        value: {
          float: 3,
        },
        ports: [
          {
            point: [1, 0],
            edgeIds: [1],
          },
        ],
      },
      {
        point: [2, 2],
        operator: 2,
        ports: [
          {
            point: [-1, 0],
            edgeIds: [0, 1],
          },
          {
            point: [1, 0],
            edgeIds: [2],
          },
        ],
      },
      {
        point: [3, 2],
        name: '2',
        value: {
          float: 2,
        },
        ports: [
          {
            point: [-1, 0],
            edgeIds: [2],
          },
        ],
      },
    ],
  },
  distributivity: {
    addition: [
      {
        point: [1, 2],
        name: 'a',
        ports: [
          {
            point: [0, -1],
            edgeIds: [0],
          },
          {
            point: [0, 1],
            edgeIds: [2],
          },
        ],
      },
      {
        point: [5, 2],
        name: 'b',
        ports: [
          {
            point: [0, -1],
            edgeIds: [1],
          },
          {
            point: [0, 1],
            edgeIds: [4],
          },
        ],
      },
      {
        point: [3, 2],
        operator: 1,
        ports: [
          {
            point: [0, -1],
            edgeIds: [0, 1],
          },
          {
            point: [0, 1],
            edgeIds: [3],
          },
        ],
      },
      {
        point: [2, 3],
        name: 'c',
        ports: [
          {
            point: [-0.5, 0],
            edgeIds: [9],
          },
          {
            point: [0.5, 0.5],
            edgeIds: [8],
          },
          {
            point: [0.5, -0.5],
            edgeIds: [10],
          },
        ],
      },
      {
        point: [1, 4],
        operator: 2,
        ports: [
          {
            point: [0, -1],
            edgeIds: [2, 9],
          },
          {
            point: [0, 2],
            edgeIds: [11],
          },
        ],
      },
      {
        point: [5, 4],
        operator: 2,
        ports: [
          {
            point: [0, -1],
            edgeIds: [4, 10],
          },
          {
            point: [0, 2],
            edgeIds: [12],
          },
        ],
      },
      {
        point: [3, 4],
        operator: 2,
        ports: [
          {
            point: [0, -1],
            edgeIds: [3, 8],
          },
          {
            point: [0, 1],
            edgeIds: [7],
          },
        ],
      },
      {
        point: [3, 5],
        operator: 1,
        ports: [
          {
            point: [0, -1],
            edgeIds: [7],
          },
          {
            point: [0, 1],
            edgeIds: [11, 12],
          },
        ],
      },
    ],
  },
  example: {
    temperature: [
      {
        point: [1, 1],
        name: '9',
        value: {
          float: 9,
        },
        ports: [
          {
            point: [1, 0],
            edgeIds: [0],
          },
        ],
      },
      {
        point: [3, 1],
        name: 'C',
        ports: [
          {
            point: [-1, 0],
            edgeIds: [1],
          },
        ],
      },
      {
        point: [2, 2],
        operator: 2,
        ports: [
          {
            point: [0, -1],
            edgeIds: [0, 1],
          },
          {
            point: [0, 1],
            edgeIds: [2, 3],
          },
        ],
      },
      {
        point: [1, 3],
        name: '5',
        value: {
          float: 5,
        },
        ports: [
          {
            point: [1, 0],
            edgeIds: [2],
          },
        ],
      },
      {
        point: [3, 3],
        operator: 1,
        ports: [
          {
            point: [-1, 0],
            edgeIds: [3, 4],
          },
          {
            point: [1, 0],
            edgeIds: [5],
          },
        ],
      },
      {
        point: [4, 4],
        name: 'F',
        ports: [
          {
            point: [0, -1],
            edgeIds: [5],
          },
        ],
      },
      {
        point: [2, 4],
        name: '32',
        value: {
          float: 32,
        },
        ports: [
          {
            point: [0, -1],
            edgeIds: [4],
          },
        ],
      },
    ],
    // 2x = 5 + y
    // 2 = 3x + 4y
    system: [
      {
        point: [1, 1],
        name: '3',
        float: 3,
        ports: [
          {
            point: [1, 0],
            edgeIds: [0],
          },
        ],
      },
      {
        point: [3, 1],
        name: 'x',
        ports: [
          {
            point: [-1, 0],
            edgeIds: [1],
          },
          {
            point: [1, 0],
            edgeIds: [3],
          },
        ],
      },
      {
        point: [2, 2],
        operator: 2,
        ports: [
          {
            point: [0, -1],
            edgeIds: [0, 1],
          },
          {
            point: [0, 1],
            edgeIds: [4],
          },
        ],
      },
      {
        point: [5, 1],
        operator: 2,
        ports: [
          {
            point: [-1, 0],
            edgeIds: [3, 5],
          },
          {
            point: [1, 0],
            edgeIds: [6],
          },
        ],
      },
      {
        point: [3, 3],
        operator: 1,
        ports: [
          {
            point: [-1, 0],
            edgeIds: [4, 7],
          },
          {
            point: [1, 0],
            edgeIds: [12],
          },
        ],
      },
      {
        point: [4, 2],
        name: '2',
        float: 2,
        value: {
          float: 2,
        },
        ports: [
          {
            point: [0, 1],
            edgeIds: [12],
          },
          {
            point: [0, -1],
            edgeIds: [5],
          },
        ],
      },
      {
        point: [2, 4],
        operator: 2,
        ports: [
          {
            point: [0, -1],
            edgeIds: [7],
          },
          {
            point: [0, 1],
            edgeIds: [8, 10],
          },
        ],
      },
      {
        point: [5, 5],
        operator: 1,
        ports: [
          {
            point: [1, 0],
            edgeIds: [6],
          },
          {
            point: [-1, 0],
            edgeIds: [9, 11],
          },
        ],
      },
      {
        point: [1, 5],
        name: '4',
        float: 4,
        value: {
          float: 4,
        },
        ports: [
          {
            point: [1, 0],
            edgeIds: [8],
          },
        ],
      },
      {
        point: [3, 5],
        name: 'y',
        ports: [
          {
            point: [-1, 0],
            edgeIds: [10],
          },
          {
            point: [1, 0],
            edgeIds: [9],
          },
        ],
      },
      {
        point: [4, 4],
        name: '5',
        float: 5,
        value: {
          float: 5,
        },
        ports: [
          {
            point: [0, 1],
            edgeIds: [11],
          },
        ],
      },
    ],
    split: [
      // 4 + 1 = 2 + 3
      {
        point: [1, 1],
        name: '4',
        value: 4,
        value: {
          float: 4,
        },
        ports: [
          {
            point: [0, 1],
            edgeIds: [0],
          },
        ],
      },
      {
        point: [3, 1],
        name: '2',
        value: 2,
        value: {
          float: 2,
        },
        ports: [
          {
            point: [0, 1],
            edgeIds: [1],
          },
        ],
      },
      {
        point: [2, 2],
        operator: 1,
        ports: [
          {
            point: [-1, 0],
            edgeIds: [0, 2],
          },
          {
            point: [1, 0],
            edgeIds: [1, 3],
          },
        ],
      },
      {
        point: [1, 3],
        name: '1',
        value: 1,
        value: {
          float: 1,
        },
        ports: [
          {
            point: [0, -1],
            edgeIds: [2],
          },
        ],
      },
      {
        point: [3, 3],
        name: '3',
        value: 3,
        value: {
          float: 3,
        },
        ports: [
          {
            point: [0, -1],
            edgeIds: [3],
          },
        ],
      },
      // 4 - 3 = 2 - 1
      {
        point: [1, 4],
        name: '4',
        value: 4,
        value: {
          float: 4,
        },
        ports: [
          {
            point: [0, 1],
            edgeIds: [4],
          },
        ],
      },
      {
        point: [3, 4],
        name: '2',
        value: 2,
        value: {
          float: 2,
        },
        ports: [
          {
            point: [0, 1],
            edgeIds: [5],
          },
        ],
      },
      {
        point: [2, 5],
        operator: 1,
        ports: [
          {
            point: [-1, 0],
            edgeIds: [4],
          },
          {
            point: [1, 0],
            edgeIds: [8, 5],
          },
        ],
      },
      {
        point: [4, 5],
        operator: 1,
        ports: [
          {
            point: [-1, 0],
            edgeIds: [8, 6],
          },
          {
            point: [1, 0],
            edgeIds: [7],
          },
        ],
      },
      {
        point: [3, 6],
        name: '1',
        value: 1,
        value: {
          float: 1,
        },
        ports: [
          {
            point: [0, -1],
            edgeIds: [6],
          },
        ],
      },
      {
        point: [5, 6],
        name: '3',
        value: 3,
        value: {
          float: 3,
        },
        ports: [
          {
            point: [0, -1],
            edgeIds: [7],
          },
        ],
      },
    ],
  },
  test: {
    node: [
      {
        point: [1, 1],
        operator: 1,
      },
    ],
    port: [
      {
        point: [1, 1],
        operator: 1,
        ports: [
          {
            point: [1, 0],
          },
        ],
      },
    ],
    edge: [
      {
        point: [1, 1],
        value: {
          float: 2,
        },
        ports: [
          {
            point: [1, 0],
            edgeIds: [0],
          },
        ],
      },
      {
        point: [3, 1],
        value: {
          float: 3,
        },
        ports: [
          {
            point: [-1, 0],
            edgeIds: [0],
          },
        ],
      },
    ],
  },
};

export {graphs};
