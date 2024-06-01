'use strict';

import {graphs} from './graphs.js';
import {hyperlogarithmicOperations} from './operations.js';
import {addToArray, objectIterable, objectsByIdsIterable} from './struct.js';
import {envValueVisitF, envEquationVisitF, z} from './evaluate.js';

const thickness = 1 / 8;
const scale = 128;

const env = {};
const envObjectsByIdsIterable = objectsByIdsIterable(env);
const valueVisitF = envValueVisitF(env);
const equationVisitF = envEquationVisitF(env);

let draggedNode;

const equationSelection = d3.select('#equation');
const calculationSelection = d3.select('#calculation');
const displaySelection = d3.select('#display');

equationSelection.on('input', function(d) {
  const value = this.value;
  Object.entries(env).forEach(function(entry) {
    const data = entry[1];
    if (data.selected) {
      if (value === '') {
        delete data.name;
      } else {
        data.name = value;
      }
      updateName(data);
    }
  });
});

calculationSelection.on('input', function(d) {
  const value = this.value;
  Object.entries(env).forEach(function(entry) {
    const data = entry[1];
    if (data.selected) {
      const float = parseFloat(value);
      if (isNaN(float)) {
        delete data.float;
      } else {
        data.float = float;
      }
    }
  });
});

const graphClick = function() {
  Object.entries(env).forEach((e) => delete e[1].selected);

  updateNodeFill(nodeSelection.selectAll('.node').select('circle'));
  updatePortFill(nodeSelection.selectAll('.node').selectAll('.port'));
  updateEdgeStroke(edgeSelection.selectAll('.edge'));

  updatePortVisible(nodeSelection.selectAll('.node').selectAll('.port'));
};

const handleZoom = function(e) {
  d3.select('#image')
      .attr('transform', e.transform);
};

const zoom = d3.zoom()
    .on('zoom', handleZoom);

// https://www.d3indepth.com/zoom-and-pan/
const svgSelection = displaySelection
    .append('svg')
    .attr('width', '100vw')
    .attr('height', '100vh')
    .call(zoom)
    .call(zoom.transform, d3.zoomIdentity.scale(scale))
    .on('click', graphClick);

const imageSelection = svgSelection
    .append('g')
    .attr('id', 'image')
    .attr('transform', 'scale(' + scale + ')')
    .style('pointer-events', 'all');

const edgeSelection = imageSelection
    .append('g')
    .attr('id', 'edges');

const nodeSelection = imageSelection
    .append('g')
    .attr('id', 'nodes');

const valueVisit = z(valueVisitF)([]);
const equationVisit = z(equationVisitF)([]);

const edgeOver = function(e, d, i) {
  const equationResult = equationVisit(d.id);
  if (equationResult === undefined || equationResult.name === undefined) {
    equationSelection.property('value', '');
  } else {
    equationSelection.property('value', equationResult.name);
  }
  const valueResult = valueVisit(d.id);
  if (valueResult === undefined) {
    calculationSelection.property('value', '');
  } else {
    calculationSelection.property('value', valueResult);
  }
};

const edgeOut = function(e, d, i) {
  calculationSelection.property('value', '');
  equationSelection.property('value', '');
};

const nodeOver = function(e, d, i) {
  const equationResult = equationVisit(d.id);
  if (equationResult === undefined || equationResult.name === undefined) {
    equationSelection.property('value', '');
  } else {
    equationSelection.property('value', equationResult.name);
  }
  const valueResult = valueVisit(d.id);
  if (valueResult === undefined) {
    calculationSelection.property('value', '');
  } else {
    calculationSelection.property('value', valueResult);
  }
};

const nodeOut = function(e, d, i) {
  calculationSelection.property('value', '');
  equationSelection.property('value', '');
};

const updateEdgePath = function(pathSelection) {
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
};

const updateEdgeStroke = function(pathSelection) {
  return pathSelection
      .attr('stroke', function(d) {
        if (d.selected) {
          return '#FFC3BF';
        } else {
          return '#FF928B';
        }
      });
};

const enterEdge = function(selection) {
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
      .on('mouseout', edgeOut)
      .on('click', edgeClick);
};

const updateEdge = function(pathSelection) {
  updateEdgeStroke(pathSelection);

  return pathSelection;
};

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

      edgeSelection
          .selectAll('.edge')
          .select('#UUID-' + edge.id)
          .data([edge], (edge) => edge.id)
          .join(enterEdge, updateEdge);
    }
  }

  nodeSelection
      .selectAll('.node')
      .select('#UUID-' + duplicateNode.id)
      .data([duplicateNode], (node) => node.id)
      .join(enterNode, updateNode);

  return duplicateNode;
};

const updateNodePoint = function(event, d) {
  d.point = [event.x, event.y];

  nodeSelection.selectAll('#UUID-' + d.id)
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
};

// https://stackoverflow.com/questions/28102089/simple-graph-of-nodes-and-links-without-using-force-layout
const nodeDragStarted = function(event, d) {
  if (event.sourceEvent.button === 2) {
    draggedNode = duplicateNode(d, undefined);
  } else {
    draggedNode = d;
  }

  nodeSelection.selectAll('#UUID-' + draggedNode.id).attr('cursor', 'grabbing');
};

