"use strict";

import { graphs } from './graphs.js';

const width = 1024;
const height = 1024;
const thickness = 16;
const spacing = 128;

var graph;

function graphId(d) {
  return d.name;
}

// A custom comparable would be preferable, but d3 uses a key
// Consider: https://d3js.org/d3-array/intern
function pointId(id) {
  return JSON.stringify(id);
}

function nodeId(d) {
  return pointId(d.id);
}

function edgeId(d) {
  return pointId([d.source, d.target]);
}

const equation = d3.select("#equation");

const display = d3.select("#display");

function graphClick() {
  graph.clickedNode = null;
  update();
}

const svg = display.append("svg")
  .attr("width", width)
  .attr("height", height)
  .on("click", graphClick);

const defs = svg.append("defs");

// http://xn--dahlstrm-t4a.net/svg/filters/arrow-with-dropshadow-lighter.svg
// https://github.com/wbzyl/d3-notes/blob/master/hello-drop-shadow.html
const filter = defs.append("filter")
  .attr("id", "drop-shadow");

filter.append("feGaussianBlur")
  .attr("in", "SourceGraphic")
  .attr("stdDeviation", 2)
  .attr("result", "blur");

const feComponentTransfer = filter.append("feComponentTransfer")
  .attr("result", "alphaBlur");

feComponentTransfer.append("feFuncA")
  .attr("type", "linear")
  .attr("slope", "0.5");

filter.append("feOffset")
  .attr("in", "alphaBlur")
  .attr("dx", 4)
  .attr("dy", 4)
  .attr("result", "offsetBlur");

const feMerge = filter.append("feMerge");

feMerge.append("feMergeNode")
  .attr("in", "offsetBlur");

feMerge.append("feMergeNode")
  .attr("in", "SourceGraphic");

const image = svg.append("g")
  .attr("id", "image")
  .style("filter", "url(#drop-shadow)");

function edgeToggle(edge, on) {
  if (edge.selected === on) {
    return;
  }

  edge.selected = on;

  nodeToggle(edge.source, on);
  nodeToggle(edge.target, on);
}

function nodeToggle(nodeId, on) {
  const node = graph.nodes.find(function(n) { return pointId(n.id) == pointId(nodeId) });
  if (node != null && node.operator) {
    node.selected = on;
  }

  if (node == null || node.operator || node.name != null) {
    graph.edges.forEach(function(e) {
      if (pointId(e.source) == pointId(nodeId) || pointId(e.target) == pointId(nodeId)) {
        edgeToggle(e, on);
      }
    });
  }
}

function edgeOver(e, d, i) {
  edgeToggle(d, true);
  update(); // flush to DOM
  equation.text(d.equation); // Consider coercing null to empty string
}

function edgeOut(e, d, i) {
  equation.text("");
  edgeToggle(d, false);
  update(); // flush to DOM
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
    center[1] + cursorToCenter[1] * ratio
  ];
}

function createIter() {
  var n = graph.availableIters.pop();
  if (n == null) {
    n = graph.nextIter;
    graph.nextIter += 1;
  }
  return n;
}

// TODO: push in sorted order for better experience
function destroyIter(n) {
  graph.availableIters.push(n);
}

function edgeClick(e, d, i) {
  edgeOut(e, d, i);

  const cursor = [e.offsetX / spacing, e.offsetY / spacing]

  var point;
  if (d.center != null) {
    point = curvePosition(cursor, d.center, d.radius);
  } else {
    point = linePosition(cursor, d.source, d.target);
  }

  graph.nodes.push({
    id: point,
    iter: createIter()
  });

  // d3.select(this).exit()

  for (var i = graph.edges.length - 1; i >= 0; i--) {
    const edge = graph.edges[i];
    if (pointId(edge.source) == pointId(d.source) && pointId(edge.target) == pointId(d.target)) {
      graph.edges.splice(i, 1);
    }
  }

  graph.edges.push({
    source: d.source,
    target: point,
    center: d.center,
    radius: d.radius,
  });

  graph.edges.push({
    source: point,
    target: d.target,
    center: d.center,
    radius: d.radius,
  });

  update();
}

function enterEdge(selection) {
  return selection
    .insert("path", ":first-child")
    .attr("class", "edge")
    .attr("d", function(d) {
      if (d.center != null) {
        const radius = d.radius;
        const sourceAngle = Math.atan2(d.source[1] - d.center[1], d.source[0] - d.center[0]);
        var targetAngle;
        if (pointId(d.source) == pointId(d.target)) {
          targetAngle = sourceAngle + (2 * Math.PI);
        } else {
          targetAngle = Math.atan2(d.target[1] - d.center[1], d.target[0] - d.center[0]);
        }

        const path = d3.path();
        path.arc(
          d.center[0] * spacing,
          d.center[1] * spacing,
          radius * spacing,
          sourceAngle,
          targetAngle
        );
        return path.toString();
      } else {
        const sx = (d.source[0] * spacing).toString();
        const sy = (d.source[1] * spacing).toString();
        const tx = (d.target[0] * spacing).toString();
        const ty = (d.target[1] * spacing).toString();
        return "M " + sx + " " + sy + " L " + tx + " " + ty;
      }
    })
    .attr("fill", "none")
    .attr("stroke-width", thickness)
    .attr("stroke", function(d) {
      if (d.selected) {
        return "#FFC3BF";
      } else {
        return "#FF928B";
      }
    })
    .on("mouseover", edgeOver)
    .on("mouseout", edgeOut)
    .on("click", edgeClick);
}

