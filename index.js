// d3.js style does not follow jslint rules
/* eslint-disable no-invalid-this */

'use strict';

import graphs from './graphs.js';

import {
  shiftFloatValue, shiftFloatCtx,
  shiftStringValue, shiftStringCtx,
  evaluateF, z,
} from './evaluate.js';

const thickness = 1 / 16;

const nodes = {};
const edges = {};

let grid = false;

let hovered;
let dragged;

const calculateF = evaluateF({
  unit: (stack) => {
    const node = nodes[stack[0]];
    if ('float' in node) {
      return {
        'shift': 0,
        'float': node.float,
      };
    }

    return undefined;
  },
  env: (nodeId) => nodes[nodeId].env,
  ...shiftFloatCtx,
});

const calculate = z(calculateF);

const equateF = evaluateF({
  unit: (stack) => {
    const node = nodes[stack[0]];
    if ('name' in node) {
      return {
        'shift': 0,
        'string': node.name,
      };
    }

    return undefined;
  },
  env: (nodeId) => nodes[nodeId].env,
  ...shiftStringCtx,
});
const equate = z(equateF);

const displaySelection = d3.select('#display');

const gridCheckboxSelection = d3.select('#gridCheckbox');

gridCheckboxSelection
    .on('click', () => {
      grid = gridCheckboxSelection.property('checked');
    });

const setParagraphSelection = (id, defaultText) => {
  const selection = d3.select(id);

  const f = (text) => {
    if (text === undefined) {
      return selection
          .style('font-style', 'italic')
          .text(defaultText);
    } else {
      return selection
          .style('font-style', null)
          .text(text);
    }
  };

  f(selection, null);

  return f;
};

const setEquation = setParagraphSelection('#equation', 'equation');
const setCalculation = setParagraphSelection('#calculation', 'calculation');

const handleZoom = function(e) {
  d3.select('#image')
      .attr('transform', e.transform);
};

const zoom = d3.zoom()
    .on('zoom', handleZoom);

const createNode = function(e) {
  const transform = d3.zoomTransform(this);
  const point = transform.invert(d3.pointer(e, this));

  const nodeId = crypto.randomUUID();
  const node = {
    point: point,
    env: {
    },
  };

  nodes[nodeId] = node;

  // This calls methods that are not defined yet
  // Consider moving later in file
  nodeSelection
      .selectAll('#UUID_' + nodeId)
      .data([[nodeId, node]], entryKey)
      .join(enterNode, updateNode);
};

// https://www.d3indepth.com/zoom-and-pan/
const svgSelection = displaySelection
    .append('svg')
    .attr('width', '100vw')
    .attr('height', '100vh')
    .attr('display', 'block')
    .call(zoom)
    .on('dblclick.zoom', createNode);

const imageSelection = svgSelection
    .append('g')
    .attr('id', 'image')
    .style('pointer-events', 'all');

const edgeSelection = imageSelection
    .append('g')
    .attr('id', 'edges');

const nodeSelection = imageSelection
    .append('g')
    .attr('id', 'nodes');

const nodeOver = function(e, d, i) {
  const equation = shiftStringValue(equate([d[0]]));
  setEquation(equation);

  const calculation = shiftFloatValue(calculate([d[0]]));
  setCalculation(calculation);
};

const nodeOut = function(e, d, i) {
  setCalculation(undefined);
  setEquation(undefined);
};

const entryId = (entry) => 'UUID_' + entry[0];
const entryKey = (entry) => '#UUID_' + entry[0];

const updateEdgePoints = function(lineSelection) {
  // Consider functions that return a constant distance from endpoints

  return lineSelection.each(function(d) {
    const from = d[1][0];
    const to = d[1][1];

    const deltaX = to.node.point[0] - from.node.point[0];
    const deltaY = to.node.point[1] - from.node.point[1];

    // Consider case where delta < radius * 2
    let radiusX = 1 / 4;
    let radiusY = 1 / 4;
    if (deltaX === 0) {
      radiusX = 0;
    } else if (deltaY === 0) {
      radiusY = 0;
    } else {
      radiusX = radiusX / Math.sqrt((deltaY / deltaX) ** 2 + 1);
      radiusY = radiusY / Math.sqrt((deltaX / deltaY) ** 2 + 1);
    }

    if (deltaX < 0) {
      radiusX = -radiusX;
    }

    if (deltaY < 0) {
      radiusY = -radiusY;
    }

    let fromX = from.node.point[0];
    let fromY = from.node.point[1];
    if (from.op) {
      fromX = fromX + radiusX;
      fromY = fromY + radiusY;
    }

    let toX = to.node.point[0];
    let toY = to.node.point[1];
    if (to.op) {
      toX = toX - radiusX;
      toY = toY - radiusY;
    }

    return d3.select(this)
        .attr('x1', fromX)
        .attr('y1', fromY)
        .attr('x2', toX)
        .attr('y2', toY);
  });
};

