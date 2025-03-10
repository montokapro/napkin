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
          'e': false,
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
    'operation': {
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
    'temperature': {
      'a': {
        'point': [
          4,
          0,
        ],
        'env': {},
        'memo': {
          'float': 0,
        },
        'float': 0,
      },
      '60e30fa7-2ce7-4b02-b9e0-6c392daca325': {
        'point': [
          1,
          -1,
        ],
        'env': {
          'e6f06a67-28a8-442a-9a52-4578a0554e27': false,
          'a1ed6fd6-571c-488a-8d73-20496283e44a': true,
        },
      },
      'e6f06a67-28a8-442a-9a52-4578a0554e27': {
        'point': [
          0,
          -1,
        ],
        'env': {
          '40cc5d92-c46b-4f68-b829-d1ef86b7190e': false,
          '44ade758-0a8e-44e0-86f1-8a54fc2f6b79': true,
          '60e30fa7-2ce7-4b02-b9e0-6c392daca325': true,
        },
      },
      '44ade758-0a8e-44e0-86f1-8a54fc2f6b79': {
        'point': [
          -1,
          -1,
        ],
        'env': {
          'e6f06a67-28a8-442a-9a52-4578a0554e27': false,
          '53b2913c-cec8-4531-b1ac-63baba183cae': true,
        },
      },
      '40cc5d92-c46b-4f68-b829-d1ef86b7190e': {
        'point': [
          0,
          0,
        ],
        'env': {
          'e6f06a67-28a8-442a-9a52-4578a0554e27': false,
          '91b317db-2719-49dd-a512-6385589752d6': true,
          '543e9d25-3d7a-4507-b725-ca4bc7f03f70': true,
        },
      },
      '53b2913c-cec8-4531-b1ac-63baba183cae': {
        'point': [
          -2,
          -1,
        ],
        'env': {
          '44ade758-0a8e-44e0-86f1-8a54fc2f6b79': true,
        },
        'float': 9,
      },
      'a1ed6fd6-571c-488a-8d73-20496283e44a': {
        'point': [
          2,
          -1,
        ],
        'env': {
          '60e30fa7-2ce7-4b02-b9e0-6c392daca325': true,
        },
        'name': 'C',
      },
      '91b317db-2719-49dd-a512-6385589752d6': {
        'point': [
          -1,
          0,
        ],
        'env': {
          '40cc5d92-c46b-4f68-b829-d1ef86b7190e': false,
          '355dc612-83ae-4dc1-84d0-7641bee387b2': true,
        },
      },
      '355dc612-83ae-4dc1-84d0-7641bee387b2': {
        'point': [
          -2,
          0,
        ],
        'env': {
          '91b317db-2719-49dd-a512-6385589752d6': true,
        },
        'float': 5,
      },
      '543e9d25-3d7a-4507-b725-ca4bc7f03f70': {
        'point': [
          1,
          0,
        ],
        'env': {
          '40cc5d92-c46b-4f68-b829-d1ef86b7190e': false,
          '2ad4348b-90c0-4149-95c2-e1ba32da1f8a': true,
        },
      },
      '8c9d1429-2deb-4642-af02-fe1722c34854': {
        'point': [
          4,
          -1,
        ],
        'env': {},
      },
      '0303a9e3-be01-4ba9-8e68-b0148567ea6d': {
        'point': [
          1,
          1,
        ],
        'env': {
          'e6bfa95a-aa13-41b0-8e99-538acf593066': true,
        },
        'float': 50,
        'name': 'F',
      },
      'e6bfa95a-aa13-41b0-8e99-538acf593066': {
        'point': [
          2,
          1,
        ],
        'env': {
          '0303a9e3-be01-4ba9-8e68-b0148567ea6d': true,
          '2ad4348b-90c0-4149-95c2-e1ba32da1f8a': false,
        },
      },
      '2ad4348b-90c0-4149-95c2-e1ba32da1f8a': {
        'point': [
          2,
          0,
        ],
        'env': {
          '543e9d25-3d7a-4507-b725-ca4bc7f03f70': true,
          'e6bfa95a-aa13-41b0-8e99-538acf593066': false,
          'ee2b049d-87b1-4fee-a479-8510c0111bd7': true,
        },
      },
      'ee2b049d-87b1-4fee-a479-8510c0111bd7': {
        'point': [
          3,
          0,
        ],
        'env': {
          '2ad4348b-90c0-4149-95c2-e1ba32da1f8a': true,
        },
        'float': 32,
      },
    },
  },
  property: {
    'distributive-1': {
      '8b1b9ca4-8f2d-495f-9c4b-b576323d0fed': {
        'point': [
          0,
          0,
        ],
        'env': {
          'ee3f0d42-9c09-49ad-b056-5e4dc271ee78': true,
        },
        'name': 'a',
      },
      'ee3f0d42-9c09-49ad-b056-5e4dc271ee78': {
        'point': [
          -1,
          0,
        ],
        'env': {
          '8b1b9ca4-8f2d-495f-9c4b-b576323d0fed': true,
          'a3bcd6ce-600f-4a16-a61f-e03fa3c23be0': false,
          '5f0639f1-a22e-4722-a2d5-8263dbafe832': false,
          'f23e95da-0690-4468-b181-9afeb99b8517': false,
        },
      },
      '5f0639f1-a22e-4722-a2d5-8263dbafe832': {
        'point': [
          -3,
          2,
        ],
        'env': {
          'ee3f0d42-9c09-49ad-b056-5e4dc271ee78': true,
          'b1ab52a7-d53d-4e41-b5c8-956b8bd13d53': false,
          '8b410b7d-2bbe-40f7-833c-7afabeaf1945': true,
        },
      },
      'a3bcd6ce-600f-4a16-a61f-e03fa3c23be0': {
        'point': [
          -1,
          2,
        ],
        'env': {
          'ee3f0d42-9c09-49ad-b056-5e4dc271ee78': true,
          'a3c269ad-528e-43dc-b28b-50ab348adbc3': false,
          '807287e7-4df0-4833-98e7-9ee44b5265d1': true,
        },
      },
      'f23e95da-0690-4468-b181-9afeb99b8517': {
        'point': [
          1,
          2,
        ],
        'env': {
          'ee3f0d42-9c09-49ad-b056-5e4dc271ee78': true,
          '2b586d9f-2b76-41c1-9f8a-ed1bffc0e2e6': false,
          '535685fc-c237-4b60-8c7e-dca86f1a3f0b': true,
        },
      },
      '2b586d9f-2b76-41c1-9f8a-ed1bffc0e2e6': {
        'point': [
          2,
          2,
        ],
        'env': {
          'f23e95da-0690-4468-b181-9afeb99b8517': false,
          '6354fd4a-f9ec-425a-b409-a8c382d5b38c': true,
        },
      },
      'a3c269ad-528e-43dc-b28b-50ab348adbc3': {
        'point': [
          0,
          2,
        ],
        'env': {
          'a3bcd6ce-600f-4a16-a61f-e03fa3c23be0': false,
          '100a5edb-0642-4d15-9bc4-9d1f82b82219': true,
        },
      },
      'b1ab52a7-d53d-4e41-b5c8-956b8bd13d53': {
        'point': [
          -2,
          2,
        ],
        'env': {
          '5f0639f1-a22e-4722-a2d5-8263dbafe832': false,
          'a7c6f256-99d7-4827-b989-c4668ade45f9': true,
        },
      },
      '8b410b7d-2bbe-40f7-833c-7afabeaf1945': {
        'point': [
          -5,
          4,
        ],
        'env': {
          '5f0639f1-a22e-4722-a2d5-8263dbafe832': false,
          '807287e7-4df0-4833-98e7-9ee44b5265d1': true,
        },
        'name': 'b',
      },
      '807287e7-4df0-4833-98e7-9ee44b5265d1': {
        'point': [
          -3,
          4,
        ],
        'env': {
          'a3bcd6ce-600f-4a16-a61f-e03fa3c23be0': false,
          '535685fc-c237-4b60-8c7e-dca86f1a3f0b': true,
          '8b410b7d-2bbe-40f7-833c-7afabeaf1945': true,
        },
      },
      '535685fc-c237-4b60-8c7e-dca86f1a3f0b': {
        'point': [
          -1,
          4,
        ],
        'env': {
          'f23e95da-0690-4468-b181-9afeb99b8517': false,
          '807287e7-4df0-4833-98e7-9ee44b5265d1': true,
        },
        'name': 'c',
      },
      'a7c6f256-99d7-4827-b989-c4668ade45f9': {
        'point': [
          0,
          4,
        ],
        'env': {
          'b1ab52a7-d53d-4e41-b5c8-956b8bd13d53': false,
          '100a5edb-0642-4d15-9bc4-9d1f82b82219': true,
        },
      },
      '100a5edb-0642-4d15-9bc4-9d1f82b82219': {
        'point': [
          2,
          4,
        ],
        'env': {
          'a3c269ad-528e-43dc-b28b-50ab348adbc3': false,
          'a7c6f256-99d7-4827-b989-c4668ade45f9': true,
          '6354fd4a-f9ec-425a-b409-a8c382d5b38c': true,
        },
      },
      '6354fd4a-f9ec-425a-b409-a8c382d5b38c': {
        'point': [
          4,
          4,
        ],
        'env': {
          '2b586d9f-2b76-41c1-9f8a-ed1bffc0e2e6': false,
          '100a5edb-0642-4d15-9bc4-9d1f82b82219': true,
        },
      },
    },
    'distributive-2': {
      '8b1b9ca4-8f2d-495f-9c4b-b576323d0fed': {
        'point': [
          -2,
          2,
        ],
        'env': {
          'ee3f0d42-9c09-49ad-b056-5e4dc271ee78': true,
        },
        'name': 'a',
      },
      'ee3f0d42-9c09-49ad-b056-5e4dc271ee78': {
        'point': [
          -2,
          1,
        ],
        'env': {
          '8b1b9ca4-8f2d-495f-9c4b-b576323d0fed': true,
          'a3bcd6ce-600f-4a16-a61f-e03fa3c23be0': false,
          '5f0639f1-a22e-4722-a2d5-8263dbafe832': false,
          'f23e95da-0690-4468-b181-9afeb99b8517': false,
        },
      },
      '5f0639f1-a22e-4722-a2d5-8263dbafe832': {
        'point': [
          -1,
          2,
        ],
        'env': {
          'ee3f0d42-9c09-49ad-b056-5e4dc271ee78': true,
          'b1ab52a7-d53d-4e41-b5c8-956b8bd13d53': false,
          '8b410b7d-2bbe-40f7-833c-7afabeaf1945': true,
        },
      },
      'a3bcd6ce-600f-4a16-a61f-e03fa3c23be0': {
        'point': [
          0,
          2,
        ],
        'env': {
          'ee3f0d42-9c09-49ad-b056-5e4dc271ee78': true,
          'a3c269ad-528e-43dc-b28b-50ab348adbc3': false,
          '807287e7-4df0-4833-98e7-9ee44b5265d1': true,
        },
      },
      'f23e95da-0690-4468-b181-9afeb99b8517': {
        'point': [
          1,
          2,
        ],
        'env': {
          'ee3f0d42-9c09-49ad-b056-5e4dc271ee78': true,
          '2b586d9f-2b76-41c1-9f8a-ed1bffc0e2e6': false,
          '535685fc-c237-4b60-8c7e-dca86f1a3f0b': true,
        },
      },
      '2b586d9f-2b76-41c1-9f8a-ed1bffc0e2e6': {
        'point': [
          1,
          3,
        ],
        'env': {
          'f23e95da-0690-4468-b181-9afeb99b8517': false,
          '6354fd4a-f9ec-425a-b409-a8c382d5b38c': true,
        },
      },
      'a3c269ad-528e-43dc-b28b-50ab348adbc3': {
        'point': [
          0,
          3,
        ],
        'env': {
          'a3bcd6ce-600f-4a16-a61f-e03fa3c23be0': false,
          '100a5edb-0642-4d15-9bc4-9d1f82b82219': true,
        },
      },
      'b1ab52a7-d53d-4e41-b5c8-956b8bd13d53': {
        'point': [
          -1,
          3,
        ],
        'env': {
          '5f0639f1-a22e-4722-a2d5-8263dbafe832': false,
          'a7c6f256-99d7-4827-b989-c4668ade45f9': true,
        },
      },
      '8b410b7d-2bbe-40f7-833c-7afabeaf1945': {
        'point': [
          -1,
          1,
        ],
        'env': {
          '5f0639f1-a22e-4722-a2d5-8263dbafe832': false,
          '807287e7-4df0-4833-98e7-9ee44b5265d1': true,
        },
        'name': 'b',
      },
      '807287e7-4df0-4833-98e7-9ee44b5265d1': {
        'point': [
          0,
          1,
        ],
        'env': {
          'a3bcd6ce-600f-4a16-a61f-e03fa3c23be0': false,
          '535685fc-c237-4b60-8c7e-dca86f1a3f0b': true,
          '8b410b7d-2bbe-40f7-833c-7afabeaf1945': true,
        },
      },
      '535685fc-c237-4b60-8c7e-dca86f1a3f0b': {
        'point': [
          1,
          1,
        ],
        'env': {
          'f23e95da-0690-4468-b181-9afeb99b8517': false,
          '807287e7-4df0-4833-98e7-9ee44b5265d1': true,
        },
        'name': 'c',
      },
      'a7c6f256-99d7-4827-b989-c4668ade45f9': {
        'point': [
          -1,
          4,
        ],
        'env': {
          'b1ab52a7-d53d-4e41-b5c8-956b8bd13d53': false,
          '100a5edb-0642-4d15-9bc4-9d1f82b82219': true,
        },
      },
      '100a5edb-0642-4d15-9bc4-9d1f82b82219': {
        'point': [
          0,
          4,
        ],
        'env': {
          'a3c269ad-528e-43dc-b28b-50ab348adbc3': false,
          'a7c6f256-99d7-4827-b989-c4668ade45f9': true,
          '6354fd4a-f9ec-425a-b409-a8c382d5b38c': true,
        },
      },
      '6354fd4a-f9ec-425a-b409-a8c382d5b38c': {
        'point': [
          1,
          4,
        ],
        'env': {
          '2b586d9f-2b76-41c1-9f8a-ed1bffc0e2e6': false,
          '100a5edb-0642-4d15-9bc4-9d1f82b82219': true,
        },
      },
    },
    'distributive-exp': {
      '8b1b9ca4-8f2d-495f-9c4b-b576323d0fed': {
        'point': [
          -2,
          2,
        ],
        'env': {
          'ee3f0d42-9c09-49ad-b056-5e4dc271ee78': true,
        },
        'name': 'a',
      },
      'ee3f0d42-9c09-49ad-b056-5e4dc271ee78': {
        'point': [
          -2,
          1,
        ],
        'env': {
          '8b1b9ca4-8f2d-495f-9c4b-b576323d0fed': true,
          'a3bcd6ce-600f-4a16-a61f-e03fa3c23be0': false,
          '5f0639f1-a22e-4722-a2d5-8263dbafe832': false,
          'f23e95da-0690-4468-b181-9afeb99b8517': false,
        },
      },
      '5f0639f1-a22e-4722-a2d5-8263dbafe832': {
        'point': [
          -1,
          2,
        ],
        'env': {
          'ee3f0d42-9c09-49ad-b056-5e4dc271ee78': true,
          'b1ab52a7-d53d-4e41-b5c8-956b8bd13d53': false,
          '8b410b7d-2bbe-40f7-833c-7afabeaf1945': true,
        },
      },
      'a3bcd6ce-600f-4a16-a61f-e03fa3c23be0': {
        'point': [
          0,
          2,
        ],
        'env': {
          'ee3f0d42-9c09-49ad-b056-5e4dc271ee78': true,
          'a3c269ad-528e-43dc-b28b-50ab348adbc3': false,
          '807287e7-4df0-4833-98e7-9ee44b5265d1': true,
        },
      },
      'f23e95da-0690-4468-b181-9afeb99b8517': {
        'point': [
          1,
          2,
        ],
        'env': {
          'ee3f0d42-9c09-49ad-b056-5e4dc271ee78': true,
          '2b586d9f-2b76-41c1-9f8a-ed1bffc0e2e6': false,
          '535685fc-c237-4b60-8c7e-dca86f1a3f0b': true,
        },
      },
      '2b586d9f-2b76-41c1-9f8a-ed1bffc0e2e6': {
        'point': [
          1,
          3,
        ],
        'env': {
          'f23e95da-0690-4468-b181-9afeb99b8517': false,
          '6354fd4a-f9ec-425a-b409-a8c382d5b38c': true,
        },
      },
      'a3c269ad-528e-43dc-b28b-50ab348adbc3': {
        'point': [
          0,
          3,
        ],
        'env': {
          'a3bcd6ce-600f-4a16-a61f-e03fa3c23be0': false,
          '100a5edb-0642-4d15-9bc4-9d1f82b82219': true,
        },
      },
      'b1ab52a7-d53d-4e41-b5c8-956b8bd13d53': {
        'point': [
          -1,
          3,
        ],
        'env': {
          '5f0639f1-a22e-4722-a2d5-8263dbafe832': false,
          'a7c6f256-99d7-4827-b989-c4668ade45f9': true,
        },
      },
      '8b410b7d-2bbe-40f7-833c-7afabeaf1945': {
        'point': [
          -1,
          1,
        ],
        'env': {
          '5f0639f1-a22e-4722-a2d5-8263dbafe832': false,
          '807287e7-4df0-4833-98e7-9ee44b5265d1': true,
          '10b803a0-f14e-4f09-b50e-c181fa01ad0b': false,
        },
      },
      '807287e7-4df0-4833-98e7-9ee44b5265d1': {
        'point': [
          0,
          1,
        ],
        'env': {
          'a3bcd6ce-600f-4a16-a61f-e03fa3c23be0': false,
          '535685fc-c237-4b60-8c7e-dca86f1a3f0b': true,
          '8b410b7d-2bbe-40f7-833c-7afabeaf1945': true,
          'a76b746e-802d-4ad1-bca9-56ff1b395c67': false,
        },
      },
      '535685fc-c237-4b60-8c7e-dca86f1a3f0b': {
        'point': [
          1,
          1,
        ],
        'env': {
          'f23e95da-0690-4468-b181-9afeb99b8517': false,
          '807287e7-4df0-4833-98e7-9ee44b5265d1': true,
          '20e49a7b-1bf9-47c3-936f-2d056a3260e6': false,
        },
      },
      'a7c6f256-99d7-4827-b989-c4668ade45f9': {
        'point': [
          -1,
          4,
        ],
        'env': {
          'b1ab52a7-d53d-4e41-b5c8-956b8bd13d53': false,
          '100a5edb-0642-4d15-9bc4-9d1f82b82219': true,
        },
      },
      '100a5edb-0642-4d15-9bc4-9d1f82b82219': {
        'point': [
          0,
          4,
        ],
        'env': {
          'a3c269ad-528e-43dc-b28b-50ab348adbc3': false,
          'a7c6f256-99d7-4827-b989-c4668ade45f9': true,
          '6354fd4a-f9ec-425a-b409-a8c382d5b38c': true,
        },
      },
      '6354fd4a-f9ec-425a-b409-a8c382d5b38c': {
        'point': [
          1,
          4,
        ],
        'env': {
          '2b586d9f-2b76-41c1-9f8a-ed1bffc0e2e6': false,
          '100a5edb-0642-4d15-9bc4-9d1f82b82219': true,
        },
      },
      '10b803a0-f14e-4f09-b50e-c181fa01ad0b': {
        'point': [
          -1,
          0,
        ],
        'env': {
          '8b410b7d-2bbe-40f7-833c-7afabeaf1945': false,
          '83d8f02c-5d70-47ae-96d3-efa477c4127a': true,
        },
      },
      '20e49a7b-1bf9-47c3-936f-2d056a3260e6': {
        'point': [
          1,
          0,
        ],
        'env': {
          '535685fc-c237-4b60-8c7e-dca86f1a3f0b': false,
          'f43e1714-3424-4481-b5a5-4fdd2f1d4e2e': true,
        },
      },
      '83d8f02c-5d70-47ae-96d3-efa477c4127a': {
        'point': [
          -1,
          -1,
        ],
        'env': {
          '10b803a0-f14e-4f09-b50e-c181fa01ad0b': false,
          '291f304c-a42a-440f-957b-3c4615891981': true,
        },
      },
      'f43e1714-3424-4481-b5a5-4fdd2f1d4e2e': {
        'point': [
          1,
          -1,
        ],
        'env': {
          '20e49a7b-1bf9-47c3-936f-2d056a3260e6': false,
          '652c90d5-a29f-4172-8af8-0a737bc2816c': true,
        },
      },
      '291f304c-a42a-440f-957b-3c4615891981': {
        'point': [
          -1,
          -2,
        ],
        'env': {
          '83d8f02c-5d70-47ae-96d3-efa477c4127a': true,
        },
        'name': 'b',
      },
      '652c90d5-a29f-4172-8af8-0a737bc2816c': {
        'point': [
          1,
          -2,
        ],
        'env': {
          'f43e1714-3424-4481-b5a5-4fdd2f1d4e2e': true,
        },
        'name': 'c',
      },
      'a76b746e-802d-4ad1-bca9-56ff1b395c67': {
        'point': [
          0,
          0,
        ],
        'env': {
          'a7e88eab-9177-460a-bd36-ab246f24e3de': true,
          '807287e7-4df0-4833-98e7-9ee44b5265d1': false,
        },
      },
      'a7e88eab-9177-460a-bd36-ab246f24e3de': {
        'point': [
          -0,
          -1,
        ],
        'env': {
          '3681c63e-6d21-4d59-9182-4ca0427b05e0': true,
          'a76b746e-802d-4ad1-bca9-56ff1b395c67': false,
        },
      },
      '3681c63e-6d21-4d59-9182-4ca0427b05e0': {
        'point': [
          -0,
          -2,
        ],
        'env': {
          'a7e88eab-9177-460a-bd36-ab246f24e3de': true,
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
