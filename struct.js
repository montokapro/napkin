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

// Efficient data structure, hard to serialize
const add_to_set = function(name) {
  return function(source, target) {
    if (!(name in source)) {
      source[name] = new Set([target]);
    } else {
      source[name].add(target);
    }
  };
};

// Inefficient data structure, easy to serialize
const add_to_array = function(name) {
  return function(source, target) {
    if (!(name in source)) {
      source[name] = [];
    }

    idempotent_add(source[name], target);
  };
};

// Efficient data structure, hard to serialize
const remove_from_set = function(name) {
  return function(source, target) {
    if (name in source) {
      source[name].delete(target);

      if (source[name].size === 0) {
        delete source[name];
      }
    }
  };
};

// Inefficient data structure, easy to serialize
const remove_from_array = function(name) {
  return function(source, target) {
    if (name in source) {
      idempotent_remove(source[name], target);

      if (source[name].length === 0) {
        delete source[name];
      }
    }
  };
};

// Include both data structures
const add_to_env = function(set_name, array_name) {
  const add_set = add_to_set(set_name);
  const add_array = add_to_array(array_name);

  return function(env, source_id, target_id) {
    const source = env[source_id];

    add_set(source, target);
    add_array(source, target_id);
  };
};

// Include both data structures
const remove_from_env = function(set_name, array_name) {
  const remove_set = remove_from_set(set_name);
  const remove_array = remove_from_array(array_name);

  return function(env, source_id, target_id) {
    const source = env[source_id];

    remove_array(source, target);
    remove_set(source, target);
  };
};

const add_alias_to_set = add_to_set('aliases');
const add_alias_to_array = add_to_array('alias_ids');
const add_alias_to_env = add_to_env('aliases', 'alias_ids');
const remove_alias_from_set = remove_from_set('aliases');
const remove_alias_from_array = remove_from_array('alias_ids');
const remove_alias_from_env = remove_from_env('aliases', 'alias_ids');

const add_parent_to_set = add_to_set('parents');
const add_parent_to_array = add_to_array('parent_ids');
const add_parent_to_env = add_to_env('parents', 'parent_ids');
const remove_parent_from_set = remove_from_set('parents');
const remove_parent_from_array = remove_from_array('parent_ids');
const remove_parent_from_env = remove_from_env('parents', 'parent_ids');

const add_child_to_set = add_to_set('children');
const add_child_to_array = add_to_array('child_ids');
const add_child_to_env = add_to_env('children', 'child_ids');
const remove_child_from_set = remove_from_set('children');
const remove_child_from_array = remove_from_array('child_ids');
const remove_child_from_env = remove_from_env('children', 'child_ids');

const repair = function(env) {
  const f = function(
      source_id_name, source_object_name,
      target_id_name, target_object_name,
  ) {
    const add_id = add_to_array(target_id_name);
    const add_object = add_to_set(target_object_name);

    return function(source_id, source) {
      if (source_id_name in source) {
        for (const target_id of source[source_id_name]) {
          const target = env[target_id];

          add_id(target, source_id);
          add_object(target, source);
        }
      }

      if (source_object_name in source) {
        for (const target of source[source_object_name]) {
          add_id(target, source_id);
          add_object(target, source);
        }
      }
    };
  };

  const repair_aliases = f('alias_ids', 'aliases', 'alias_ids', 'aliases');
  const repair_parents = f('parent_ids', 'parents', 'child_ids', 'children');
  const repair_children = f('child_ids', 'children', 'parent_ids', 'parents');

  for (let i = 0; i < env.length; i++) {
    repair_aliases(i, env[i]);
    repair_parents(i, env[i]);
    repair_children(i, env[i]);
  }
};

const delete_objects = function(env) {
  for (let i = 0; i < env.length; i++) {
    delete env[i]['aliases'];
    delete env[i]['parents'];
    delete env[i]['children'];
  }
};

const iterable_map = function(iterable, f) {
  const iterator = iterable[Symbol.iterator]();

  return {
    [Symbol.iterator]: function() {
      return {
        next: () => {
          const next = iterator.next();
          if (next.done) {
            return {done: next.done};
          } else {
            return {value: f(next.value), done: next.done};
          }
        },
      };
    },
  };
};

const object_iterable = function(object, iterable_name) {
  if (iterable_name in object) {
    return object[iterable_name];
  } else {
    return {
      [Symbol.iterator]: function() {
        return {
          next: () => {
            return {done: true};
          },
        };
      },
    };
  };
};

const objects_by_ids_iterable = function(env) {
  return function(object, iterable_name) {
    return iterable_map(
        object_iterable(
            object,
            iterable_name,
        ),
        (id) => env[id],
    );
  };
};

export {
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

  iterable_map,
  object_iterable,
  objects_by_ids_iterable,
};
