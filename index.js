'use strict';

import {
  graphs
} from './graphs.js';

// import {hyperlogarithmicOperations} from './operations.js';
import {addToArray, objectIterable, objectsByIdsIterable} from './struct.js';
// import {envValueVisitF, envEquationVisitF, z} from './evaluate.js';

import {
  floatCtx, shiftValueToFloat, shiftCtx,
  evaluateF, z, undefinedF,
  graphEdges,
} from './evaluate.js';

const thickness = 1 / 16;
const scale = 256;

const nodes = {};
const edges = {};

let draggedNodeEntry;

const envEvaluateF = evaluateF((nodeId) => nodes[nodeId].env);
const floatEvaluateF = envEvaluateF(floatCtx);
const floatEvaluate = z(floatEvaluateF);
const floatVisitF = floatEvaluateF(nodes);

// const stringVisitF = stringEvaluateF(graph);

// const envObjectsByIdsIterable = objectsByIdsIterable(graph);

// const equationSelection = d3.select('#equation');
// const calculationSelection = d3.select('#calculation');
const displaySelection = d3.select('#display');

// equationSelection.on('input', function(d) {
//   const value = this.value;
//   Object.entries(env).forEach(function(entry) {
//     const data = entry[1];
//     if (data.selected) {
//       if (value === '') {
//         delete data.name;
//       } else {
//         data.name = value;
//       }
//       updateName(data);
//     }
//   });
// });

// calculationSelection.on('input', function(d) {
//   const value = this.value;
//   Object.entries(env).forEach(function(entry) {
//     const data = entry[1];
//     if (data.selected) {
//       const float = parseFloat(value);
//       if (isNaN(float)) {
//         delete data.float;
//       } else {
//         data.float = float;
//       }
//     }
//   });
// });

// const graphClick = function() {
//   Object.entries(graph).forEach((e) => delete e[1].selected);

//   updateNodeFill(nodeSelection.selectAll('.node').select('circle'));
//   updateEdgeStroke(edgeSelection.selectAll('.edge'));
// };

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
    .call(zoom.transform, d3.zoomIdentity.scale(scale));

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

// const equationVisit = z(equationVisitF)([]);
// const valueVisit = z(valueVisitF)([]);

const nodeOver = function(e, d, i) {
  // const equationResult = equationVisit(d.id);
  // if (equationResult === undefined || equationResult.name === undefined) {
  //   equationSelection.property('value', '');
  // } else {
  //   equationSelection.property('value', equationResult.name);
  // }
  // const valueResult = valueVisit(d.id);
  // if (valueResult === undefined) {
  //   calculationSelection.property('value', '');
  // } else {
  //   calculationSelection.property('value', valueResult);
  // }
};

const nodeOut = function(e, d, i) {
  // calculationSelection.property('value', '');
  // equationSelection.property('value', '');
};

const entryId = entry => 'UUID-' + entry[0];
const entryKey = entry => '#UUID-' + entry[0];

const updateEdgePoints = function(lineSelection) {
  // Consider functions that return a constant distance from point

  const fromX = d => {
    const from = d[1][0]
    const to = d[1][1]
    if (from.op) {
      return from.node.point[0] + ((to.node.point[0] - from.node.point[0]) / 4)
    } else {
      return from.node.point[0]
    }
  };

  const fromY = d => {
    const from = d[1][0]
    const to = d[1][1]
    if (from.op) {
      return from.node.point[1] + ((to.node.point[1] - from.node.point[1]) / 4)
    } else {
      return from.node.point[1]
    }
  };

  const toX = d => {
    const from = d[1][0]
    const to = d[1][1]
    if (to.op) {
      return to.node.point[0] + ((from.node.point[0] - to.node.point[0]) / 4)
    } else {
      return to.node.point[0]
    }
  };

  const toY = d => {
    const from = d[1][0]
    const to = d[1][1]
    if (to.op) {
      return to.node.point[1] + ((from.node.point[1] - to.node.point[1]) / 4)
    } else {
      return to.node.point[1]
    }
  };

  return lineSelection
    .attr("x1", fromX)
    .attr("y1", fromY)
    .attr("x2", toX)
    .attr("y2", toY);
};

const enterEdge = function(selection) {
  const lineSelection = selection.append('line')

  lineSelection
      .attr('id', entryId)
      .attr('fill', 'none')
      .attr('pointer-events', 'stroke')
      .attr('stroke-linecap', "round")
      .attr('stroke-width', thickness)
      .style("stroke", "#FF928B");

  updateEdgePoints(lineSelection)

  return lineSelection;
};

const updateEdge = function(lineSelection) {
  return updateEdgePoints(lineSelection);
};

// Respond to right click
// https://github.com/d3/d3-drag/blob/v3.0.0/src/drag.js#L8-L11
const dragFilter = function(event) {
  return !event.ctrlKey && (event.button !== 0 || event.button !== 2);
};

const updateNodePoint = function(groupSelection) {
  return groupSelection
    .attr('transform', d => 'translate(' + d[1].point.join(',') + ')');
};

