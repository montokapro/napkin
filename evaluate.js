import {hyperlogarithmicOperations} from './operations.js';
import {objectIterable} from './struct.js';

const prettyNumber = function(number) {
  switch (number) {
    case -Infinity:
      return '-∞';
    case Infinity:
      return '∞';
    default:
      return number;
  }
};

// Linear, cannot be used concurrently
const withStackTraceF = function(visit) {
  return function(trace) {
    return function(focus) {
      trace.unshift(focus.id);
      const result = visit(focus);
      trace.shift();
      return result;
    };
  };
};

const envValueVisitF = (env) => (visit) => function(trace) {
  const go = function(focus) {
    const traceVisit = visit(trace);

    switch (focus.type) {
      case 'node':
      case 'edge':
        const portValues = [];
        for (const portId of objectIterable(focus, 'portIds')) {
          // TODO: check only previous port, otherwise assume cycle
          if (!trace.includes(portId)) {
            portValues.push(traceVisit(portId));
          }
        }

        // Consider checking for inequalities.
        return portValues.find((v) => v !== undefined);
      case 'port':
        const node = env[focus.nodeId];

        let operation;
        if ('operator' in node) {
          const operation = hyperlogarithmicOperations[node.operator];

          const commutationOperation = operation.commutation.operation;
          const commutationValue = function(values) {
            return values.reduce(commutationOperation, operation.identity);
          };

          // TODO: check only previous edge, otherwise possible cycle
          let fromEdgeId;
          const edgeValues = [];
          for (const edgeId of objectIterable(focus, 'edgeIds')) {
            if (trace.includes(edgeId)) {
              if (fromEdgeId === undefined) {
                fromEdgeId = edgeId;
              } else {
                return undefined;
              }
            } else {
              const result = traceVisit(edgeId);
              if (result === undefined) {
                return undefined;
              }
              edgeValues.push(result);
            }
          }

          // TODO: check only previous node, otherwise possible cycle
          let fromNodeId;
          const nodeValues = [];
          if (trace.includes(focus.nodeId)) {
            if (fromEdgeId === undefined) {
              fromNodeId = focus.nodeId;
            } else {
              return undefined;
            }
          } else {
            const result = traceVisit(focus.nodeId);
            if (result === undefined) {
              return undefined;
            }
            nodeValues.push(result);
          }

          const edgeValue = commutationValue(edgeValues);
          const nodeValue = commutationValue(nodeValues);

          const reversionOperation = operation.reversion.operation;

          if (fromNodeId !== undefined) {
            return reversionOperation(edgeValue, nodeValue);
          } else if (fromEdgeId !== undefined) {
            return reversionOperation(nodeValue, edgeValue);
          } else {
            // Consider checking for inequalities.
            return [edgeValue, nodeValue].find((v) => v !== undefined);
          }
        } else {
          const values = [];
          // TODO: check only previous edge, otherwise possible cycle
          for (const edgeId of objectIterable(focus, 'edgeIds')) {
            if (!trace.includes(edgeId)) {
              values.push(traceVisit(edgeId));
            }
          }
          // TODO: check only previous node, otherwise possible cycle
          if (!trace.includes(focus.nodeId)) {
            values.push(traceVisit(focus.nodeId));
          }

          // Consider checking for inequalities.
          return values.find((v) => v !== undefined);
        }
    }
  };

  return function(focusId) {
    const focus = env[focusId];

    if ('float' in focus) {
      return focus['float'];
    }

    return withStackTraceF(go)(trace)(focus);
  };
};