const nodeDragged = function(event, d) {
  if (draggedNode === undefined) {
    updateNodePoint(event, d);
  } else {
    updateNodePoint(event, draggedNode);
  }
};

const nodeDragEnded = function(event, d) {
  nodeSelection.selectAll('#UUID-' + draggedNode.id).attr('cursor', 'grab');

  draggedNode = undefined;
};

const updatePortPoint = function(event, d, self) {
  d.point = [event.x, event.y];

  d3.select(self)
      .attr('cx', d.point[0])
      .attr('cy', d.point[1]);

  const includePortId = function(edge) {
    return Array.from(objectIterable(edge, 'portIds')).includes(d.id);
  };

  updateEdgePath(d3.selectAll('.edge').filter(includePortId));
};

const portDragStarted = function(event, d) {
  if (event.sourceEvent.button === 2) {
    const node = env[d.nodeId];

    draggedNode = duplicateNode(node, d);
  }
};

const portDragged = function(event, d) {
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
};

const portDragEnded = function(event, d) {
  draggedNode = undefined;
};

const updatePortFill = function(circleSelection) {
  circleSelection
      .style('fill', function(d) {
        if (d.selected) {
          return '#DFFFD1';
        } else {
          return '#CDEAC0';
        }
      });

  return circleSelection;
};

const updatePortVisible = function(circleSelection) {
  circleSelection
      .style('display', function(d) {
        const node = env[d.nodeId];
        return node.selected ? 'block' : 'none';
      });

  return circleSelection;
};

const enterPort = function(groupSelection) {
  const circleSelection = groupSelection.append('circle');

  circleSelection
      .attr('id', (d) => 'UUID-' + d.id)
      .attr('class', 'port')
      .attr('r', thickness)
      .attr('cx', (d) => d.point[0])
      .attr('cy', (d) => d.point[1])
      .style('stroke-width', 0)
      .on('click', portClick)
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
};

const updatePort = function(circleSelection) {
  updatePortFill(circleSelection);
  updatePortVisible(circleSelection);

  return circleSelection;
};

const dataSelect = function(data) {
  if (data.selected) {
    delete data.selected;
  } else {
    data.selected = true;
  }
};

const nodeClick = function(e, d) {
  dataSelect(d);
  updateColor(d);
  updatePortVisible(d3.select(this).selectAll('.port'));
  e.stopPropagation();
};

const portClick = function(e, d) {
  dataSelect(d);
  updateColor(d);
  console.log(env);
  e.stopPropagation();
};

const edgeClick = function(e, d) {
  dataSelect(d);
  updateColor(d);
  e.stopPropagation();
};

const updateNodeFill = function(circleSelection) {
  circleSelection
      .style('fill', function(d) {
        if ('name' in d) {
          if (d.selected) {
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
};

const updateColor = function(data) {
  switch (data.type) {
    case 'node':
      updateNodeFill(nodeSelection.selectAll('#UUID-' + data.id).select('circle'));
      break;
    case 'port':
      updatePortFill(nodeSelection.selectAll('#UUID-' + data.id));
      break;
    case 'edge':
      updateEdgeStroke(edgeSelection.selectAll('#UUID-' + data.id));
      break;
  }
};

const updateNodeText = function(textSelection) {
  textSelection.text(function(d) {
    // if (d.value != null) {
    //   return d.value.toString();
    // } else
    if ('operator' in d) {
      return hyperlogarithmicOperations[d.operator].commutation.symbol;
    } else {
      return d.name;
    }
  });

  return textSelection;
};

const updateName = function(data) {
  switch (data.type) {
    case 'node':
      updateNodeText(nodeSelection.selectAll('g').selectAll('text'));
      updateNodeFill(nodeSelection.selectAll('#UUID-' + data.id).select('circle'));
      break;
  }
};

const enterNode = function(selection) {
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

  updateNodeText(groupSelection.append('text'));

  groupSelection
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
};

const updateNode = function(groupSelection) {
  updateNodeFill(groupSelection.select('.nodeCircle'));

  return groupSelection;
};

const update = function() {
  equationSelection.property('value', '');
  calculationSelection.property('value', '');

  edgeSelection
      .selectAll('.edge')
      .data(Object.entries(env).filter((a) => a[1].type == 'edge').map((a) => a[1]), (edge) => edge.id)
      .join(enterEdge, updateEdge);

  nodeSelection
      .selectAll('.node')
      .data(Object.entries(env).filter((a) => a[1].type == 'node').map((a) => a[1]), (node) => node.id)
      .join(enterNode, updateNode);
};

const selectGraph = function(outerId, innerId) {
  const outer = graphs[outerId];
  const inner = outer[innerId];

  Object.keys(env).forEach((key) => delete env[key]);

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
};

const graphSelection = d3.select('#graphSelect');

const optgroups = graphSelection
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

graphSelection
    .on('change', function() {
      const selectedOption = d3.select(this).property('value');

      const [outerId, innerId] = JSON.parse(selectedOption);

      selectGraph(outerId, innerId);
      update();
    });

selectGraph('one', 'identity');
update();
