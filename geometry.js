function centerPoint(sourcePoint, sourceSlope, targetPoint) {
  const sumPoint = [
    (sourcePoint[0] + targetPoint[0]),
    (sourcePoint[1] + targetPoint[1]),
  ];

  const midPoint = [
    sumPoint[0] / 2,
    sumPoint[1] / 2,
  ];

  const midSlope = (midPoint[1] - sourcePoint[1]) / (midPoint[0] - sourcePoint[0]);

  if (sourceSlope == midSlope) { // straight
    return midPoint;
  }

  const sourceTangentSlope = -1 / sourceSlope;
  const midTangentSlope = -1 / midSlope;

  if (!isFinite(sourceTangentSlope)) { // vertical
    return [
      sourcePoint[0],
      midTangentSlope * sourcePoint[0] + (midPoint[1] - midTangentSlope * midPoint[0]),
    ];
  } else if (!isFinite(midTangentSlope)) { // vertical
    return [
      midPoint[0],
      sourceTangentSlope * midPoint[0] + (sourcePoint[1] - sourceTangentSlope * sourcePoint[0]),
    ];
  } else {
    // y-intercepts
    const sourceIntercept = sourcePoint[1] - sourceTangentSlope * sourcePoint[0];
    const midIntercept = midPoint[1] - midTangentSlope * midPoint[0];

    const x = (midIntercept - sourceIntercept) / (sourceTangentSlope - midTangentSlope);
    const y = sourceTangentSlope * x + sourceIntercept;

    return [x, y];
  }
}

function targetSlope(centerPoint, targetPoint) {
  const targetTangentSlope = (centerPoint[1] - targetPoint[1]) / (centerPoint[0] - targetPoint[0]);

  return -1 / targetTangentSlope;
}

export {centerPoint, targetSlope};
