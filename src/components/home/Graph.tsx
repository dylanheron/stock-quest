// Need this in order to render the graph
"use client";

import React from "react";
import ReactECharts from "echarts-for-react";

export default function Graph() {
  const option = {
    animationDuration: 3000,
    xAxis: {
      type: "category",
      axisLine: { show: true },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false }
    },
    yAxis: {
      type: "value",
      axisLine: { show: true },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false }
    },
    series: [
      {
        data: [150, 300, 132, 60, 500, 670, 400],
        type: "line",
        symbolSize: 10,
        lineStyle: {
          color: "#2AB4E3",
          width: 5
        }
      }
    ]
  };

  return (
    <ReactECharts
      className="w-2/5"
      style={{ height: "60vh" }}
      option={option}
    />
  );
}
