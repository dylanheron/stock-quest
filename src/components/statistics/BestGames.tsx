"use client";

import React from "react";
import BestWorstGraph, { UserData } from "./BestWorstGraph";

interface BestGamesProps {
  userData: UserData[];
}

export default function BestGames({ userData }: BestGamesProps) {
  // Sort the user data in descending order by score and take the top 3
  const topGames = [...userData]
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 3)
    .map((game) => ({
      ...game,
      profit: parseFloat(game.profit.toFixed(2))
    }));

  return (
    <div className="flex flex-col items-center">
      <BestWorstGraph userData={topGames} />
    </div>
  );
}
