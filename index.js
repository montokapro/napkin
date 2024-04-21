'use strict';

import {graphs} from './graphs.js';
import {hyperlogarithmicOperations} from './operations.js';
import {
  add_to_array as addToArray,
  remove_from_array as removeFromArray,

  iterable_map as iterableMap,
  object_iterable as objectIterable,
  objects_by_ids_iterable as objectsByIdsIterable,
} from './struct.js';

const thickness = 1 / 8;
const scale = 128;

let env;
let envObjectsByIdsIterable;
let clickedEdgeId;
let clickedPortId;
let clickedNodeId;

const equation = d3.select('#equation');
const calculation = d3.select('#calculation');
const display = d3.select('#display');

function graphClick() {
  clickedEdgeId = null;
  clickedNodeId = null;
  clickedPortId = null;

  updatePortVisible(image.selectAll('.node').selectAll('.port'));
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

function valueVisitors() {
  const visit = function(f, a) {
    if ('value' in a) {
      return a.value;
    } else {
      a.value = undefined; // visiting
      a.value = f(a);
      console.log(a.type);
      console.log(a.value);
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

function equationVisitors(selected) {
  const visits = {};

  const visit = function(f, a) {
    if ('name' in a) {
      return [
        true,
        {
          operator: Infinity,
          name: a['name'],
        },
      ];
    }

    if (a.id in visits) {
      if (visits[a.id]) {
        // already visited, error
        return [undefined];
      } else {
        // already visiting, ignore
        return [false];
      }
    } else {
      visits[a.id] = false;
      const r = f(a);
      visits[a.id] = true;
      return r;
    }
  };

  function nodeVisit(node) {
    const portEquations = [];
    for (const port of envObjectsByIdsIterable(node, 'portIds')) {
      const portResult = visit(portVisit, port);
      switch (portResult[0]) {
        case true:
          portEquations.push(portResult[1]);
          break;
      }
    }

    if (portEquations.length === 0) {
      return [undefined];
    } else if (portEquations.length === 1) {
      return [true, portEquations[0]];
    } else {
      return [
        true,
        {
          operator: -Infinity,
          name: portEquations.map(function(equation) {
            return equation.name;
          }).join(' = '),
        },
      ];
    }
  }

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

  function portVisit(port) {
    const node = env[port.nodeId];

    let operation;
    if ('operator in node') {
      operation = hyperlogarithmicOperations[node.operator];
    }

    let visitingPort = false;
    const edgeEquations = [];
    for (const edge of envObjectsByIdsIterable(port, 'edgeIds')) {
      const edgeResult = visit(edgeVisit, edge);
      switch (edgeResult[0]) {
        case undefined:
          if (operation !== undefined) {
            return edgeResult;
          }
        case false:
          visitingPort = true;
          break;
        case true:
          edgeEquations.push(edgeResult[1]);
          break;
      }
    }

    let edgeResult;
    if (edgeEquations.length === 0) {
      if (visitingPort || operation === undefined) {
        edgeResult = [undefined];
      } else {
        edgeResult = [
          true,
          {
            operator: Infinity,
            name: prettyNumber(operation.identity),
          },
        ];
      }
    } else if (edgeEquations.length === 1) {
      edgeResult = [true, edgeEquations[0]];
    } else {
      let commutationSymbol = '=';
      if (operation !== undefined) {
        commutationSymbol = operation.commutation.symbol;
      }
      edgeResult = [
        true,
        {
          operator: node.operator,
          name: edgeEquations.map(function(equation) {
            if (equation.operator < node.operator) {
              return '(' + equation.name + ')';
            } else {
              return equation.name;
            }
          }).join(' ' + commutationSymbol + ' '),
        },
      ];
    }

    const nodeResult = visit(nodeVisit, node);
    switch (nodeResult[0]) {
      case undefined:
        return nodeResult;
      case false:
      // TODO: inverse
        return edgeResult;
    }

    let reversionSymbol = '=';
    if (operation === undefined) {
      return nodeResult;
    } else {
      reversionSymbol = operation.reversion.symbol;
    }

    let edgeEquation;
    if (edgeResult[0]) {
      const nodeEquation = nodeResult[1];
      const edgeEquation = edgeResult[1];

      return [
        true,
        {
          operator: node.operator,
          name: [nodeEquation, edgeEquation]
              .map(function(equation) {
                if (equation.operator < node.operator) {
                  return '(' + equation.name + ')';
                } else {
                  return equation.name;
                }
              })
              .join(' ' + reversionSymbol + ' '),
        },
      ];
    } else {
      return nodeResult;
    }
  }

  function edgeVisit(edge) {
    const portEquations = [];
    for (const port of envObjectsByIdsIterable(edge, 'portIds')) {
      const portResult = visit(portVisit, port);
      switch (portResult[0]) {
        case true:
          portEquations.push(portResult[1]);
          break;
      }
    }

    if (portEquations.length === 0) {
      return [undefined];
    } else if (portEquations.length === 1) {
      return [true, portEquations[0]];
    } else {
      return [
        true,
        {
          operator: Infinity,
          name: portEquations.map(function(equation) {
            return equation.name;
          }).join(' = '),
        },
      ];
    }
  }

  const visitString = function(f) {
    return function(a) {
      const result = visit(f, a);
      switch (result[0]) {
        case true:
          return result[1]['name'];
        default:
          return '';
      }
    };
  };

  return {
    node: visitString(nodeVisit),
    port: visitString(portVisit),
    edge: visitString(edgeVisit),
  };
}

function selectVisitors(selected) {
  const visits = {};

  const visit = function(f) {
    return function(a) {
      if ('name' in a) {
        return;
      }

      if (a.selected == selected) {
        return;
      }

      f(a);
    };
  };

  function nodeVisit(node) {
    node.selected = selected;
    updateNodeFill(image.selectAll('#UUID-' + node.id).select('circle'));

    // concurrent visits
    for (const port of envObjectsByIdsIterable(node, 'portIds')) {
      visit(portVisit)(port);
    }
  }

  function portVisit(port) {
    port.selected = selected;

    const node = env[port.nodeId];

    // concurrent visits
    for (const edge of envObjectsByIdsIterable(port, 'edgeIds')) {
      visit(edgeVisit)(edge);
    }
    visit(nodeVisit)(node);
  }

  function edgeVisit(edge) {
    edge.selected = selected;
    updateEdgeStroke(image.selectAll('#UUID-' + edge.id));

    // concurrent visits
    for (const port of envObjectsByIdsIterable(edge, 'portIds')) {
      visit(portVisit)(port);
    }
  }

  return {
    node: visit(nodeVisit),
    port: visit(portVisit),
    edge: visit(edgeVisit),
  };
}

function edgeOver(e, d, i) {
  selectVisitors(true).edge(d);
  const text = equationVisitors(true).edge(d);
  if (text === undefined) {
    equation.text('');
  } else {
    equation.text(text);
  }
  calculation.text(valueVisitors().edge(d));
}

function edgeOut(e, d, i) {
  calculation.text('');
  equation.text('');
  equationVisitors().edge(d);
  selectVisitors(false).edge(d);
}

function nodeOver(e, d, i) {
  selectVisitors(true).node(d);
  const text = equationVisitors().node(d);
  if (text === undefined) {
    equation.text('');
  } else {
    equation.text(text);
  }
  calculation.text(valueVisitors().node(d));
}

function nodeOut(e, d, i) {
  calculation.text('');
  equation.text('');
  equationVisitors().node(d);
  selectVisitors(false).node(d);
}

function linePosition(cursor, source, target) {
  const targetToSource = [
    target[0] - source[0],
    target[1] - source[1],
  ];

  const cursorToSource = [
    cursor[0] - source[0],
    cursor[1] - source[1],
  ];

  const d = (
    cursorToSource[0] * targetToSource[0] + cursorToSource[1] * targetToSource[1]
  ) / (
    targetToSource[0] * targetToSource[0] + targetToSource[1] * targetToSource[1]
  );

  return [
    (1 - d) * source[0] + d * target[0],
    (1 - d) * source[1] + d * target[1],
  ];
}

function curvePosition(cursor, center, radius) {
  const cursorToCenter = [
    cursor[0] - center[0],
    cursor[1] - center[1],
  ];

  const distance = Math.sqrt(cursorToCenter[0] * cursorToCenter[0] + cursorToCenter[1] * cursorToCenter[1]);
  const ratio = radius / distance;
  return [
    center[0] + cursorToCenter[0] * ratio,
    center[1] + cursorToCenter[1] * ratio,
  ];
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

// https://stackoverflow.com/questions/28102089/simple-graph-of-nodes-and-links-without-using-force-layout
function dragStarted(groupSelection) {
  // d3.select(this).raise(); draws on top of other elements
  groupSelection.attr('cursor', 'grabbing');
}

function portDragged(event, d) {
  d.point = [event.x, event.y];

  d3.select(this)
      .attr('cx', d.point[0])
      .attr('cy', d.point[1]);

  const includePortId = function(edge) {
    return Array.from(objectIterable(edge, 'portIds')).includes(d.id);
  };

  updateEdgePath(d3.selectAll('.edge').filter(includePortId));
}

function nodeDragged(event, d) {
  d.point = [event.x, event.y];

  d3.select(this)
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

function dragEnded(groupSelection) {
  groupSelection.attr('cursor', 'grab');
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
      .call(d3.drag().on('drag', portDragged));

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
      .on('click', nodeClick);

  groupSelection.call(d3.drag()
      .on('start', dragStarted(groupSelection))
      .on('drag', nodeDragged)
      .on('end', dragEnded(groupSelection)));

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
  return updateNodeFill(groupSelection.select('.nodeCircle'));
}

function update() {
  equation.text('');
  calculation.text('foo');

  image
      .selectAll('.edge')
      .data(Object.entries(env).filter((a) => a[1].type == 'edge').map((a) => a[1]), (edge) => edge.id)
      .join(enterEdge, updateEdge);

  image
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
