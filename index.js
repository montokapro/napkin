'use strict';

import {graphs} from './graphs.js';
import {hyperlogarithmicOperations} from './operations.js';
import {
  addToArray, removeFromArray,
  iterableMap, objectIterable, objectsByIdsIterable,
} from './struct.js';

const thickness = 1 / 8;
const scale = 128;

let env;
let envObjectsByIdsIterable;
let clickedEdgeId;
let clickedPortId;
let clickedNodeId;
let draggedNode;

const equation = d3.select('#equation');
const calculation = d3.select('#calculation');
const display = d3.select('#display');

function graphClick() {
  clickedEdgeId = null;
  clickedNodeId = null;
  clickedPortId = null;

  updatePortVisible(nodes.selectAll('.node').selectAll('.port'));
}

function handleZoom(e) {
  d3.select('#image')
      .attr('transform', e.transform);
}

const zoom = d3.zoom()
    .on('zoom', handleZoom);

// https://www.d3indepth.com/zoom-and-pan/
const svg = display
    .append('svg')
    .attr('width', '100vw')
    .attr('height', '100vh')
    .call(zoom)
    .call(zoom.transform, d3.zoomIdentity.scale(scale))
    .on('click', graphClick);

const image = svg
    .append('g')
    .attr('id', 'image')
    .attr('transform', 'scale(' + scale + ')')
    .style('pointer-events', 'all');

const edges = image
    .append('g')
    .attr('id', 'edges');

const nodes = image
    .append('g')
    .attr('id', 'nodes');

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

function valueVisitors() {
  const visit = function(f, a) {
    if ('value' in a) {
      return a.value;
    } else {
      a.value = undefined; // visiting
      a.value = f(a);
      return a.value;
    }
  };

  function nodeVisit(node) {
    const portValues = [];
    for (const port of envObjectsByIdsIterable(node, 'portIds')) {
      const portResult = visit(portVisit, port);
      if (portResult !== undefined) {
        if (portResult.float !== undefined) {
          portValues.push(portResult);
        } else {
          return portResult;
        }
      }
    }

    if (portValues.length === 0) {
      return {float: undefined};
    } else if (portValues.length === 1) {
      return portValues[0];
    } else {
      // consider validating equality
      return portValues[0];
    }
  }

  function portVisit(port) {
    const node = env[port.nodeId];

    let operation;
    if ('operator in node') {
      operation = hyperlogarithmicOperations[node.operator];
    }

    let visitingPort = false;
    const edgeValues = [];
    for (const edge of envObjectsByIdsIterable(port, 'edgeIds')) {
      const edgeResult = visit(edgeVisit, edge);
      if (edgeResult !== undefined) {
        if (edgeResult.float !== undefined) {
          edgeValues.push(edgeResult);
        } else {
          return edgeResult;
        }
      } else {
        visitingPort = true;
      }
    }

    let edgeResult;
    if (edgeValues.length === 0) {
      if (visitingPort || operation === undefined) {
        edgeResult = {float: undefined};
      } else {
        edgeResult = {
          float: operation.identity,
        };
      }
    } else if (edgeValues.length === 1) {
      edgeResult = edgeValues[0];
    } else {
      const commutationSymbol = '=';
      if (operation !== undefined) {
        edgeResult = edgeValues.reduce(
            operation.commutation.operation,
            operation.identity,
        );
      } else {
        edgeResult = edgeValues[0];
      }
    }

    const nodeResult = visit(nodeVisit, node);

    if (nodeResult === undefined) {
      return edgeResult;
    }

    if (nodeResult.float === undefined) {
      return nodeResult;
    }

    if (operation === undefined) {
      return nodeResult;
    }

    if (edgeResult === undefined) {
      return nodeResult;
    }

    return {
      float: operation.reversion.operation(
          nodeResult.float,
          edgeResult.float,
      ),
    };
  }

  function edgeVisit(edge) {
    const portValues = [];
    for (const port of envObjectsByIdsIterable(edge, 'portIds')) {
      const portResult = visit(portVisit, port);
      if (portResult !== undefined) {
        if (portResult.float !== undefined) {
          portValues.push(portResult);
        } else {
          return portResult;
        }
      }
    }

    if (portValues.length === 0) {
      return {float: undefined};
    } else if (portValues.length === 1) {
      return portValues[0];
    } else {
      // consider validating equality
      return portValues[0];
    }
  }

  const visitString = function(f) {
    return function(a) {
      const result = visit(f, a);

      if (result === undefined) {
        return '';
      }

      if (result.float === undefined) {
        return '';
      }

      return result.float;
    };
  };

  return {
    node: visitString(nodeVisit),
    port: visitString(portVisit),
    edge: visitString(edgeVisit),
  };
}

