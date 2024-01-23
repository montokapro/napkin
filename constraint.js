const identities = [
  -Infinity,
  0,
  1,
  Math.E
];

const commutations = {
  'TODO': undefined,
  '+': (a, b) => { return a + b; },
  '*': (a, b) => { return a * b; },
  'TODO2': undefined
}

const reversions = {
  'TODO': undefined,
  '-': (a, b) => { return a - b; },
  '/': (a, b) => { return a / b; },
  'TODO2': undefined
}

function evaluate(env, node) {
  const zero = identities[node.operator - 1];
  const one = identities[node.operator];
  const times = Object.values(commutations)[node.operator];
  const divides = Object.values(reversions)[node.operator];

  const f = values => {
    const unit = {
      value: one, // aggregate
      indices: [] // indices of incomplete elements
    };

    return values.reduce(
      (a, i) => {
        const value = env[i];
        if (value == null) {
          return {
            value: a.value,
            indices: a.indices.concat([i])
          };
        } else {
          return {
            value: times(a.value, value),
            indices: a.indices
          };
        }
      },
      unit
    );
  };

  const g = (left, right) => {
    if (left.indices.length === 0) {
      if (right.indices.length === 0 || right.value === zero) {
        if (left.value !== right.value) {
          return undefined;
        }
      }
    } else if (left.indices.length === 1) {
      if (right.indices.length === 0 || right.value === zero) {
        if (left.value === zero) {
          return {};
        } else {
          const h = {};
          h[left.indices[0]] = divides(right.value, left.value)
          return h;
        }
      }
    }

    return {};
  };

  const results = node.values.map(f);

  const left = g(results[0], results[1]);
  if (left === undefined) {
    return left;
  }

  const right = g(results[1], results[0]);
  if (right === undefined) {
    return right;
  }

  return { ...left, ...right };
}

export { evaluate };
