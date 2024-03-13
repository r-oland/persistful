import React, { useContext, useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { useDimensions } from 'hooks/useDimensions';
import styles from './LineGraph.module.scss';
import { ActivityLineGraphContext } from '../ActivityLineGraph';

const MARGIN = { top: 20, right: 20, bottom: 35, left: 40 };

type DataPoint = { x: number; y: number };

function LineGraph({ width, height }: { width: number; height: number }) {
  const { daysSum } = useContext(ActivityLineGraphContext);

  const data = daysSum.map((activity, index) => ({
    x: index,
    y: activity,
  }));

  // bounds = area inside the graph axis = calculated by subtracting the margins
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Y axis
  const [, max] = d3.extent(data, (d) => d.y);
  const yScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, max || 0])
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

  // Render the X and Y axis using d3.js, not react
  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll('*').remove();
    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append('g')
      .attr('transform', `translate(0,${boundsHeight})`)
      .call(xAxisGenerator);

    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append('g').call(yAxisGenerator);
  }, [xScale, yScale, boundsHeight]);

  // Build the line
  const lineBuilder = d3
    .line<DataPoint>()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));
  const linePath = lineBuilder(data);
  if (!linePath) {
    return null;
  }

  return (
    <svg width={width} height={height} className={styles.graph}>
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
      >
        <path
          d={linePath}
          opacity={1}
          stroke="#18E597"
          fill="none"
          strokeWidth={1.25}
        />
      </g>
      <g
        width={boundsWidth}
        height={boundsHeight}
        ref={axesRef}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
      />
    </svg>
  );
}

export default function LineGraphWrapper() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { activities } = useContext(ActivityLineGraphContext);

  const { width, height } = useDimensions({ current: wrapperRef.current }, [
    activities.length,
  ]);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      {!!(width && height) && <LineGraph width={width} height={height} />}
    </div>
  );
}
