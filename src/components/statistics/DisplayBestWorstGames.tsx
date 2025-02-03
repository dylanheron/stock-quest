import React, { useState } from "react";
import BestGames from "./BestGames";
import WorstGames from "./WorstGames";
import GameHistory from "./GameHistory";
import { Tabs, Tab } from "@mui/material";
import { UserData } from "./BestWorstGraph";
import PastGames from "@/components/statistics/PastGames";

interface DisplayBestWorstGamesProps {
  userData: UserData[];
}

export default function DisplayBestWorstGames({
  userData
}: DisplayBestWorstGamesProps) {
  // State variable to keep track of the selected tab
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <div className="relative">
      <div className="flex justify-center">
        <Tabs value={selectedTab} onChange={handleChange}>
          <Tab
            label="Game History"
            style={{ color: selectedTab === 0 ? "#2AB4E3" : "white" }}
          />
          <Tab
            label="Best Games"
            style={{ color: selectedTab === 1 ? "#2AB4E3" : "white" }}
          />
          <Tab
            label="Worst Games"
            style={{ color: selectedTab === 2 ? "#2AB4E3" : "white" }}
          />
        </Tabs>
      </div>
      <div className="flex items-center justify-center h-full">
        {selectedTab === 0 ? (
          <GameHistory userData={userData} />
        ) : selectedTab === 1 ? (
          <div className="flex flex-col">
            <BestGames userData={userData} />
            <PastGames userData={userData} />
          </div>
        ) : (
          <div className="flex flex-col">
            <WorstGames userData={userData} />
            <PastGames userData={userData} />
          </div>
        )}
      </div>
    </div>
  );
}
