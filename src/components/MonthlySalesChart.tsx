import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { IMonthlySalesSummary } from "@/types/types";
import styles from "./daily-sales-chart.module.css";
import { formatNumberToCurrency, formatNumberToString } from "@/functions";


interface IMonthlySalesProps {
  data: IMonthlySalesSummary[];
}

const MonthlySalesChart = (props: IMonthlySalesProps) => {
  const { data } = props;

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3
      .scaleOrdinal<string>()
      .domain(data.map((d) => d.month))
      .range(["#4e79a7", "#f28e2c", "#e15759", "#76b7b2"]);

    const pie = d3
      .pie<IMonthlySalesSummary>()
      .value((d) => d.totalRevenue)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<IMonthlySalesSummary>>()
      .innerRadius(radius * 0.5)
      .outerRadius(radius - 10);

    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "white")
      .style("border", "1px solid #ccc")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    svg
      .selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.month))
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(
            `<strong>${getMonthName(
              d.data.month
            )}</strong><br/>Revenue: ₹${formatIndianCurrency(
              d.data.totalRevenue
            )}`
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    return () => {
      tooltip.remove();
    };
  }, [data]);

  const getMonthName = (monthYear: string): string => {
    const [month, year] = monthYear.split("/").map(Number);
    return `${d3.timeFormat("%B")(new Date(year, month - 1))} ${year}`;
  };

  const formatIndianCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div style={{ display: "flex" }}>
      <svg ref={svgRef}></svg>
      <div
        style={{
          display: "flex",
          marginTop: "10px",
          gap: "10px",
          marginLeft: "50px",
          textAlign: "right",
          flexWrap: "wrap",
          justifyContent: "space-between",          
          padding: "20px",
          border: "1px solid #ddd",
          boxShadow: "1px 1px 2px #ddd",
          backgroundColor: "#f9f9f9",
        }}
      >
        {data &&
          data.map((rs) => {
            return (
              <div
                style={{
                  display: "inline-block",
                  width: "310px",
                  border: "1px solid #ddd",
                  padding: "20px",
                  boxShadow: "1px 1px 2px #ddd"
                }}
              >                
                <span style={{ color: "maroon", fontWeight: "bold" }}>
                  Total Revenue:
                </span>
                <div className={styles.figure}>
                  {formatNumberToCurrency(rs.totalRevenue)}
                </div>

                <p style={{ color: "maroon", fontWeight: "bold", marginTop: "20px" }}>
                  Transactions
                </p>
                <div className={styles.figure}>
                  {formatNumberToString(rs.totalTransactions)}
                </div>
                <p style={{fontWeight: "bold", color: "green", fontSize: "2rem", fontFamily: "fantasy", letterSpacing: "3px", paddingTop: "20px"}}>{getMonthName(rs.month)}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MonthlySalesChart;
