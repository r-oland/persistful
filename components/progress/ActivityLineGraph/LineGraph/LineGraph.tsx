import React, { useContext, useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { useDimensions } from 'hooks/useDimensions';
import styles from './LineGraph.module.scss';
import { ActivityLineGraphContext } from '../ActivityLineGraph';
import { renderAxes, renderCircles, renderLine } from './renderMethods';

const MARGIN = { top: 30, right: 30, bottom: 30, left: 40 };

export default function LineGraph() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { activities } = useContext(ActivityLineGraphContext);
  const { daysSum } = useContext(ActivityLineGraphContext);

  const { width, height } = useDimensions({ current: wrapperRef.current }, [
    activities.length,
  ]);

  const data = daysSum.map((day, index) => ({
    x: index,
    y: day.sum,
  }));

  const circleRef = useRef<SVGSVGElement | null>(null);
  const lineRef = useRef<SVGSVGElement | null>(null);

  // bounds = area inside the graph axis = calculated by subtracting the margins
  const axesRef = useRef<SVGSVGElement | null>(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Y axis
  const [, max] = d3.extent(data, (d) => d.y);
  const maxHours = Math.ceil((max || 0) / 60); // Convert max minutes to hours and round up
  const yAxisMax = maxHours * 60; // Convert max hours back to minutes

  const yScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, yAxisMax || 0])
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

  useEffect(() => {
    renderAxes(axesRef, yScale, boundsWidth, yAxisMax);
    renderLine(lineRef, data, xScale, yScale);
    renderCircles(circleRef, data, xScale, yScale, daysSum, width);
  }, [yScale, boundsHeight]);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <svg width={width} height={height} className={styles.graph}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          ref={axesRef}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        />
        <g
          width={boundsWidth}
          height={boundsHeight}
          ref={lineRef}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        />
        <g
          width={boundsWidth}
          height={boundsHeight}
          ref={circleRef}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        />
      </svg>
    </div>
  );
}