const modifyNodePoint = function(event, d) {
  const [nodeId, node] = d;

  node.point = [event.x, event.y];

  updateNodePoint(nodeSelection.selectAll('#UUID-' + nodeId));

  const edgeIds = [];
  for (const [toId] of Object.keys(node.env)) {
    // TODO: vulnerable to injection
    const edgeId = "#UUID-" + [nodeId, toId].sort().join('-');
    edgeIds.unshift(edgeId);
  }

  if (edgeIds.length > 0) {
    updateEdgePoints(edgeSelection.selectAll(edgeIds.join(',')));
  }
};

// https://stackoverflow.com/questions/28102089/simple-graph-of-nodes-and-links-without-using-force-layout
const nodeDragStarted = function(event, d) {
  draggedNodeEntry = d;

  nodeSelection
    .selectAll('#UUID-' + draggedNodeEntry[0])
    .attr('cursor', 'grabbing');
};

const nodeDragged = function(event, d) {
  if (draggedNodeEntry === undefined) {
    modifyNodePoint(event, d);
  } else {
    modifyNodePoint(event, draggedNodeEntry);
  }
};

const nodeDragEnded = function(event, d) {
  nodeSelection
    .selectAll('#UUID-' + draggedNodeEntry[0])
    .attr('cursor', 'grab');

  draggedNodeEntry = undefined;
};

const updateNodeCircleFill = function(circleSelection) {
  circleSelection
      .style('fill', function(d) {
        if (d.selected) {
          return '#FFC3BF';
        } else {
          return '#FF928B';
        }
      });

  return circleSelection;
};

// const enterNodeCircle = function(groupSelection) {
//   return groupSelection.append('circle')
//       .attr('r', thickness * 2)
//       .style('stroke-width', 0);
// }

// const updateNodeCircle = updateNodeCircleFill

const enterNode = function(selection) {
  const groupSelection = selection.append('g')
      .attr('id', entryId)
      .attr('transform', d => 'translate(' + d[1].point.join(',') + ')')
      // .on('contextmenu', (e) => e.preventDefault()); // respond to right-click
      .on('mouseover', nodeOver)
      .on('mouseout', nodeOut);

  groupSelection.call(
      d3.drag()
          //.filter(dragFilter) // respond to right-click
          .on('start', nodeDragStarted)
          .on('drag', nodeDragged)
          .on('end', nodeDragEnded),
  );

  const circleSelection = groupSelection.append('circle')
      .attr('r', thickness * 2)
      .style('stroke-width', 0);

  updateNodeCircleFill(circleSelection);

  groupSelection
      .style('font-family', 'Roboto Mono, sans-serif')
      .style('font-weight', 'bold')
      .style('font-size', '0.25px')
      .style('text-anchor', 'middle')
      .style('dominant-baseline', 'middle');

  return groupSelection;
};

const updateNode = function(groupSelection) {
  // TODO: Why does the circle disappear without this?
  const circleSelection = groupSelection.append('circle')
        .attr('r', thickness * 2)
        .style('stroke-width', 0);
  updateNodeCircleFill(circleSelection);

  // updateNodeCircleFill(groupSelection.select('circle'));
  updateNodePoint(groupSelection);

  return groupSelection;
};

const refresh = function() {
  // equationSelection.property('value', '');
  // calculationSelection.property('value', '');

  edgeSelection
    .selectAll("*")
    .data(Object.entries(edges), entryKey)
    .join(enterEdge, updateEdge);

  nodeSelection
    .selectAll("*")
    .data(Object.entries(nodes), entryKey)
    .join(enterNode, updateNode);
};

const selectGraph = function(categoryId, graphId) {
  const category = graphs[categoryId];
  const graph = category[graphId];

  Object.keys(nodes).forEach((key) => delete nodes[key]);
  for (const [nodeId, node] of Object.entries(graph)) {
    nodes[nodeId] = Object.assign({}, node);
  };

  Object.keys(edges).forEach((key) => delete edges[key]);
  for (const [fromId, from] of Object.entries(nodes)) {
    for (const [toId, fromOp] of Object.keys(from.env)) {
      // Consider supporting self reference
      if (fromId < toId) {
        const nodeIds = [fromId, toId];

        // TODO: vulnerable to injection
        const edgeId = nodeIds.join('-');

        const to = nodes[toId];
        const toOp = to.env[fromId];

        edges[edgeId] = [
          {
            node: from,
            op: fromOp,
          },
          {
            node: to,
            op: toOp,
          },
        ];
      }
    }
  }
};

const graphSelection = d3.select('#graphSelect');

const optgroups = graphSelection
    .selectAll('optgroup')
    .data(Object.entries(graphs))
    .join((enter) => enter
        .append('optgroup')
        .attr('label', (categoryPair) => categoryPair[0]),
    );

optgroups.each(function(categoryPair) {
  d3.select(this)
      .selectAll('option')
      .data(Object.keys(categoryPair[1]))
      .join((enter) => enter
          .append('option')
          .text((graphId) => graphId)
            .attr('value', (graphId) => {
              return JSON.stringify([categoryPair[0], graphId])
            }),
      );
});

graphSelection
    .on('change', function() {
      const selectedOption = d3.select(this).property('value');

      const [categoryId, graphId] = JSON.parse(selectedOption);

      selectGraph(categoryId, graphId);
      refresh();
    });

selectGraph('simple', 'one');
refresh();
