import {add_parent, add_parent_id, remove_parent, remove_parent_id} from '../struct.js';

import assert from 'assert';

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
