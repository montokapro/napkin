//
// This structure is intended to be trivially serializable.
// Objects are referenceable both by id and by pointer.
//

// returns true if changed
function idempotentAdd(array, value) {
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
function idempotentRemove(array, value) {
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
const addToSet = function(name) {
  return function(source, target) {
    if (!(name in source)) {
      source[name] = new Set([target]);
    } else {
      source[name].add(target);
    }
  };
};

// Inefficient data structure, easy to serialize
const addToArray = function(name) {
  return function(source, target) {
    if (!(name in source)) {
      source[name] = [];
    }

    idempotentAdd(source[name], target);
  };
};

// Efficient data structure, hard to serialize
const removeFromSet = function(name) {
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
const removeFromArray = function(name) {
  return function(source, target) {
    if (name in source) {
      idempotentRemove(source[name], target);

      if (source[name].length === 0) {
        delete source[name];
      }
    }
  };
};

// Include both data structures
const addToEnv = function(setName, arrayName) {
  const addSet = addToSet(setName);
  const addArray = addToArray(arrayName);

  return function(env, sourceId, targetId) {
    const source = env[sourceId];

    addSet(source, target);
    addArray(source, targetId);
  };
};

// Include both data structures
const removeFromEnv = function(setName, arrayName) {
  const removeSet = removeFromSet(setName);
  const removeArray = removeFromArray(arrayName);

  return function(env, sourceId, targetId) {
    const source = env[sourceId];

    removeArray(source, target);
    removeSet(source, target);
  };
};

const addAliasToSet = addToSet('aliases');
const addAliasToArray = addToArray('aliasIds');
const addAliasToEnv = addToEnv('aliases', 'aliasIds');
const removeAliasFromSet = removeFromSet('aliases');
const removeAliasFromArray = removeFromArray('aliasIds');
const removeAliasFromEnv = removeFromEnv('aliases', 'aliasIds');

const addParentToSet = addToSet('parents');
const addParentToArray = addToArray('parentIds');
const addParentToEnv = addToEnv('parents', 'parentIds');
const removeParentFromSet = removeFromSet('parents');
const removeParentFromArray = removeFromArray('parentIds');
const removeParentFromEnv = removeFromEnv('parents', 'parentIds');

const addChildToSet = addToSet('children');
const addChildToArray = addToArray('childIds');
const addChildToEnv = addToEnv('children', 'childIds');
const removeChildFromSet = removeFromSet('children');
const removeChildFromArray = removeFromArray('childIds');
const removeChildFromEnv = removeFromEnv('children', 'childIds');

const repair = function(env) {
  const f = function(
      sourceIdName, sourceObjectName,
      targetIdName, targetObjectName,
  ) {
    const addId = addToArray(targetIdName);
    const addObject = addToSet(targetObjectName);

    return function(sourceId, source) {
      if (sourceIdName in source) {
        for (const targetId of source[sourceIdName]) {
          const target = env[targetId];

          addId(target, sourceId);
          addObject(target, source);
        }
      }

      if (sourceObjectName in source) {
        for (const target of source[sourceObjectName]) {
          addId(target, sourceId);
          addObject(target, source);
        }
      }
    };
  };

  const repairAliases = f('aliasIds', 'aliases', 'aliasIds', 'aliases');
  const repairParents = f('parentIds', 'parents', 'childIds', 'children');
  const repairChildren = f('childIds', 'children', 'parentIds', 'parents');

  for (let i = 0; i < env.length; i++) {
    repairAliases(i, env[i]);
    repairParents(i, env[i]);
    repairChildren(i, env[i]);
  }
};

const deleteObjects = function(env) {
  for (let i = 0; i < env.length; i++) {
    delete env[i]['aliases'];
    delete env[i]['parents'];
    delete env[i]['children'];
  }
};

const iterableMap = function(iterable, f) {
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

const objectIterable = function(object, iterableName) {
  if (iterableName in object) {
    return object[iterableName];
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

const objectsByIdsIterable = function(env) {
  return function(object, iterableName) {
    return iterableMap(
        objectIterable(
            object,
            iterableName,
        ),
        (id) => env[id],
    );
  };
};

export {
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
};
