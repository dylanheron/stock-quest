"use client";

import React, { useEffect, useState } from "react";
import DisplayBestWorstGames from "./DisplayBestWorstGames";
import { useUser } from "@clerk/nextjs";

interface GameHistoryStatistics {
  gameId: number;
  gameDate: Date;
  company: string;
  companyCode: string;
  profit: number;
  playedAgo: number;
}

export default function Statistics() {
  const [gameHistory, setGameHistory] = useState<GameHistoryStatistics[]>([]);
  const { user } = useUser();

  useEffect(() => {
    fetch("/api/users/history", {
      headers: {
        userId: user?.id || ""
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setGameHistory(data);
      })
      .catch((error) => {
        console.error("Failed to fetch game history:", error);
      });
  }, [user?.id]); // if user changes refresh the history

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <DisplayBestWorstGames userData={gameHistory} />
    </div>
  );
}
