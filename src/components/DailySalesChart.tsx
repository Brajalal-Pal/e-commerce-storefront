"use client";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { ISalesData, IDailySaleData } from "@/types/types";
import styles from "./daily-sales-chart.module.css";
import { formatNumberToCurrency, formatNumberToString } from "@/functions";

interface Props {
  dailyData: IDailySaleData[];
}

export default function DailySalesChart({ dailyData }: Props) {
  const [data, setData] = useState<IDailySaleData[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const selectControlRef = useRef<HTMLSelectElement | null>(null);
  const [salesCount, setSalesCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 1600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 100 };

    svg.selectAll("*").remove();

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.date))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.transactions)! * 1.1])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "rgba(0,0,0,0.7)")
      .style("color", "white")
      .style("padding", "8px")
      .style("borderRadius", "4px")
      .style("pointerEvents", "none")
      .style("opacity", 0);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.date)!)
      .attr("y", (d) => y(d.transactions))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - margin.bottom - y(d.transactions))
      .attr("fill", "#3b82f6")
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip
          .html(
            `<strong>Date:</strong> ${d.date}<br/>
                     <strong>Transactions:</strong> ${d.transactions}<br/>
                     <strong>Total Revenue:</strong> ₹${d.totalRevenue.toLocaleString()}<br/>
                     <strong>Avg Order Value:</strong> ₹${d.averageOrderValue.toFixed(
                       2
                     )}`
          )
          .style("left", `${event.pageX + 15}px`)
          .style("top", `${event.pageY - 30}px`);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.pageX + 15}px`)
          .style("top", `${event.pageY - 30}px`);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(300).style("opacity", 0);
      });

    return () => {
      tooltip.remove();
    };
  }, [data]);

  const onSelectionChange = (index: number) => {
    if (dailyData) {
      if (selectControlRef.current?.value) {
        const targetMonth = parseInt(selectControlRef.current?.value) - 1;
        const targetYear = 2022;

        const filteredData = dailyData.filter((item) => {
          const parsedDate = new Date(item.date);
          return (
            parsedDate.getMonth() === targetMonth &&
            parsedDate.getFullYear() === targetYear
          );
        });
        setData(filteredData);

        // Sales Count
        const count = filteredData.reduce((sum, curr) => {
          return sum + curr.transactions;
        }, 0);
        setSalesCount(count);

        // Total Revenue
        const revenue = filteredData.reduce((sum, curr) => {
          return sum + curr.totalRevenue;
        }, 0);
        setTotalRevenue(revenue);
      }
    }
  };
  useEffect(() => {
    onSelectionChange(0);
  }, [dailyData]);

  return (
    <div className={styles.container}>
      <div className={styles.cardContainer}>
        <div>
          <div style={{ display: "inline-block", width: "200px" }}>
            <span style={{ color: "maroon", fontWeight: "bold" }}>
              Transactions:
            </span>
            <div className={styles.figure}>
              {formatNumberToString(salesCount)}
            </div>
          </div>
          <div style={{ display: "inline-block", width: "400px" }}>
            <span style={{ color: "maroon", fontWeight: "bold" }}>
              Total Revenue:
            </span>
            <div className={styles.figure}>
              {formatNumberToCurrency(totalRevenue)}
            </div>
          </div>

          <div style={{ display: "inline-block", width: "200px" }}>
            <select
              ref={selectControlRef}
              onChange={(e) => onSelectionChange(e.target.selectedIndex)}
              style={{
                fontSize: "1.2rem",
                color: "ButtonText",
                border: "1px solid #ddd",
                padding: "10px",
              }}
            >
              <option value="1">Select Month</option>
              <option value="3">March 2022</option>
              <option value="4" selected>April 2022</option>
              <option value="5">May 2022</option>
              <option value="6">June 2022</option>              
            </select>
          </div>
        </div>
      </div>
      <svg ref={svgRef} width={1600} height={400}></svg>
    </div>
  );
}
