"use client";

import { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";

interface Price {
  price: number;
  dateTime: Date;
}

interface ChartProps {
  data: Price[];
}

function isPriceGrowthPositive(data: Price[]): boolean | undefined {
  data.sort(
    (priceA, priceB) => priceA.dateTime.valueOf() - priceB.dateTime.valueOf()
  );

  const startPrice = data.at(0);
  const endPrice = data.at(data.length - 1);

  if (!startPrice || !endPrice) {
    return undefined;
  } else {
    return endPrice.price > startPrice.price;
  }
}

export function Chart({ data }: ChartProps) {
  const eChartsOptions: EChartsOption = {
    animationDuration: 1000,
    dataset: {
      source: data.map((item, index) => [
        new Date(index * (1000 * 60 * 24)),
        item.price
      ])
    },
    xAxis: {
      min: new Date(0),
      max: new Date(120 * 1000 * 60 * 24),
      type: "time",
      axisLine: {
        show: true
      },
      axisLabel: {
        show: true
      }
    },
    yAxis: {
      type: "value",
      // min: 0,
      // max: 100,
      axisLine: {
        show: true
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: true
      },
      splitLine: {
        show: false
      }
    },
    axisPointer: {
      show: true
    },
    // TODO: Implement later maybe
    // tooltip: {
    //   show: true,
    // },
    series: [
      {
        type: "line",
        // smooth: true,
        color: isPriceGrowthPositive(data) ? "green" : "red",
        encode: { x: 0, y: 1 } // Map the first element of array to x-axis and the second to y-axis
      }
    ]
  };

  return (
    <ReactECharts
      option={eChartsOptions}
      className="w-full"
      style={{ height: "63vh" }}
    />
  );
}
