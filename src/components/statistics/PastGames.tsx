"use client";

import React from "react";
import { UserData } from "./BestWorstGraph";

interface PastGamesProps {
  userData: UserData[];
}

export default function PastGames({ userData }: PastGamesProps) {
  // display the most recent (last in the list) 9 games, if there are not 9 games, display all games
  const recentGames = [...userData]
    .slice(-9)
    .reverse()
    .map((game) => ({
      ...game,
      profit: parseFloat(game.profit.toFixed(2))
    }));

  // Determine the number of columns based on the number of games
  let columns;
  if (recentGames.length >= 7) {
    columns = 3;
  } else if (recentGames.length >= 4) {
    columns = 2;
  } else {
    columns = 1;
  }

  return (
    <div className="px-40">
      <div className="w-full text-center text-white py-8">
        <h2 className="text-4xl">
          Past <span className="text-[#2AB4E3]">games</span>
        </h2>
      </div>
      <div className={`grid grid-cols-${columns}`}>
        {recentGames.map((game, index) => (
          <div
            key={index}
            className="w-full text-center text-white flex justify-between pl-12 pr-12"
          >
            <h2
              className="text-3xl overflow-hidden whitespace-nowrap overflow-ellipsis"
              title={game.company}
            >
              <span>{game.company}</span>
            </h2>
            <h2 className="text-3xl whitespace-nowrap">
              <span
                className={game.profit < 0 ? "text-red-500" : "text-green-500"}
              >
                $ {Math.abs(game.profit)}
              </span>
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}
