// Components==============
import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ProgressContext } from 'pages/progress';
import { DataPoint } from './renderMethods';
import { ActivityLineGraphContext } from '../ActivityLineGraph';
// =========================

export const useHandleCursorLogic = (
  xScale: d3.ScaleLinear<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  data: DataPoint[]
) => {
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
    index: number;
  } | null>(null);

  const getClosestPoint = (cursorPixelPosition: number) => {
    const x = xScale.invert(cursorPixelPosition);

    let minDistance = Infinity;
    let closest: DataPoint | null = null;

    // eslint-disable-next-line no-restricted-syntax
    for (const point of data) {
      const distance = Math.abs(point.x - x);
      if (distance < minDistance) {
        minDistance = distance;
        closest = point;
      }
    }

    return closest;
  };

  function onMouseMove(e: React.MouseEvent | React.TouchEvent) {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = clientX - rect.left;

    const closest = getClosestPoint(mouseX);
    if (!closest) return;

    setCursorPosition({
      x: xScale(closest.x),
      y: yScale(closest.y),
      index: closest.x,
    });
  }

  const { daysSum } = useContext(ActivityLineGraphContext);
  const { setHighlightedDay } = useContext(ProgressContext);

  useEffect(() => {
    if (cursorPosition?.index === undefined)
      return setHighlightedDay(undefined);

    const day = daysSum[cursorPosition.index];
    setHighlightedDay(day.date);
  }, [cursorPosition?.index]);

  return { cursorPosition, setCursorPosition, onMouseMove };
};

export default function Cursor({
  position,
  height,
}: {
  position: { x: number; y: number };
  height: number;
}) {
  const extraHeight = 4;
  const strokeWidth = 7;
  const halfStrokeWidth = strokeWidth / 2;
  const radius = 1;

  const path = `
    M ${position.x - halfStrokeWidth} ${position.y - extraHeight + radius}
    a ${radius} ${radius} 0 0 1 ${radius} -${radius}
    H ${position.x + halfStrokeWidth - radius}
    a ${radius} ${radius} 0 0 1 ${radius} ${radius}
    V ${height}
    H ${position.x - halfStrokeWidth}
    Z
  `;

  return (
    <motion.path
      d={path}
      fill="#18e597"
      opacity={0.2}
      animate={{ d: path }}
      transition={{ duration: 0.2 }}
    />
  );
}
