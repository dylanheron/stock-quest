"use client";

import React from "react";
import BestWorstGraph, { UserData } from "./BestWorstGraph";

interface WorstGamesProps {
  userData: UserData[];
}

export default function WorstGames({ userData }: WorstGamesProps) {
  // Sort the user data in ascending order by score and take the bottom 3
  const bottomGames = [...userData]
    .sort((a, b) => a.profit - b.profit)
    .slice(0, 3)
    .map((game) => ({
      ...game,
      profit: parseFloat(game.profit.toFixed(2))
    }));

  return (
    <div className="flex flex-col items-center">
      <BestWorstGraph userData={bottomGames} />
    </div>
  );
}