const edgePrompt = function(event, d) {
  event.stopPropagation();

  const value = confirm('Delete?');

  if (value) {
    const edgeId = d[0];
    const [aId, bId] = edgeId.split('_');
    const [a, b] = d[1];

    delete a.node.env[bId];
    delete b.node.env[aId];
    delete edges[edgeId];

    edgeSelection
        .selectAll('#UUID_' + edgeId)
        .data([], entryKey)
        .join(enterEdge, updateEdge);
  }
};

const enterEdge = function(selection) {
  const lineSelection = selection.append('line');

  lineSelection
      .attr('id', entryId)
      .attr('fill', 'none')
      .attr('pointer-events', 'stroke')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', thickness)
      .style('stroke', '#FF928B')
      .on('dblclick', edgePrompt);

  updateEdgePoints(lineSelection);

  return lineSelection;
};

const updateEdge = function(lineSelection) {
  return updateEdgePoints(lineSelection);
};

// Respond to right click
// https://github.com/d3/d3-drag/blob/v3.0.0/src/drag.js#L8-L11
// const dragFilter = function(event) {
//   return !event.ctrlKey && (event.button !== 0 || event.button !== 2);
// };

const updateNodePoint = function(groupSelection) {
  return groupSelection
      .attr('transform', (d) => 'translate(' + d[1].point.join(',') + ')');
};

const modifyNodePoint = function(event, d) {
  const [nodeId, node] = d;

  node.point = [event.x, event.y];

  if (grid) {
    node.point = node.point.map((a) => Math.round(a));
  }

  updateNodePoint(nodeSelection.selectAll('#UUID_' + nodeId));

  const edgeIds = [];
  for (const toId of Object.keys(node.env)) {
    // TODO: vulnerable to injection
    const edgeId = '#UUID_' + [nodeId, toId].sort().join('_');
    edgeIds.unshift(edgeId);
  }

  if (edgeIds.length > 0) {
    updateEdgePoints(edgeSelection.selectAll(edgeIds.join(',')));
  }
};

const nodeDragStarted = function(event, d) {
  if (hovered === undefined) {
    console.warn(console.trace());
    return;
  }

  dragged = hovered;
};

const nodeDragged = function(event, d) {
  // TODO: draw line
};

const nodeDragEnded = function(event, d) {
  if (dragged === undefined) {
    console.warn(console.trace());
    return;
  }

  if (hovered === undefined || hovered[0] === dragged[0]) {
    modifyNodePoint(event, [dragged[0], nodes[dragged[0]]]);
    dragged = undefined;
    return;
  }

  const modified = [
    hovered,
    dragged,
  ].sort((a, b) => a[0].localeCompare(b[0]));

  const edgeId = modified.map((a) => a[0]).join('_');
  const edge = modified.map((a) => ({node: nodes[a[0]], op: a[1]}));

  nodes[hovered[0]].env[dragged[0]] = hovered[1];
  nodes[dragged[0]].env[hovered[0]] = dragged[1];

  edges[edgeId] = edge;

  edgeSelection
      .selectAll('#UUID_' + edgeId)
      .data([[edgeId, edge]], entryKey)
      .join(enterEdge, updateEdge);

  dragged = undefined;
};

const updateNodeCircleFill = function(circleSelection) {
  circleSelection
      .style('fill', function(d) {
        if ('name' in d[1] || 'float' in d[1]) {
          if ('selected' in d[1]) {
            return '#DFFFD1';
          } else {
            return '#CDEAC0';
          }
        } else {
          if ('selected' in d[1]) {
            return '#FFC3BF';
          } else {
            return '#FF928B';
          }
        }
      });

  return circleSelection;
};

const updateNodeCircleVisibility = function(circleSelection) {
  circleSelection
      .style('visibility', function(d) {
        if ('selected' in d[1]) {
          return null;
        } else {
          return 'hidden';
        }
      });

  return circleSelection;
};

const innerOver = function(e, d, i) {
  hovered = [d[0], false];

  d[1].selected = false;
  updateNodeCircleFill(d3.select(this));
};

const innerOut = function(e, d, i) {
  hovered = undefined;

  delete d[1].selected;
  updateNodeCircleFill(d3.select(this));
};

const outerOver = function(e, d, i) {
  hovered = [d[0], true];

  d[1].selected = true;
  updateNodeCircleFill(d3.select(this));
  updateNodeCircleVisibility(d3.select(this));
};

const outerOut = function(e, d, i) {
  hovered = undefined;

  delete d[1].selected;
  updateNodeCircleFill(d3.select(this));
  updateNodeCircleVisibility(d3.select(this));
};

const nodePrompt = function(event, d) {
  event.stopPropagation();

  const value = prompt('Enter a name or value_');

  if (value === null) {
    return;
  }

  if (value === '') {
    delete d[1].name;
    delete d[1].float;
  } else {
    const float = parseFloat(value);
    if (isNaN(float)) {
      d[1].name = value;
    } else {
      d[1].float = float;
    }
  }
};

