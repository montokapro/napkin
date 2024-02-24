import {
  add_parent, add_parent_id, remove_parent, remove_parent_id,
  add_alias, add_alias_id, remove_alias, remove_alias_id,
} from '../struct.js';

import assert from 'assert';

describe('#parent', () => {
  describe('#add_parent', () => {
    it('add', () => {
      const operation = {};
      const value = {};

      add_parent(operation, value);

      assert.equal(operation.parent, value);
      assert.ok(value.references.get(operation).has(null));
    });

    it('idempotent', () => {
      const operation = {};
      const value = {};

      add_parent(operation, value);
      add_parent(operation, value);

      assert.equal(operation.parent, value);
      assert.ok(value.references.get(operation).has(null));
    });

    it('error', () => {
      const operation = {};
      const value = {};
      const other = {};

      add_parent(operation, value);

      assert.throws(() => {
        add_parent(operation, other);
      });
    });
  });

  describe('#add_parent_id', () => {
    it('add', () => {
      const env = {
        operations: [
          {},
        ],
        values: [
          {},
        ],
      };

      add_parent_id(env, 0, 0);

      assert.equal(env.operations[0].parent_id, 0);
      assert.equal(env.values[0].reference_ids[0][0], null);
    });

    it('idempotent', () => {
      const env = {
        operations: [
          {},
        ],
        values: [
          {},
        ],
      };

      add_parent_id(env, 0, 0);
      add_parent_id(env, 0, 0);

      assert.equal(env.operations[0].parent_id, 0);
      assert.equal(env.values[0].reference_ids[0][0], null);
    });

    it('error', () => {
      const env = {
        operations: [
          {},
        ],
        values: [
          {},
          {},
        ],
      };

      add_parent_id(env, 0, 0);

      assert.throws(() => {
        add_parent_id(env, 0, 1);
      });
    });
  });

  describe('#remove_parent', () => {
    it('remove', () => {
      const operation = {};
      const value = {};

      add_parent(operation, value);
      remove_parent(operation, value);

      assert.equal(operation.parent, undefined);
      assert.equal(value.references, undefined);
    });

    it('idempotent', () => {
      const operation = {};
      const value = {};

      add_parent(operation, value);
      remove_parent(operation, value);
      remove_parent(operation, value);

      assert.equal(operation.parent, undefined);
      assert.equal(value.references, undefined);
    });

    it('error', () => {
      const operation = {};
      const value = {};
      const other = {};

      add_parent(operation, value);

      assert.throws(() => {
        remove_parent(operation, other);
      });
    });
  });

  describe('#remove_parent_id', () => {
    it('remove', () => {
      const env = {
        operations: [
          {},
        ],
        values: [
          {},
        ],
      };

      add_parent_id(env, 0, 0);
      remove_parent_id(env, 0, 0);

      assert.equal(env.operations[0].parent_id, undefined);
      assert.equal(env.values[0].reference_ids, undefined);
    });

    it('idempotent', () => {
      const env = {
        operations: [
          {},
        ],
        values: [
          {},
        ],
      };

      add_parent_id(env, 0, 0);
      remove_parent_id(env, 0, 0);
      remove_parent_id(env, 0, 0);

      assert.equal(env.operations[0].parent_id, undefined);
      assert.equal(env.values[0].reference_ids, undefined);
    });

    it('error', () => {
      const env = {
        operations: [
          {},
        ],
        values: [
          {},
          {},
        ],
      };

      add_parent_id(env, 0, 0);

      assert.throws(() => {
        remove_parent_id(env, 0, 1);
      });
    });
  });
});

describe('#alias', () => {
  describe('#add_alias', () => {
    it('add', () => {
      const value = {};
      const alias = {};

      add_alias(value, alias);

      assert.ok(value.aliases.has(alias));
    });

    it('idempotent', () => {
      const value = {};
      const alias = {};

      add_alias(value, alias);

      assert.ok(value.aliases.has(alias));
    });
  });

  describe('#add_alias_id', () => {
    it('add', () => {
      const values = [
        {},
        {},
      ];

      add_alias_id(values, 0, 1);

      assert.equal(values[0].alias_ids[0], 1);
    });

    it('idempotent', () => {
      const values = [
        {},
        {},
      ];

      add_alias_id(values, 0, 1);
      add_alias_id(values, 0, 1);

      assert.equal(values[0].alias_ids[0], 1);
    });
  });

  describe('#remove_alias', () => {
    it('remove', () => {
      const value = {};
      const alias = {};

      add_alias(value, alias);
      remove_alias(value, alias);

      assert.equal(value.aliases, undefined);
    });

    it('idempotent', () => {
      const value = {};
      const alias = {};

      add_alias(value, alias);
      remove_alias(value, alias);

      assert.equal(value.aliases, undefined);
    });
  });

  describe('#remove_alias_id', () => {
    it('remove', () => {
      const values = [
        {},
        {},
      ];

      add_alias_id(values, 0, 1);
      remove_alias_id(values, 0, 1);

      assert.equal(values[0].alias_ids, undefined);
    });

    it('idempotent', () => {
      const values = [
        {},
        {},
      ];

      add_alias_id(values, 0, 1);
      remove_alias_id(values, 0, 1);
      remove_alias_id(values, 0, 1);

      assert.equal(values[0].alias_ids, undefined);
    });
  });
});
