const graphs = [
  {
    name: "one",
    nodes: {
      empty: [
      ],
      identity: [
        {
          point: [1, 2],
        }
      ],
      reflexivity: [
        {
          point: [1, 2],
        },
        {
          point: [3, 2],
        }
      ],
      transitivity: [
        {
          id: [1, 2],
        },
        {
          id: [3, 2],
        },
        {
          id: [2, 3],
        },
      ],
    },
    ports: [
      {
        angle: 0
      }
    ],
    edges: [
      {
        source: [1, 2],
        target: [2, 1],
        center: [2, 2],
        radius: 1,
      },
      {
        source: [2, 1],
        target: [3, 2],
        center: [2, 2],
        radius: 1,
      },
      {
        source: [3, 2],
        target: [2, 3],
        center: [2, 2],
        radius: 1,
      },
      {
        source: [2, 3],
        target: [1, 2],
        center: [2, 2],
        radius: 1,
      },
    ]
  },
  {
    name: "two",
    nodes: {
      equality: [
        {
          id: [1, 3],
        },
        {
          id: [7, 3],
        },
        {
          id: [4, 2],
//          name: "=",
//          operator: true,
        },
        {
          id: [4, 4],
//          name: "=",
//          operator: true,
        },
      ],
      addition: [
        {
          id: [1, 3],
        },
        {
          id: [7, 3],
        },
        {
          id: [4, 2],
          name: "+",
          operator: true,
        },
        {
          id: [4, 4],
          name: "+",
          operator: true,
        },
      ],
      multiplication: [
        {
          id: [1, 3],
        },
        {
          id: [7, 3],
        },
        {
          id: [4, 2],
          name: "*",
          operator: true,
        },
        {
          id: [4, 4],
          name: "*",
          operator: true,
        },
      ],
      exponentiation: [
        {
          id: [1, 3],
        },
        {
          id: [7, 3],
        },
        {
          id: [4, 2],
          name: "→",
          operator: true,
        },
        {
          id: [4, 4],
          name: "→",
          operator: true,
        },
      ],
    },
    edges: [
      {
        source: [1, 2],
        target: [2, 1],
        center: [2, 2],
        radius: 1,
      },
      {
        source: [2, 1],
        target: [3, 1],
      },
      {
        source: [3, 1],
        target: [4, 2],
        center: [3, 2],
        radius: 1,
      },
      {
        source: [4, 2],
        target: [5, 1],
        center: [5, 2],
        radius: 1,
      },
      {
        source: [5, 1],
        target: [6, 1],
      },
      {
        source: [6, 1],
        target: [7, 2],
        center: [6, 2],
        radius: 1,
      },
      {
        source: [1, 2],
        target: [1, 3],
      },
      {
        source: [4, 2],
        target: [4, 3],
      },
      {
        source: [7, 2],
        target: [7, 3],
      },
      {
        source: [1, 3],
        target: [1, 4],
      },
      {
        source: [4, 3],
        target: [4, 4],
      },
      {
        source: [7, 3],
        target: [7, 4],
      },
      {
        source: [2, 5],
        target: [3, 5],
      },
      {
        source: [5, 5],
        target: [6, 5],
      },
      {
        source: [2, 5],
        target: [1, 4],
        center: [2, 4],
        radius: 1,
      },
      {
        source: [4, 4],
        target: [3, 5],
        center: [3, 4],
        radius: 1,
      },
      {
        source: [5, 5],
        target: [4, 4],
        center: [5, 4],
        radius: 1,
      },
      {
        source: [7, 4],
        target: [6, 5],
        center: [6, 4],
        radius: 1,
      },
    ]
  },
  {
    name: "three",
    nodes: {
      exponentiation: [
        {
          id: [4, 5],
        },
        {
          id: [5, 4],
        },
        {
          id: [7, 3],
        },
        {
          id: [3, 1],
          name: "↗",
          operator: true,
        },
        {
          id: [4, 3],
          name: "*",
          operator: true,
        },
        {
          id: [7, 5],
          name: "↗",
          operator: true,
        },
        {
          id: [3, 7],
          name: "↘",
          operator: true,
        },
      ],
    },
    edges: [
      {
        source: [1, 2],
        target: [2, 1],
        center: [2, 2],
        radius: 1,
        equation: "(c ^ b) ^ a = c ^ (b * a)",
      },
      {
        source: [2, 1],
        target: [3, 1],
        equation: "(c ^ b) ^ a = c ^ (b * a)",
      },
      {
        source: [3, 1],
        target: [4, 2],
        center: [3, 2],
        radius: 1,
        equation: "log(c, (c ^ b) ^ a) = b * a",
      },
      {
        source: [3, 1],
        target: [6, 1],
        equation: "root((c ^ b) ^ a, (b * a)) = c",
      },
      {
        source: [6, 1],
        target: [7, 2],
        center: [6, 2],
        radius: 1,
        equation: "root((c ^ b) ^ a, (b * a)) = c",
      },
      {
        source: [1, 2],
        target: [1, 3],
        equation: "(c ^ b) ^ a = c ^ (b * a)",
      },
      {
        source: [4, 2],
        target: [4, 3],
        equation: "log(c, (c ^ b) ^ a) = b * a",
      },
      {
        source: [7, 2],
        target: [7, 3],
        equation: "root((c ^ b) ^ a, (b * a)) = c",
      },
      {
        source: [1, 3],
        target: [1, 5],
        equation: "(c ^ b) ^ a = c ^ (b * a)",
      },
      {
        source: [4, 3],
        target: [4, 5],
        equation: "log(c, (c ^ b) ^ a) / b = a",
      },
      {
        source: [7, 3],
        target: [7, 5],
        equation: "c = root(root(c ^ (b * a), a), b)",
      },
      {
        source: [5, 4],
        target: [4, 3],
        center: [5, 3],
        radius: 1,
        equation: "log(c, (c ^ b) ^ a) / a = b",
      },
      {
        source: [5, 4],
        target: [6, 4],
        equation: "b = log(c, root(c ^ (b * a), a))",
      },
      {
        source: [6, 4],
        target: [7, 5],
        center: [6, 5],
        radius: 1,
        equation: "b = log(c, root(c ^ (b * a), a))",
      },
      {
        source: [1, 5],
        target: [1, 6],
        equation: "(c ^ b) ^ a = c ^ (b * a)",
      },
      {
        source: [4, 5],
        target: [4, 6],
        equation: "a = log(c ^ b, c ^ (b * a))",
      },
      {
        source: [7, 5],
        target: [7, 6],
        equation: "c ^ b = root(c ^ (b * a), a)",
      },
      {
        source: [2, 7],
        target: [1, 6],
        center: [2, 6],
        radius: 1,
        equation: "(c ^ b) ^ a = c ^ (b * a)",
      },
      {
        source: [4, 6],
        target: [3, 7],
        center: [3, 6],
        radius: 1,
        equation: "a = log(c ^ b, c ^ (b * a))",
      },
      {
        source: [7, 6],
        target: [6, 7],
        center: [6, 6],
        radius: 1,
        equation: "c ^ b = root(c ^ (b * a), a)",
      },
      {
        source: [2, 7],
        target: [3, 7],
        equation: "(c ^ b) ^ a = c ^ (b * a)",
      },
      {
        source: [3, 7],
        target: [6, 7],
        equation: "c ^ b = root(c ^ (b * a), a)",
      },
    ]
  },
  {
    name: "four",
    nodes: {
      multiplication: [
        {
          id: [1, 3],
        },
        {
          id: [7, 3],
        },
        {
          id: [4, 2],
          name: "+",
          operator: true,
        },
        {
          id: [3, 4],
        },
        {
          id: [1, 5],
          name: "*",
          operator: true,
        },
        {
          id: [4, 5],
          name: "*",
          operator: true,
        },
        {
          id: [7, 5],
          name: "*",
          operator: true,
        },
        {
          id: [4, 6],
          name: "+",
          operator: true,
        },
      ],
    },
    edges: [
      {
        source: [1, 2],
        target: [2, 1],
        center: [2, 2],
        radius: 1,
        equation: "a = (((a * c) + (b * c)) / c) - b",
      },
      {
        source: [2, 1],
        target: [3, 1],
        equation: "a = (((a * c) + (b * c)) / c) - b",
      },
      {
        source: [3, 1],
        target: [4, 2],
        center: [3, 2],
        radius: 1,
        equation: "a = (((a * c) + (b * c)) / c) - b",
      },
      {
        source: [4, 2],
        target: [5, 1],
        center: [5, 2],
        radius: 1,
        equation: "b = (((a * c) + (b * c)) / c) - a",
      },
      {
        source: [5, 1],
        target: [6, 1],
        equation: "b = (((a * c) + (b * c)) / c) - a",
      },
      {
        source: [6, 1],
        target: [7, 2],
        center: [6, 2],
        radius: 1,
        equation: "b = (((a * c) + (b * c)) / c) - a",
      },
      {
        source: [1, 2],
        target: [1, 3],
        equation: "a = (((a * c) + (b * c)) / c) - b",
      },
      {
        source: [4, 2],
        target: [4, 3],
        equation: "a + b = ((a * c) + (b * c)) / c",
      },
      {
        source: [7, 2],
        target: [7, 3],
        equation: "b = (((a * c) + (b * c)) / c) - a",
      },
      {
        source: [1, 3],
        target: [1, 5],
        equation: "a = (((a * c) + (b * c)) / c) - b",
      },
      {
        source: [4, 3],
        target: [4, 5],
        equation: "a + b = ((a * c) + (b * c)) / c",
      },
      {
        source: [7, 3],
        target: [7, 5],
        equation: "b = (((a * c) + (b * c)) / c) - a",
      },
      {
        source: [2, 4],
        target: [3, 4],
        equation: "(((a + b) * c) - (a * c)) / b = c",
      },
      {
        source: [3, 4],
        target: [5, 4],
        equation: "(((a + b) * c) - (b * c)) / a = c",
      },
      {
        source: [5, 4],
        target: [6, 4],
        equation: "(((a + b) * c) - (b * c)) / a = c",
      },
      {
        source: [1, 5],
        target: [2, 4],
        center: [2, 5],
        radius: 1,
        equation: "(((a + b) * c) - (a * c)) / b = c",
      },
      {
        source: [3, 4],
        target: [4, 5],
        center: [3, 5],
        radius: 1,
        equation: "c = ((a * c) + (b * c)) / (a + b)",
      },
      {
        source: [6, 4],
        target: [7, 5],
        center: [6, 5],
        radius: 1,
        equation: "(((a + b) * c) - (b * c)) / a = c",
      },
      {
        source: [1, 5],
        target: [1, 6],
        equation: "((a + b) * c) - (b * c) = (a * c)",
      },
      {
        source: [4, 5],
        target: [4, 6],
        equation: "(a + b) * c = (a * c) + (b * c)",
      },
      {
        source: [7, 5],
        target: [7, 6],
        equation: "((a + b) * c) - (a * c) = (b * c)",
      },
      {
        source: [2, 7],
        target: [1, 6],
        center: [2, 6],
        radius: 1,
        equation: "((a + b) * c) - (b * c) = (a * c)",
      },
      {
        source: [4, 6],
        target: [3, 7],
        center: [3, 6],
        radius: 1,
        equation: "((a + b) * c) - (b * c) = (a * c)",
      },
      {
        source: [5, 7],
        target: [4, 6],
        center: [5, 6],
        radius: 1,
        equation: "((a + b) * c) - (a * c) = (b * c)",
      },
      {
        source: [7, 6],
        target: [6, 7],
        center: [6, 6],
        radius: 1,
        equation: "((a + b) * c) - (a * c) = (b * c)",
      },
      {
        source: [2, 7],
        target: [3, 7],
        equation: "((a + b) * c) - (b * c) = (a * c)",
      },
      {
        source: [5, 7],
        target: [6, 7],
        equation: "((a + b) * c) - (a * c) = (b * c)",
      },
    ]
  },
  {
    name: "inverse",
    factor: 4,
    nodes: {
      equality: [
        {
          id: [1, 3],
//          name: "a",
        },
        {
          id: [3, 1],
//          name: "a",
        },
        {
          id: [2, 1],
//          name: "=",
//          operator: true,
        },
        {
          id: [2, 3],
//          name: "=",
//          operator: true,
        },
      ],
      addition: [
        {
          id: [1, 3],
//          name: "a",
        },
        {
          id: [3, 1],
//          name: "-a",
        },
        {
          id: [2, 1],
          name: "+",
          operator: true,
        },
        {
          id: [2, 3],
          name: "+",
          operator: true,
        },
      ],
      multiplication: [
        {
          id: [1, 3],
//          name: "a",
        },
        {
          id: [3, 1],
//          name: "1/a",
        },
        {
          id: [2, 1],
          name: "*",
          operator: true,
        },
        {
          id: [2, 3],
          name: "*",
          operator: true,
        },
      ],
    },
    edges: [
      {
        source: [1, 3],
        target: [2, 3],
      },
      {
        source: [2, 3],
        target: [2, 1],
        center: [2, 2],
        radius: 1,
      },
      {
        source: [2, 1],
        target: [2, 3],
        center: [2, 2],
        radius: 1,
      },
      {
        source: [2, 1],
        target: [3, 1],
      },
    ]
  },
  {
    name: "unit",
    factor: 4,
    nodes: {
      equality: [
        {
          id: [1, 3],
        },
        {
          id: [2, 3],
//          name: "=",
//          operator: true,
        },
      ],
      addition: [
        {
          id: [1, 3],
//          name: "0",
        },
        {
          id: [2, 3],
          name: "+",
          operator: true,
        },
      ],
      multiplication: [
        {
          id: [1, 3],
//          name: "1",
        },
        {
          id: [2, 3],
          name: "*",
          operator: true,
        },
      ],
    },
    edges: [
      {
        source: [1, 3],
        target: [2, 3],
      },
      {
        source: [2, 3],
        target: [2, 1],
        center: [2, 2],
        radius: 1,
      },
      {
        source: [2, 1],
        target: [2, 3],
        center: [2, 2],
        radius: 1,
      },
    ]
  },
  {
    name: "temperature",
    nodes: {
      example: [
        {
          id: [1, 1],
          value: 9,
        },
        {
          id: [5, 1],
          name: "C",
        },
        {
          id: [3, 2],
          name: "*",
          operator: true,
        },
        {
          id: [3, 3],
          name: "*",
          operator: true,
        },
        {
          id: [1, 4],
          value: 5,
        },
        {
          id: [4, 4],
          name: "+",
          operator: true,
        },
        {
          id: [5, 4],
          name: "F",
        },
        {
          id: [3, 6],
          value: 32,
        },
      ]
    },
    edges: [
      {
        source: [2, 1],
        target: [1, 1],
        equation: "9 = (F - 32) * 5 / C",
      },
      {
        source: [4, 1],
        target: [5, 1],
        equation: "C = (F - 32) * 5 / 9",
      },
      {
        source: [2, 1],
        target: [3, 2],
        center: [2, 2],
        radius: 1,
        equation: "9 = (F - 32) * 5 / C",
      },
      {
        source: [3, 2],
        target: [4, 1],
        center: [4, 2],
        radius: 1,
        equation: "C = (F - 32) * 5 / 9",
      },
      {
        source: [3, 2],
        target: [3, 3],
        equation: "C * 9 = (F - 32) * 5",
      },
      {
        source: [3, 3],
        target: [2, 4],
        center: [2, 3],
        radius: 1,
        equation: "C * 9 / (F - 32) = 5",
      },
      {
        source: [1, 4],
        target: [2, 4],
        equation: "C * 9 / (F - 32) = 5",
      },
      {
        target: [3, 3],
        source: [4, 4],
        center: [4, 3],
        radius: 1,
        equation: "C * 9 / 5 = F - 32",
      },
      {
        source: [5, 4],
        target: [4, 4],
        equation: "(C * 9 / 5) + 32 = F",
      },
      {
        source: [3, 5],
        target: [4, 4],
        center: [4, 5],
        radius: 1,
        equation: "32 = F - (C * 9 / 5)",
      },
      {
        source: [3, 5],
        target: [3, 6],
        equation: "32 = F - (C * 9 / 5)",
      },
    ]
  },
];

export { graphs };