const enterNode = function(selection) {
  const groupSelection = selection.append('g')
      .attr('id', entryId)
      .attr('transform', (d) => 'translate(' + d[1].point.join(',') + ')')
      .attr('cursor', 'grab')
      // .on('contextmenu', (e) => e.preventDefault()); // respond to right-click
      .on('mouseover', nodeOver)
      .on('mouseout', nodeOut)
      .on('dblclick', nodePrompt);

  groupSelection.call(
      d3.drag()
          // .filter(dragFilter) // respond to right-click
          .on('start', nodeDragStarted)
          .on('drag', nodeDragged)
          .on('end', nodeDragEnded),
  );

  const outerSelection = groupSelection.append('circle')
      .attr('r', thickness * 4)
      .style('stroke-width', 0)
      .on('mouseover', outerOver)
      .on('mouseout', outerOut);

  updateNodeCircleFill(outerSelection);
  updateNodeCircleVisibility(outerSelection);

  const innerSelection = groupSelection.append('circle')
      .attr('r', thickness * 2)
      .style('stroke-width', 0)
      .on('mouseover', innerOver)
      .on('mouseout', innerOut);

  updateNodeCircleFill(innerSelection);

  groupSelection
      .style('font-family', 'Roboto Mono, sans-serif')
      .style('font-weight', 'bold')
      .style('font-size', '0.25px')
      .style('text-anchor', 'middle')
      .style('dominant-baseline', 'middle');

  return groupSelection;
};

const updateNode = function(groupSelection) {
  //
  // TODO: Why does the circle disappear without these?
  //
  const outerSelection = groupSelection.append('circle')
      .attr('r', thickness * 4)
      .style('stroke-width', 0)
      .on('mouseover', outerOver)
      .on('mouseout', outerOut);

  updateNodeCircleFill(outerSelection);
  updateNodeCircleVisibility(outerSelection);

  const innerSelection = groupSelection.append('circle')
      .attr('r', thickness * 2)
      .style('stroke-width', 0)
      .on('mouseover', innerOver)
      .on('mouseout', innerOut);

  updateNodeCircleFill(innerSelection);
  //
  // TODO: Replace with updates
  //

  updateNodePoint(groupSelection);

  return groupSelection;
};

const refresh = function() {
  setEquation(undefined);
  setCalculation(undefined);
  dragged = undefined;
  hovered = undefined;

  edgeSelection
      .selectAll('*')
      .data(Object.entries(edges), entryKey)
      .join(enterEdge, updateEdge);

  nodeSelection
      .selectAll('*')
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
    for (const [toId, fromOp] of Object.entries(from.env)) {
      // Consider supporting self reference
      if (fromId < toId) {
        const nodeIds = [fromId, toId];

        // TODO: vulnerable to injection
        const edgeId = nodeIds.join('_');

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
            return JSON.stringify([categoryPair[0], graphId]);
          }),
      );
});

const fitZoom = () => {
  const bounds = [
    [Infinity, Infinity],
    [-Infinity, -Infinity],
  ];

  for (const node of Object.values(nodes)) {
    const point = node.point;
    bounds[0][0] = Math.min(point[0], bounds[0][0]);
    bounds[0][1] = Math.min(point[1], bounds[0][1]);
    bounds[1][0] = Math.max(point[0], bounds[1][0]);
    bounds[1][1] = Math.max(point[1], bounds[1][1]);
  };

  bounds[0][0] = bounds[0][0] - 1;
  bounds[0][1] = bounds[0][1] - 1;
  bounds[1][0] = bounds[1][0] + 1;
  bounds[1][1] = bounds[1][1] + 1;

  const displayBounds = displaySelection.node().getBoundingClientRect();

  const ratio = Math.min(
      displayBounds.width / (bounds[1][0] - bounds[0][0]),
      displayBounds.height / (bounds[1][1] - bounds[0][1]),
  );

  const midpoint = [
    (bounds[1][0] + bounds[0][0]) / 2,
    (bounds[1][1] + bounds[0][1]) / 2,
  ];

  svgSelection
      .call(
          zoom.transform,
          d3.zoomIdentity
              .translate(displayBounds.width / 2, displayBounds.height / 2)
              .scale(ratio)
              .translate(-midpoint[0], -midpoint[1]),
      );
};

graphSelection
    .on('focus', function() {
      console.log({
        nodes: nodes,
        edges: edges,
      });
    })
    .on('change', function() {
      const selectedOption = d3.select(this).property('value');

      const [categoryId, graphId] = JSON.parse(selectedOption);

      selectGraph(categoryId, graphId);
      refresh();
      fitZoom();
    });

selectGraph('simple', 'one');
refresh();
fitZoom();