function updateEdge(selection) {
  return selection
   .attr("stroke", function(d) {
      if (d.selected) {
        return "#FFC3BF";
      } else {
        return "#FF928B";
      }
   });
}

function enterNode(enter) {
  const group = enter.append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
      return "translate(" + d.id[0] * spacing + "," + d.id[1] * spacing + ")";
    })
    .on("mouseover", nodeOver)
    .on("mouseout", nodeOut)
    .on("click", nodeClick);

  group.append("circle")
    .attr("class", "nodeCircle")
    .attr("r", thickness * 2)
    .style("fill", function(d) {
      if (d.operator) {
        if (d.selected) {
          return "#FFC3BF";
        } else {
          return "#FF928B";
        }
      } else {
        if (pointId(d.id) === graph.clickedNode) {
          return "#DFFFD1";
        } else {
          return "#CDEAC0";
        }
      }
    });

  group.append("text")
    .text(function (d) {
      if (d.value != null) {
        return d.value.toString();
      } else if (d.iter != null) {
        return String.fromCharCode(97 + d.iter);
      } else {
        return d.name;
      }
    })
    .style("font-family", "Roboto Mono, sans-serif")
    .style("font-weight", "bold")
    .style("text-anchor", "middle")
    .style("dominant-baseline", "middle");

  return group;
}

function updateNode(selection) {
  selection.select("circle")
    .style("fill", function(d) {
      if (d.operator) {
        if (d.selected) {
          return "#FFC3BF";
        } else {
          return "#FF928B";
        }
      } else {
        if (pointId(d.id) === graph.clickedNode) {
          return "#DFFFD1";
        } else {
          return "#CDEAC0";
        }
      }
    });

  return selection;
}

function update() {
  image
    .selectAll(".edge")
    .data(graph.edges, edgeId)
    .join(enterEdge, updateEdge);

  image
    .selectAll(".node")
    .data(graph.nodes, nodeId)
    .join(enterNode, updateNode);
}

function nodeOver(e, d) {
  d.value += 1;

  d3.select(this)
    .select("circle")
    .transition()
    .duration(2000)
    .attr("r", thickness * 4)
}

function nodeOut(e, d) {
  d3.selectAll(".nodeCircle")
    .transition()
    .duration(1000)
    .attr("r", thickness * 2);
}

function nodeClick(e, d) {
  const id = pointId(d.id)
  if (graph.clickedNode === id) {
    // this deletes the DOM element but not the data
    // d3.select(this).remove();

    for (var i = graph.nodes.length - 1; i >= 0; i--) {
      const node = graph.nodes[i];
      if (pointId(node.id) == id) {
        if (node.iter != null) {
          destroyIter(node.iter)
        }
        graph.nodes.splice(i, 1);
      }
    }
  } else {
    graph.clickedNode = pointId(d.id);
  }
  update();

  e.stopPropagation();
}

function selectGraph(edgesName, nodesName) {
  const selectedEdges = graphs.find(function(e) { return e.name == edgesName });

  let edges;
  if (selectedEdges) {
    edges = selectedEdges;
  } else {
    edges = graphs[0];
  }

  const selectedNodes = Object.entries(edges.nodes).find(function(n) { return n[0] == nodesName });

  let nodes;
  if (selectedNodes) {
    nodes = selectedNodes[1];
  } else {
    nodes = Object.entries(edges.nodes)[0][1];
  }

  // Graph is mutable
  // Node and edge array is mutable
  // Nodes and edges are immutable
  graph = {
    nodes: [],
    edges: [],
    nextIter: 0,
    availableIters: [],
  }

  nodes.forEach(function(node) {
    const n = Object.assign({}, node);
    if (n.name == null) {
      n.iter = createIter();
    }
    graph.nodes.push(n);
  });
  edges.edges.forEach(edge => graph.edges.push(Object.assign({}, edge)));
}

const graphSelect = d3.select("#graphSelect")

const optgroups = graphSelect
  .selectAll("optgroup")
  .data(graphs)
  .join((enter) => enter
    .append("optgroup")
    .attr("label", graphId) // graph identifier
  );

optgroups.each(function (graph) {
  d3.select(this)
    .selectAll('option')
    .data(Object.keys(graph.nodes))
    .join((enter) => enter
      .append("option")
      .text(nodeId => nodeId)
      .attr("value", nodeId => JSON.stringify([graph.name, nodeId]))
    );
});

graphSelect
  .on("change", function() {
    const selectedOption = d3.select(this).property("value");

    const [graphId, nodeId] = JSON.parse(selectedOption);

    // Hack - updating nodes in place is currently broken
    // TODO: give all elements unique ids
    graph.nodes = [];
    graph.edges = [];
    graph.nextIter = 0;
    graph.availableIters = [];
    graph.clickedNode = null;

    update();

    equation.text("");
    selectGraph(graphId, nodeId);
    update();
  });

selectGraph(null, null);
update();
