import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { OptionContract } from '../types/options';

interface OptionsScatterPlotProps {
  data: OptionContract[];
  width?: number;
  height?: number;
}

interface TooltipData {
  x: number;
  y: number;
  contract: OptionContract;
}

export const OptionsScatterPlot: React.FC<OptionsScatterPlotProps> = ({
  data,
  width = 800,
  height = 600,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const margin = { top: 40, right: 40, bottom: 80, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.strike_price) as [number, number])
      .range([0, innerWidth])
      .nice();

    const yScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.expiration_date)) as [Date, Date])
      .range([innerHeight, 0])
      .nice();

    const radiusScale = d3
      .scaleSqrt()
      .domain([0, d3.max(data, (d) => d.open_interest) || 0])
      .range([2, 15]);

    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(['call', 'put'])
      .range(['#3B82F6', '#EF4444']); // Blue for calls, red for puts

    // Create main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add background grid
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickSize(-innerHeight)
          .tickFormat(() => '')
      )
      .style('stroke-dasharray', '2,2')
      .style('opacity', 0.3);

    g.append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      )
      .style('stroke-dasharray', '2,2')
      .style('opacity', 0.3);

    // Add axes
    const xAxis = g
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format('.0f')));

    const yAxis = g
      .append('g')
      .call(d3.axisLeft(yScale).tickFormat(d3.timeFormat('%b %d, %Y')));

    // Style axes
    xAxis.selectAll('text').style('font-size', '12px').style('fill', '#374151');
    yAxis.selectAll('text').style('font-size', '12px').style('fill', '#374151');

    // Add axis labels
    g.append('text')
      .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + 50})`)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('fill', '#1F2937')
      .text('Strike Price ($)');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -50)
      .attr('x', -innerHeight / 2)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('fill', '#1F2937')
      .text('Expiration Date');

    // Add title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 25)
      .style('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', '700')
      .style('fill', '#111827')
      .text('AAPL Options Chain Visualization');

    // Add data points
    const circles = g
      .selectAll('.option-circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'option-circle')
      .attr('cx', (d) => xScale(d.strike_price))
      .attr('cy', (d) => yScale(new Date(d.expiration_date)))
      .attr('r', 0) // Start with radius 0 for animation
      .attr('fill', (d) => colorScale(d.contract_type))
      .attr('opacity', 0.7)
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        // Highlight circle
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('stroke', '#1F2937')
          .attr('stroke-width', 2);

        // Show tooltip
        const [mouseX, mouseY] = d3.pointer(event);
        setTooltip({
          x: mouseX + margin.left,
          y: mouseY + margin.top,
          contract: d,
        });
      })
      .on('mouseout', function () {
        // Reset circle
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.7)
          .attr('stroke', 'none');

        // Hide tooltip
        setTooltip(null);
      });

    // Animate circles
    circles
      .transition()
      .duration(1000)
      .delay((_, i) => i * 2)
      .attr('r', (d) => radiusScale(d.open_interest));

    // Add legend
    const legend = svg
      .append('g')
      .attr('transform', `translate(${width - 150}, 50)`);

    const legendData = [
      { type: 'call', color: '#3B82F6', label: 'Calls' },
      { type: 'put', color: '#EF4444', label: 'Puts' },
    ];

    const legendItems = legend
      .selectAll('.legend-item')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (_, i) => `translate(0, ${i * 25})`);

    legendItems
      .append('circle')
      .attr('r', 8)
      .attr('fill', (d) => d.color)
      .attr('opacity', 0.7);

    legendItems
      .append('text')
      .attr('x', 15)
      .attr('y', 5)
      .style('font-size', '14px')
      .style('font-weight', '500')
      .style('fill', '#374151')
      .text((d) => d.label);

    // Add size legend
    const sizeLegend = svg
      .append('g')
      .attr('transform', `translate(${width - 150}, 120)`);

    sizeLegend
      .append('text')
      .attr('y', -10)
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', '#374151')
      .text('Open Interest');

    const maxOI = d3.max(data, (d) => d.open_interest) || 0;
    const sizeLegendData = [maxOI * 0.25, maxOI * 0.5, maxOI * 0.75, maxOI];

    const sizeLegendItems = sizeLegend
      .selectAll('.size-legend-item')
      .data(sizeLegendData)
      .enter()
      .append('g')
      .attr('class', 'size-legend-item')
      .attr('transform', (_, i) => `translate(0, ${i * 20 + 10})`);

    sizeLegendItems
      .append('circle')
      .attr('r', (d) => radiusScale(d))
      .attr('fill', '#9CA3AF')
      .attr('opacity', 0.6);

    sizeLegendItems
      .append('text')
      .attr('x', 25)
      .attr('y', 5)
      .style('font-size', '11px')
      .style('fill', '#6B7280')
      .text((d) => d3.format('.0f')(d));

  }, [data, width, height]);

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="bg-white rounded-lg shadow-sm"
      />
      
      {tooltip && (
        <div
          className="absolute z-10 bg-white p-3 rounded-lg shadow-lg border border-gray-200 pointer-events-none"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            transform: 'translateY(-100%)',
          }}
        >
          <div className="text-sm font-semibold text-gray-900">
            {tooltip.contract.ticker}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            <div>Type: <span className="font-medium capitalize">{tooltip.contract.contract_type}</span></div>
            <div>Strike: <span className="font-medium">${tooltip.contract.strike_price}</span></div>
            <div>Expires: <span className="font-medium">{new Date(tooltip.contract.expiration_date).toLocaleDateString()}</span></div>
            <div>Open Interest: <span className="font-medium">{tooltip.contract.open_interest.toLocaleString()}</span></div>
          </div>
        </div>
      )}
    </div>
  );
};