// Use strict fixed point combinator so that we can test steps independently
// https://en.wikipedia.org/wiki/Fixed-point_combinator#Strict_fixed-point_combinator
const z = function(f) {
  const g = (a) => f((v) => a(a)(v));

  return g(g);
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

const equationVisitF = function(visit) {
  return function(trace) {
    const go = function(focus) {
      const traceVisit = visit(trace);

      switch (focus.type) {
        case 'node':
        case 'edge':
          const portEquations = [];
          for (const portId of objectIterable(focus, 'portIds')) {
          // TODO: check only previous port, otherwise assume cycle
            if (!trace.includes(portId)) {
              portEquations.push(traceVisit(portId));
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
                equations.push(traceVisit(edgeId));
              }
            }
            // TODO: check only previous node, otherwise possible cycle
            if (!trace.includes(focus.nodeId)) {
              equations.push(traceVisit(focus.nodeId));
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
};

const equationVisit = z(equationVisitF)([]);

const selectVisitF = function(selected) {
  return function(visit) {
    return function(d) {
      if ('name' in d) {
        return;
      }

      if (d.selected == selected) {
        return;
      }

      d.selected = selected;

      switch (d.type) {
        case 'node':
          updateNodeFill(nodes.selectAll('#UUID-' + d.id).select('circle'));

          // concurrent visits
          for (const port of envObjectsByIdsIterable(d, 'portIds')) {
            visit(port);
          }

          return;
        case 'port':
          const node = env[d.nodeId];

          // concurrent visits
          for (const edge of envObjectsByIdsIterable(d, 'edgeIds')) {
            visit(edge);
          }
          visit(node);

          return;
        case 'edge':
          updateEdgeStroke(edges.selectAll('#UUID-' + d.id));

          // concurrent visits
          for (const port of envObjectsByIdsIterable(d, 'portIds')) {
            visit(port);
          }

          return;
      }
    };
  };
};

const selectVisit = z(selectVisitF(true));
const unselectVisit = z(selectVisitF(false));

function edgeOver(e, d, i) {
  selectVisit(d);
  const result = equationVisit(d.id);
  if (result === undefined || result.name === undefined) {
    equation.text('');
  } else {
    equation.text(result.name);
  }
  calculation.text(valueVisitors().edge(d));
}

function edgeOut(e, d, i) {
  calculation.text('');
  equation.text('');
  unselectVisit(d);
}

function nodeOver(e, d, i) {
  selectVisit(d);
  const result = equationVisit(d.id);
  if (result === undefined || result.name === undefined) {
    equation.text('');
  } else {
    equation.text(result.name);
  }
  calculation.text(valueVisitors().node(d));
}

function nodeOut(e, d, i) {
  calculation.text('');
  equation.text('');
  unselectVisit(d);
}

function updateEdgePath(pathSelection) {
  return pathSelection
      .attr('d', function(d) {
        const sourcePort = env[d['portIds'][0]];
        const targetPort = env[d['portIds'][1]];
        const sourceNode = env[sourcePort['nodeId']];
        const targetNode = env[targetPort['nodeId']];

        const path = d3.path();
        path.moveTo(
            sourceNode.point[0],
            sourceNode.point[1],
        );
        path.bezierCurveTo(
            sourceNode.point[0] + sourcePort.point[0],
            sourceNode.point[1] + sourcePort.point[1],
            targetNode.point[0] + targetPort.point[0],
            targetNode.point[1] + targetPort.point[1],
            targetNode.point[0],
            targetNode.point[1],
        );
        return path.toString();
      });
}

function updateEdgeStroke(pathSelection) {
  return pathSelection
      .attr('stroke', function(d) {
        if (d.selected) {
          return '#FFC3BF';
        } else {
          return '#FF928B';
        }
      });
}

function enterEdge(selection) {
  const pathSelection = selection.append('path');

  pathSelection
      .attr('id', (d) => 'UUID-' + d.id)
      .attr('class', 'edge')
      .attr('fill', 'none')
      .attr('pointer-events', 'stroke')
      .attr('stroke-width', thickness);

  updateEdgePath(pathSelection);
  updateEdgeStroke(pathSelection);

  return pathSelection
      .on('mouseover', edgeOver)
      .on('mouseout', edgeOut);
}

function updateEdge(pathSelection) {
  updateEdgeStroke(pathSelection);

  return pathSelection;
}

// Respond to right click
// https://github.com/d3/d3-drag/blob/v3.0.0/src/drag.js#L8-L11
const dragFilter = function(event) {
  return !event.ctrlKey && (event.button !== 0 || event.button !== 2);
};

const duplicateNode = function(originalNode, originalPort) {
  const duplicateNode = Object.assign({}, originalNode);
  duplicateNode.id = crypto.randomUUID();
  delete duplicateNode.portIds;
  env[duplicateNode.id] = duplicateNode;

  for (const port of envObjectsByIdsIterable(originalNode, 'portIds')) {
    const duplicatePort = Object.assign({}, port);
    duplicatePort.id = crypto.randomUUID();
    duplicatePort.nodeId = duplicateNode.id;
    addToArray('portIds')(duplicateNode, duplicatePort.id);

    delete duplicatePort.edgeIds;

    env[duplicatePort.id] = duplicatePort;

    if (originalPort === undefined || originalPort.id === port.id) {
      const edge = {};
      edge.id = crypto.randomUUID();
      edge.type = 'edge';
      env[edge.id] = edge;

      edge['portIds'] = [port.id, duplicatePort.id];
      addToArray('edgeIds')(port, edge.id);
      addToArray('edgeIds')(duplicatePort, edge.id);

      duplicatePort.edgeIds = [edge.id];

      edges
          .selectAll('.edge')
          .select('#UUID-' + edge.id)
          .data([edge], (edge) => edge.id)
          .join(enterEdge, updateEdge);
    }
  }

  nodes
      .selectAll('.node')
      .select('#UUID-' + duplicateNode.id)
      .data([duplicateNode], (node) => node.id)
      .join(enterNode, updateNode);

  return duplicateNode;
};

function updateNodePoint(event, d) {
  d.point = [event.x, event.y];

  nodes.selectAll('#UUID-' + d.id)
      .attr('transform', 'translate(' + d.point[0] + ',' + d.point[1] + ')');

  const nodePortIds = Array.from(objectIterable(d, 'portIds'));

  const includePortId = function(edge) {
    const edgePortIds = Array.from(objectIterable(edge, 'portIds'));

    for (const edgePortId of edgePortIds) {
      for (const nodePortId of nodePortIds) {
        if (edgePortId === nodePortId) {
          return true;
        }
      }
    }

    return false;
  };

  updateEdgePath(d3.selectAll('.edge').filter(includePortId));
}

// https://stackoverflow.com/questions/28102089/simple-graph-of-nodes-and-links-without-using-force-layout
function nodeDragStarted(event, d) {
  if (event.sourceEvent.button === 2) {
    draggedNode = duplicateNode(d, undefined);
  } else {
    draggedNode = d;
  }

  nodes.selectAll('#UUID-' + draggedNode.id).attr('cursor', 'grabbing');
}

function nodeDragged(event, d) {
  if (draggedNode === undefined) {
    updateNodePoint(event, d);
  } else {
    updateNodePoint(event, draggedNode);
  }
}

function nodeDragEnded(event, d) {
  nodes.selectAll('#UUID-' + draggedNode.id).attr('cursor', 'grab');

  draggedNode = undefined;
}

function updatePortPoint(event, d, self) {
  d.point = [event.x, event.y];

  d3.select(self)
      .attr('cx', d.point[0])
      .attr('cy', d.point[1]);

  const includePortId = function(edge) {
    return Array.from(objectIterable(edge, 'portIds')).includes(d.id);
  };

  updateEdgePath(d3.selectAll('.edge').filter(includePortId));
}

function portDragStarted(event, d) {
  if (event.sourceEvent.button === 2) {
    const node = env[d.nodeId];

    draggedNode = duplicateNode(node, d);
  }
}

function portDragged(event, d) {
  if (draggedNode === undefined) {
    updatePortPoint(event, d, this);
  } else {
    const node = env[d.nodeId];

    const point = {
      x: node.point[0] - d.point[0] + event.x,
      y: node.point[1] - d.point[1] + event.y,
    };

    updateNodePoint(point, draggedNode);
  }
}

function portDragEnded(event, d) {
  draggedNode = undefined;
}

function updatePortFill(circleSelection) {
  circleSelection
      .style('fill', function(d) {
        if (d.id === clickedPortId) {
          return '#DFFFD1';
        } else {
          return '#CDEAC0';
        }
      });

  return circleSelection;
}

function updatePortVisible(circleSelection) {
  circleSelection
      .style('display', function(d) {
        return d.nodeId === clickedNodeId ? 'block' : 'none';
      });

  return circleSelection;
}

function enterPort(groupSelection) {
  const circleSelection = groupSelection.append('circle');

  circleSelection
      .attr('id', (d) => 'UUID-' + d.id)
      .attr('class', 'port')
      .attr('r', thickness)
      .attr('cx', (d) => d.point[0])
      .attr('cy', (d) => d.point[1])
      .style('stroke-width', 0)
      .call(
          d3.drag()
              .filter(dragFilter)
              .on('start', portDragStarted)
              .on('drag', portDragged)
              .on('end', portDragEnded),
      );

  updatePortFill(circleSelection);
  updatePortVisible(circleSelection);

  return circleSelection;
}

function updatePort(circleSelection) {
  updatePortFill(circleSelection);
  updatePortVisible(circleSelection);

  return circleSelection;
}

function nodeClick(e, d) {
  clickedNodeId = d.id;

  updatePortVisible(d3.select(this).selectAll('.port'));

  e.stopPropagation();
}

function updateNodeFill(circleSelection) {
  circleSelection
      .style('fill', function(d) {
        if ('name' in d) {
          if (d.id === clickedNodeId) {
            return '#DFFFD1';
          } else {
            return '#CDEAC0';
          }
        } else {
          if (d.selected) {
            return '#FFC3BF';
          } else {
            return '#FF928B';
          }
        }
      });

  return circleSelection;
}

function enterNode(selection) {
  const groupSelection = selection.append('g')
      .attr('id', (d) => 'UUID-' + d.id)
      .attr('class', 'node')
      .attr('transform', function(d) {
        return 'translate(' + d.point[0] + ',' + d.point[1] + ')';
      })
      .on('mouseover', nodeOver)
      .on('mouseout', nodeOut)
      .on('click', nodeClick)
      .on('contextmenu', (e) => e.preventDefault()); // respond to right-click

  groupSelection.call(
      d3.drag()
          .filter(dragFilter)
          .on('start', nodeDragStarted)
          .on('drag', nodeDragged)
          .on('end', nodeDragEnded),
  );

  const circleSelection = groupSelection.append('circle')
      .attr('class', 'nodeCircle')
      .attr('r', thickness * 2)
      .style('stroke-width', 0);

  updateNodeFill(circleSelection);

  groupSelection.append('text')
      .text(function(d) {
        // if (d.value != null) {
        //   return d.value.toString();
        // } else
        if ('operator' in d) {
          return hyperlogarithmicOperations[d.operator].commutation.symbol;
        } else {
          return d.name;
        }
      })
      .style('font-family', 'Roboto Mono, sans-serif')
      .style('font-weight', 'bold')
      .style('font-size', '0.25px')
      .style('text-anchor', 'middle')
      .style('dominant-baseline', 'middle');

  groupSelection.selectAll('.port')
      .data(function(node) {
        return Array.from(
            envObjectsByIdsIterable(node, 'portIds'),
        );
      }, (d) => d.id)
      .join(enterPort, updatePort);

  return groupSelection;
}

function updateNode(groupSelection) {
  updateNodeFill(groupSelection.select('.nodeCircle'));

  return groupSelection;
}

function update() {
  equation.text('');
  calculation.text('foo');

  edges
      .selectAll('.edge')
      .data(Object.entries(env).filter((a) => a[1].type == 'edge').map((a) => a[1]), (edge) => edge.id)
      .join(enterEdge, updateEdge);

  nodes
      .selectAll('.node')
      .data(Object.entries(env).filter((a) => a[1].type == 'node').map((a) => a[1]), (node) => node.id)
      .join(enterNode, updateNode);
}

function selectGraph(outerId, innerId) {
  const outer = graphs[outerId];
  const inner = outer[innerId];

  env = {};
  envObjectsByIdsIterable = objectsByIdsIterable(env);
  clickedEdgeId = null;
  clickedPortId = null;
  clickedNodeId = null;

  const edges = {};
  for (const nodeData of inner) {
    const node = Object.assign({}, nodeData);
    delete node['ports'];

    node.id = crypto.randomUUID();
    node.type = 'node';

    env[node.id] = node;

    for (const portData of objectIterable(nodeData, 'ports')) {
      const port = Object.assign({}, portData);
      delete port['edgeIds'];

      port.id = crypto.randomUUID();
      port.type = 'port';

      env[port.id] = port;

      for (const edgeData of objectIterable(portData, 'edgeIds')) {
        let edge;
        if (edgeData in edges) {
          edge = edges[edgeData];
        } else {
          edge = {};
          edge.id = crypto.randomUUID();
          edge.type = 'edge';
          edges[edgeData] = edge;

          env[edge.id] = edge;
        }
        addToArray('portIds')(edge, port.id);
        addToArray('edgeIds')(port, edge.id);
      }

      port['nodeId'] = node.id;
      addToArray('portIds')(node, port.id);
    }
  };
}

const graphSelect = d3.select('#graphSelect');

const optgroups = graphSelect
    .selectAll('optgroup')
    .data(Object.entries(graphs))
    .join((enter) => enter
        .append('optgroup')
        .attr('label', (outerPair) => outerPair[0]),
    );

optgroups.each(function(outerPair) {
  d3.select(this)
      .selectAll('option')
      .data(Object.keys(outerPair[1]))
      .join((enter) => enter
          .append('option')
          .text((innerId) => innerId)
          .attr('value', (innerId) => JSON.stringify([outerPair[0], innerId])),
      );
});

graphSelect
    .on('change', function() {
      const selectedOption = d3.select(this).property('value');

      const [outerId, innerId] = JSON.parse(selectedOption);

      selectGraph(outerId, innerId);
      update();
    });

selectGraph('one', 'identity');
update();
