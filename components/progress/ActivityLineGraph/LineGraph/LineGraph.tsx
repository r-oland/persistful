import React, { useContext, useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { useDimensions } from 'hooks/useDimensions';
import { useDeepComparison } from 'hooks/useDeepComparison';
import { ProgressContext } from 'pages/progress';
import styles from './LineGraph.module.scss';
import { ActivityLineGraphContext } from '../ActivityLineGraph';
import {
  renderAxes,
  renderCircles,
  renderGoalLine,
  renderLine,
} from './renderMethods';
import Cursor, { useHandleCursorLogic } from './Cursor';

const MARGIN = { top: 30, right: 30, bottom: 30, left: 40 };

export default function LineGraph() {
  const { activities } = useContext(ActivityLineGraphContext);
  const { daysSum } = useContext(ActivityLineGraphContext);
  const { scrollRef } = useContext(ProgressContext);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGSVGElement | null>(null);
  const goalLineRef = useRef<SVGSVGElement | null>(null);
  const lineRef = useRef<SVGSVGElement | null>(null);
  const axesRef = useRef<SVGSVGElement | null>(null);

  const { width, height } = useDimensions({ current: wrapperRef.current }, [
    activities.length,
  ]);

  // bounds = area inside the graph axis = calculated by subtracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const data = daysSum.map((day, index) => ({
    x: index,
    y: day.sum,
  }));

  // Y axis
  const [min, max] = d3.extent(data, (d) => d.y);
  const maxHours = Math.ceil((max || 0) / 60); // Convert max minutes to hours and round up
  const minHours = Math.floor((min || 0) / 60); // Convert min minutes to hours and round down
  const yAxisMax = maxHours * 60; // Convert max hours back to minutes
  const yAxisMin = minHours * 60; // Convert min hours back to minutes

  const yScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([yAxisMin || 0, yAxisMax || 0])
        .range([boundsHeight, 0]),
    [data, height]
  );

  // X axis
  const [, xMax] = d3.extent(data, (d) => d.x);
  const xScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, xMax || 0])
        .range([0, boundsWidth]),
    [data, width]
  );

  const { cursorPosition, setCursorPosition, onMouseMove } =
    useHandleCursorLogic(xScale, yScale, data);

  useEffect(() => {
    renderAxes(axesRef, yScale, boundsWidth, yAxisMax, yAxisMin);
    renderGoalLine(goalLineRef, xScale, yScale, daysSum);
    renderLine(lineRef, data, xScale, yScale, boundsWidth, boundsHeight);
    renderCircles(circleRef, data, xScale, yScale, daysSum, width);
  }, [useDeepComparison(daysSum), boundsWidth, boundsHeight]);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <svg width={width} height={height} className={styles.graph}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        >
          <g width={boundsWidth} height={boundsHeight} ref={axesRef} />
          <g width={boundsWidth} height={boundsHeight} ref={goalLineRef} />
          <g width={boundsWidth} height={boundsHeight} ref={lineRef} />
          <g width={boundsWidth} height={boundsHeight} ref={circleRef} />
          {cursorPosition !== null && (
            <Cursor height={boundsHeight} position={cursorPosition} />
          )}
          <rect
            x={0}
            y={0}
            width={boundsWidth}
            height={boundsHeight}
            onMouseMove={onMouseMove}
            onMouseLeave={() => setCursorPosition(null)}
            onTouchMove={onMouseMove}
            onTouchStart={() => {
              // Lock scroll position
              if (scrollRef.current)
                scrollRef.current.style.overflow = 'hidden';
            }}
            onTouchEnd={() => {
              // Unlock scroll position
              if (scrollRef.current) scrollRef.current.style.overflow = 'auto';
              setCursorPosition(null);
            }}
            visibility="hidden"
            pointerEvents="all"
          />
        </g>
      </svg>
    </div>
  );
}