const envEquationVisitF = (env) => (visit) => function(trace) {
  const go = function(focus) {
    const traceVisit = visit(trace);

    switch (focus.type) {
      case 'node':
      case 'edge':
        const portEquations = [];
        for (const portId of objectIterable(focus, 'portIds')) {
          // TODO: check only previous port, otherwise assume cycle
          if (!trace.includes(portId)) {
            const result = traceVisit(portId);
            if (result === undefined) {
              return undefined;
            }
            portEquations.push(result);
          }
        }

        switch (portEquations.length) {
          case 0:
            return undefined;
          case 1:
            return portEquations[0];
          default:
            return {
              operator: -Infinity,
              name: portEquations.map(function(equation) {
                return equation.name;
              }).join(' = '),
            };
        }

        return;
      case 'port':
        const node = env[focus.nodeId];

        let operation;
        if ('operator' in node) {
          const operation = hyperlogarithmicOperations[node.operator];

          const identityEquation = {
            operator: Infinity,
            name: prettyNumber(operation.identity),
          };

          const commutationSymbol = operation.commutation.symbol;
          const commutationEquation = function(equations) {
            return {
              operator: node.operator,
              name: equations.map(function(equation) {
                if (equation.operator < node.operator) {
                  return '(' + equation.name + ')';
                } else {
                  return equation.name;
                }
              }).join(' ' + commutationSymbol + ' '),
            };
          };

          // TODO: check only previous edge, otherwise possible cycle
          let fromEdgeId;
          const edgeEquations = [];
          for (const edgeId of objectIterable(focus, 'edgeIds')) {
            if (trace.includes(edgeId)) {
              if (fromEdgeId === undefined) {
                fromEdgeId = edgeId;
              } else {
                return undefined;
              }
            } else {
              edgeEquations.push(traceVisit(edgeId));
            }
          }

          // TODO: check only previous node, otherwise possible cycle
          let fromNodeId;
          const nodeEquations = [];
          if (trace.includes(focus.nodeId)) {
            if (fromEdgeId === undefined) {
              fromNodeId = focus.nodeId;
            } else {
              return undefined;
            }
          } else {
            nodeEquations.push(traceVisit(focus.nodeId));
          }

          if (fromNodeId !== undefined) {
            let edgeEquation;
            switch (edgeEquations.length) {
              case 0:
                edgeEquation = identityEquation;
                break;
              case 1:
                edgeEquation = edgeEquations[0];
                break;
              default:
                edgeEquation = commutationEquation(edgeEquations);
            }

            let nodeEquation;
            switch (nodeEquations.length) {
              case 0:
                return edgeEquation;
              default:
                nodeEquations.unshift(edgeEquation);

                if (nodeEquations.includes(undefined)) {
                  return undefined;
                }

                const reversionSymbol = operation.reversion.symbol;
                return {
                  operator: node.operator,
                  name: nodeEquations.map(function(equation) {
                    if (equation.operator < node.operator) {
                      return '(' + equation.name + ')';
                    } else {
                      return equation.name;
                    }
                  }).join(' ' + reversionSymbol + ' '),
                };
            }
          } else if (fromEdgeId !== undefined) {
            let nodeEquation;
            switch (nodeEquations.length) {
              case 0:
                nodeEquation = identityEquation;
                break;
              case 1:
                nodeEquation = nodeEquations[0];
                break;
              default:
                nodeEquation = commutationEquation(nodeEquations);
            }

            let edgeEquation;
            switch (edgeEquations.length) {
              case 0:
                return nodeEquation;
              default:
                edgeEquations.unshift(nodeEquation);

                if (edgeEquations.includes(undefined)) {
                  return undefined;
                }

                const reversionSymbol = operation.reversion.symbol;
                return {
                  operator: node.operator,
                  name: edgeEquations.map(function(equation) {
                    if (equation.operator < node.operator) {
                      return '(' + equation.name + ')';
                    } else {
                      return equation.name;
                    }
                  }).join(' ' + reversionSymbol + ' '),
                };
            }
          } else {
            let nodeEquation;
            switch (nodeEquations.length) {
              case 0:
                nodeEquation = identityEquation;
                break;
              case 1:
                nodeEquation = nodeEquations[0];
                break;
              default:
                nodeEquation = commutationEquation(nodeEquations);
            }

            let edgeEquation;
            switch (nodeEquations.length) {
              case 0:
                edgeEquation = identityEquation;
                break;
              case 1:
                edgeEquation = edgeEquations[0];
                break;
              default:
                edgeEquation = commutationEquation(edgeEquations);
            }

            return {
              operator: -Infinity,
              name: [nodeEquation, edgeEquation].map(function(equation) {
                return equation.name;
              }).join(' = '),
            };
          }
        } else {
          const equations = [];
          // TODO: check only previous edge, otherwise possible cycle
          for (const edgeId of objectIterable(focus, 'edgeIds')) {
            if (!trace.includes(edgeId)) {
              const result = traceVisit(edgeId);
              if (result === undefined) {
                return undefined;
              }
              equations.push(result);
            }
          }
          // TODO: check only previous node, otherwise possible cycle
          if (!trace.includes(focus.nodeId)) {
            const result = traceVisit(focus.nodeId);
            if (result === undefined) {
              return undefined;
            }
            equations.push(result);
          }

          switch (equations.length) {
            case 0:
              return undefined;
            case 1:
              return equations[0];
            default:
              return {
                operator: -Infinity,
                name: equations.map(function(equation) {
                  return equation.name;
                }).join(' = '),
              };
          }
        }
    }
  };

  return function(focusId) {
    const focus = env[focusId];

    if ('name' in focus) {
      return {
        operator: Infinity,
        name: focus['name'],
      };
    }

    return withStackTraceF(go)(trace)(focus);
  };
};

// Use strict fixed point combinator so that we can test steps independently
// https://en.wikipedia.org/wiki/Fixed-point_combinator#Strict_fixed-point_combinator
const z = function(f) {
  const g = (a) => f((v) => a(a)(v));

  return g(g);
};

export {envValueVisitF, envEquationVisitF, z};
