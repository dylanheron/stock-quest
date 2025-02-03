"use client";

import React from "react";
import ProfilePage from "@/components/statistics/HistoryGraph";
import { UserData } from "./HistoryGraph";

interface BestGamesProps {
  userData: UserData[];
}

export default function BestGames({ userData }: BestGamesProps) {
  // Sort the user data in descending order by score and take the top 3
  const recentGames = [...userData].slice(-9).map((game) => ({
    ...game,
    profit: parseFloat(game.profit.toFixed(2))
  }));
  const netWorth = recentGames.reduce((acc, game) => acc + game.profit, 0);

  return (
    <div className="flex flex-col items-center w-full">
      <ProfilePage userData={recentGames} />
      <h2 className="text-4xl">
        Net Worth:{" "}
        <span className={netWorth < 0 ? "text-red-500" : "text-green-500"}>
          {netWorth < 0 ? "-$" : "$"} {Math.abs(netWorth)}
        </span>
      </h2>
    </div>
  );
}
