import React, { useContext, useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { useDimensions } from 'hooks/useDimensions';
import styles from './LineGraph.module.scss';
import { ActivityLineGraphContext } from '../ActivityLineGraph';

const MARGIN = { top: 30, right: 30, bottom: 30, left: 40 };

type DataPoint = { x: number; y: number };

function LineGraph({ width, height }: { width: number; height: number }) {
  const { daysSum } = useContext(ActivityLineGraphContext);

  const data = daysSum.map((day, index) => ({
    x: index,
    y: day.sum,
  }));

  const circleRef = useRef(null);
  const lineRef = useRef(null);

  // bounds = area inside the graph axis = calculated by subtracting the margins
  const axesRef = useRef(null);
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

  // Render the Y axis using d3.js, not react
  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll('*').remove();

    const circleElement = d3.select(circleRef.current);
    circleElement.selectAll('*').remove();

    const lineElement = d3.select(lineRef.current);
    lineElement.selectAll('*').remove();

    // Build the line
    const lineBuilder = d3
      .line<DataPoint>()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y));

    const linePath = lineBuilder(data);

    // Render the line
    lineElement
      .append('path')
      .attr('d', linePath)
      .attr('opacity', 1)
      .attr('stroke', '#18E597')
      .attr('fill', 'none')
      .attr('strokeWidth', 1);

    const yAxisGenerator = d3
      .axisLeft(yScale)
      .tickValues(d3.range(0, yAxisMax + 60, 60)) // Set tick values to every hour
      .tickSize(-boundsWidth)
      .tickFormat((d) => `${Math.floor(Number(d) / 60)}h`);

    const yAxis = svgElement.append('g').call(yAxisGenerator);

    // Move the text slightly to the left and change the fill of the text
    yAxis
      .selectAll('text')
      .attr('x', -8) // Move the text 10 units to the left
      .attr('fill', '#A8ACB1'); // Change the fill of the text to #A8ACB1

    // Change tick color
    yAxis.selectAll('line').attr('stroke', '#f8f8f9');

    // Prevent a large amount of circles from being rendered
    if (daysSum.length < width / 6) {
      // Render the data points
      circleElement
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d) => xScale(d.x))
        .attr('cy', (d) => yScale(d.y))
        .attr('r', 2) // Set the radius of the circles
        .attr('fill', '#E8FCF5')
        .attr('stroke', '#282F36');
    }

    yAxis.select('.domain').remove(); // Remove the axis path
  }, [yScale, boundsHeight]);

  return (
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
        transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        ref={lineRef}
      />
      <g
        ref={circleRef}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        width={boundsWidth}
        height={boundsHeight}
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
