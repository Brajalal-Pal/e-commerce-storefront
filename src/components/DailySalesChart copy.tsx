'use client';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

interface SaleData {
  date: string;
  totalRevenue: number;
}

interface Props {
  data: SaleData[];
}

export default function DailySalesChart({ data }: Props) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(ref.current);
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    svg.selectAll("*").remove(); // Clear old chart

    svg.attr("width", width).attr("height", height);

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.date)) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.totalRevenue)!]).nice()
      .range([height - margin.bottom, margin.top]);

    const xAxis = (g: any) => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    const yAxis = (g: any) => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call((g: any) => g.select(".domain").remove());

    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#4F46E5")
      .attr("stroke-width", 2)
      .attr("d", d3.line<SaleData>()
        .x(d => x(new Date(d.date)))
        .y(d => y(d.totalRevenue))
      );

  }, [data]);

  return <svg ref={ref}></svg>;
}
