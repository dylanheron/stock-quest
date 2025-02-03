"use client";

import React from "react";
import ReactECharts from "echarts-for-react";

export interface UserData {
  gameId: number;
  gameDate: Date;
  company: string;
  companyCode: string;
  profit: number;
  playedAgo: number;
}

interface GraphProps {
  userData: UserData[];
}

export default function ProfilePage({ userData }: GraphProps) {
  const option = {
    animationDuration: 3000,
    tooltip: {
      trigger: "item",
      formatter: function (params: any) {
        const item = userData[params.dataIndex];
        return `${item.company}: ${item.profit < 0 ? "-$" : "$"}${Math.abs(item.profit)}`;
      }
    },
    xAxis: [
      {
        type: "category",
        data: userData.map((item) => item.companyCode),
        axisLabel: {
          colour: "white",
          fontSize: 20
        }
      }
    ],
    yAxis: {
      type: "value"
    },
    series: [
      {
        name: "Gain/Loss Summary",
        type: "bar",
        data: userData.map((item) => item.profit),
        itemStyle: {
          color: function (params: any) {
            return params.value < 0 ? "#EF4444" : "#2AB4E3";
          }
        }
      }
    ]
  };

  return (
    <ReactECharts style={{ height: "70vh", width: "100%" }} option={option} />
  );
}
