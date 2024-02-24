//
// This structure is intended to be trivially serializable.
// Objects are referenceable both by id and by pointer.
//

// returns true if changed
function idempotent_add(array, value) {
  let index = -1;
  while (index < array.length && array[index] !== value) {
    index = index + 1;
  }

  if (index === array.length) {
    array.push(value);
    return true;
  } else {
    return false;
  }
}

// returns true if changed
function idempotent_remove(array, value) {
  let index = -1;
  while (index < array.length && array[index] !== value) {
    index = index + 1;
  }

  if (index === array.length) {
    return false;
  } else {
    array.splice(index, 1);
    return true;
  }
}

// Copied from jQuery implementation
// https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
function isEmptyObject(obj) {
  let name;
  for (name in obj) {
    if (obj.hasOwnProperty(name)) {
      return false;
    }
  }
  return true;
}

function add_parent(operation, value) {
  if ('parent' in operation && operation.parent != value) {
    throw new Error('parent exists and does not match value');
  }

  operation.parent = value;

  if (!('references' in value)) {
    value.references = new Map();
  }

  if (!(value.references.has(operation))) {
    value.references.set(operation, new Set());
  }

  value.references.get(operation).add(null);
}

function add_parent_id(env, operation_id, value_id) {
  const operation = env.operations[operation_id];
  const value = env.values[value_id];

  if ('parent_id' in operation && operation.parent_id != value_id) {
    throw new Error('parent_id exists and does not match value_id');
  }

  add_parent(operation, value);

  operation.parent_id = value_id;

  if (!('reference_ids' in value)) {
    value.reference_ids = {};
  }

  if (!(operation_id in value.reference_ids)) {
    value.reference_ids[operation_id] = [];
  }

  idempotent_add(value.reference_ids[operation_id], null);
}

function remove_parent(operation, value) {
  if ('parent' in operation && operation.parent != value) {
    throw new Error('parent exists and does not match value');
  }

  if ('references' in value) {
    if (value.references.has(operation)) {
      value.references.get(operation).delete(null);

      if (value.references.get(operation).size === 0) {
        value.references.delete(operation);
      }
    }

    if (isEmptyObject(value.references)) {
      delete value.references;
    }
  }

  delete operation.parent;
}

function remove_parent_id(env, operation_id, value_id) {
  const operation = env.operations[operation_id];
  const value = env.values[value_id];

  if ('parent_id' in operation && operation.parent_id != value_id) {
    throw new Error('parent_id exists and does not match value_id');
  }

  if ('reference_ids' in value) {
    if (operation_id in value.reference_ids) {
      idempotent_remove(value.reference_ids[operation_id], null);

      if (value.reference_ids[operation_id].length === 0) {
        delete value.reference_ids[operation_id];
      }
    }

    if (isEmptyObject(value.reference_ids)) {
      delete value.reference_ids;
    }
  }

  delete operation.parent_id;

  remove_parent(operation, value);
}

function add_alias(value, alias) {
  if (!('aliases' in value)) {
    value.aliases = new Set([alias]);
  } else {
    value.aliases.add(alias);
  }
}

function add_alias_id(env, value_id, alias_id) {
  const value = env[value_id];
  const alias = env[alias_id];

  add_alias(value, alias);

  if (!('alias_ids' in value)) {
    value.alias_ids = [];
  }

  idempotent_add(value.alias_ids, alias_id);
}

function remove_alias(value, alias) {
  if ('aliases' in value) {
    value.aliases.delete(alias);

    if (value.aliases.size === 0) {
      delete value.aliases;
    }
  }
}

function remove_alias_id(env, value_id, alias_id) {
  const value = env[value_id];
  const alias = env[alias_id];

  if ('alias_ids' in value) {
    idempotent_remove(value.alias_ids, alias_id);

    if (value.alias_ids.length === 0) {
      delete value.alias_ids;
    }
  }

  remove_alias(value, alias);
}

export {
  add_parent, add_parent_id, remove_parent, remove_parent_id,
  add_alias, add_alias_id, remove_alias, remove_alias_id,
};
