import {
  addToSet, addToArray, addToEnv,
  removeFromSet, removeFromArray, removeFromEnv,

  addAliasToSet, addAliasToArray, addAliasToEnv,
  removeAliasFromSet, removeAliasFromArray, removeAliasFromEnv,

  addParentToSet, addParentToArray, addParentToEnv,
  removeParentFromSet, removeParentFromArray, removeParentFromEnv,

  addChildToSet, addChildToArray, addChildToEnv,
  removeChildFromSet, removeChildFromArray, removeChildFromEnv,

  repair,
  deleteObjects,

  iterableMap,
  objectIterable,
  objectsByIdsIterable,
} from '../struct.js';

import assert from 'assert';

describe('alias', () => {
  describe('#addAliasToSet', () => {
    it('add', () => {
      const value = {};
      const alias = {};

      addAliasToSet(value, alias);

      assert.ok(value.aliases.has(alias));
    });

    it('idempotent', () => {
      const value = {};
      const alias = {};

      addAliasToSet(value, alias);

      assert.ok(value.aliases.has(alias));
    });
  });

  describe('#addAliasToArray', () => {
    it('add', () => {
      const env = [
        {},
        {},
      ];

      addAliasToArray(env[0], 1);

      assert.equal(env[0].aliasIds[0], 1);
    });

    it('idempotent', () => {
      const env = [
        {},
        {},
      ];

      addAliasToArray(env[0], 1);

      assert.equal(env[0].aliasIds[0], 1);
    });
  });

  describe('#removeAliasFromSet', () => {
    it('remove', () => {
      const value = {};
      const alias = {};

      addAliasToSet(value, alias);
      removeAliasFromSet(value, alias);

      assert.equal(value.aliases, undefined);
    });

    it('idempotent', () => {
      const value = {};
      const alias = {};

      addAliasToSet(value, alias);
      removeAliasFromSet(value, alias);

      assert.equal(value.aliases, undefined);
    });
  });

  describe('#removeAliasFromArray', () => {
    it('remove', () => {
      const env = [
        {},
        {},
      ];

      addAliasToArray(env[0], 1);
      removeAliasFromArray(env[0], 1);

      assert.equal(env[0].aliasIds, undefined);
    });

    it('idempotent', () => {
      const env = [
        {},
        {},
      ];

      addAliasToArray(env[0], 1);
      removeAliasFromArray(env[0], 1);
      removeAliasFromArray(env[0], 1);

      assert.equal(env[0].aliasIds, undefined);
    });
  });
});

describe('#repair', () => {
  it('repairs', () => {
    const env = [
      {
        aliasIds: [1],
      },
      {
        parentIds: [2],
      },
      {
        aliasIds: [0, 1],
        childIds: [3],
      },
      {
        parentIds: [1, 2],
        childIds: [2, 0],
      },
    ];

    repair(env);
    deleteObjects(env);

    const expected = [
      {
        aliasIds: [1, 2],
        parentIds: [3],
      },
      {
        aliasIds: [0, 2],
        childIds: [3],
        parentIds: [2],
      },
      {
        aliasIds: [0, 1],
        parentIds: [3],
        childIds: [3, 1],
      },
      {
        parentIds: [1, 2],
        childIds: [2, 0],
      },
    ];

    assert.deepEqual(env, expected);
  });
});

describe('#iterableMap', () => {
  it('maps lazily', () => {
    const resultThenError = function() {
      let complete = false;

      return {
        [Symbol.iterator]: function() {
          return {
            next: () => {
              if (complete) {
                throw new Error('You get one phone call');
              } else {
                complete = true;
                return {value: 0, done: false};
              }
            },
          };
        },
      };
    };

    const iterator = iterableMap(resultThenError(), (i) => i + 1);

    assert.equal(iterator[Symbol.iterator]().next().value, 1);
  });
});

describe('#objectIterable', () => {
  it('iterates when present', () => {
    const object = {a: [1, 2, 3]};
    const iterator = objectIterable(object, 'a');

    assert.deepEqual([...iterator], [1, 2, 3]);
  });

  it('iterates when missing', () => {
    const object = {};
    const iterator = objectIterable(object, 'a');

    assert.deepEqual([...iterator], []);
  });
});

describe('#objectsByIdsIterable', () => {
  it('iterates', () => {
    const env = [
      {
        ids: [2, 1],
      },
      {
        ids: [2],
      },
      {
        foo: 'bar',
      },
    ];

    assert.deepEqual([...objectsByIdsIterable(env)(env[0], 'ids')], [env[2], env[1]]);
  });
});
