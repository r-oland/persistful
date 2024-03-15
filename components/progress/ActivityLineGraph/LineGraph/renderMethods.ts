import * as d3 from 'd3';

export type DataPoint = { x: number; y: number };

const animationDuration = 350;
const animationEasing = d3.easeCubicIn;

export function renderAxes(
  axesRef: React.RefObject<SVGSVGElement>,
  yScale: d3.ScaleLinear<number, number>,
  boundsWidth: number,
  yAxisMax: number,
  yAxisMin: number
) {
  const axesElement = d3.select(axesRef.current);
  axesElement.selectAll('*').remove();

  const yAxisGenerator = d3
    .axisLeft(yScale)
    .tickValues(d3.range(yAxisMin, yAxisMax + 60, 60)) // Set tick values to every hour
    .tickSize(-boundsWidth)
    .tickFormat((d) => `${Math.floor(Number(d) / 60)}h`);

  const yAxis = axesElement.append('g').call(yAxisGenerator);

  // Move the text slightly to the left and change the fill of the text
  yAxis
    .selectAll('text')
    .attr('x', -8) // Move the text 10 units to the left
    .attr('fill', '#A8ACB1'); // Change the fill of the text to #A8ACB1

  // Change tick color
  yAxis.selectAll('line').attr('stroke', '#f8f8f9');

  yAxis.select('.domain').remove(); // Remove the axis path
}

export function renderLine(
  lineRef: React.RefObject<SVGSVGElement>,
  data: DataPoint[],
  xScale: d3.ScaleLinear<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  width: number,
  height: number
) {
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
    .attr('stroke', '#18E597')
    .attr('fill', 'none')
    .attr('strokeWidth', 1);

  // Create a rect that covers the line
  const coverRect = lineElement
    .append('rect')
    .attr('x', 0)
    .attr('y', -1)
    .attr('width', width)
    .attr('height', height + 2)
    .attr('fill', '#fff');

  // Animate the rect to reveal the line
  coverRect
    .transition()
    .duration(animationDuration)
    .ease(animationEasing)
    .attr('x', width)
    .attr('width', 0);
}

export function renderCircles(
  circleRef: React.RefObject<SVGSVGElement>,
  data: DataPoint[],
  xScale: d3.ScaleLinear<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  daysSum: { sum: number; date: Date }[],
  width: number
) {
  const circleElement = d3.select(circleRef.current);
  circleElement.selectAll('*').remove();

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
      .attr('r', 0) // start from 0 radius
      .attr('fill', '#E8FCF5')
      .attr('stroke', '#282F36')
      .transition() // start a transition
      .delay((d, i) => i * (animationDuration / data.length)) // add a delay based on the index
      .duration(animationDuration * 0.85)
      .ease(animationEasing)
      .attr('r', 2);
  }
}
