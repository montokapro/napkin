import {
  add_to_set, add_to_array, add_to_env,
  remove_from_set, remove_from_array, remove_from_env,

  add_alias_to_set, add_alias_to_array, add_alias_to_env,
  remove_alias_from_set, remove_alias_from_array, remove_alias_from_env,

  add_parent_to_set, add_parent_to_array, add_parent_to_env,
  remove_parent_from_set, remove_parent_from_array, remove_parent_from_env,

  add_child_to_set, add_child_to_array, add_child_to_env,
  remove_child_from_set, remove_child_from_array, remove_child_from_env,

  repair,
  delete_objects,
} from '../struct.js';

import assert from 'assert';

describe('alias', () => {
  describe('#add_alias_to_set', () => {
    it('add', () => {
      const value = {};
      const alias = {};

      add_alias_to_set(value, alias);

      assert.ok(value.aliases.has(alias));
    });

    it('idempotent', () => {
      const value = {};
      const alias = {};

      add_alias_to_set(value, alias);

      assert.ok(value.aliases.has(alias));
    });
  });

  describe('#add_alias_to_array', () => {
    it('add', () => {
      const env = [
        {},
        {},
      ];

      add_alias_to_array(env[0], 1);

      assert.equal(env[0].alias_ids[0], 1);
    });

    it('idempotent', () => {
      const env = [
        {},
        {},
      ];

      add_alias_to_array(env[0], 1);

      assert.equal(env[0].alias_ids[0], 1);
    });
  });

  describe('#remove_alias_from_set', () => {
    it('remove', () => {
      const value = {};
      const alias = {};

      add_alias_to_set(value, alias);
      remove_alias_from_set(value, alias);

      assert.equal(value.aliases, undefined);
    });

    it('idempotent', () => {
      const value = {};
      const alias = {};

      add_alias_to_set(value, alias);
      remove_alias_from_set(value, alias);

      assert.equal(value.aliases, undefined);
    });
  });

  describe('#remove_alias_from_array', () => {
    it('remove', () => {
      const env = [
        {},
        {},
      ];

      add_alias_to_array(env[0], 1);
      remove_alias_from_array(env[0], 1);

      assert.equal(env[0].alias_ids, undefined);
    });

    it('idempotent', () => {
      const env = [
        {},
        {},
      ];

      add_alias_to_array(env[0], 1);
      remove_alias_from_array(env[0], 1);
      remove_alias_from_array(env[0], 1);

      assert.equal(env[0].alias_ids, undefined);
    });
  });
});

describe('#repair', () => {
  it('repairs', () => {
    const env = [
      {
        alias_ids: [1],
      },
      {
        parent_ids: [2],
      },
      {
        alias_ids: [0, 1],
        child_ids: [3],
      },
      {
        parent_ids: [1, 2],
        child_ids: [2, 0],
      },
    ];

    repair(env);
    delete_objects(env);

    const expected = [
      {
        alias_ids: [1, 2],
        parent_ids: [3],
      },
      {
        alias_ids: [0, 2],
        child_ids: [3],
        parent_ids: [2],
      },
      {
        alias_ids: [0, 1],
        parent_ids: [3],
        child_ids: [3, 1],
      },
      {
        parent_ids: [1, 2],
        child_ids: [2, 0],
      },
    ];

    assert.deepEqual(env, expected);
  });
});
