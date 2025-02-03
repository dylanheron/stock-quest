import React from "react";
import { FaTrophy } from "react-icons/fa6";
import { IPlayer, ILeaderboard } from "@/app/types/gameTypes";

const Leaderboard: React.FC<{
  leaderboard: ILeaderboard[];
  players?: IPlayer[];
}> = ({ leaderboard, players }) => {
  return (
    <div className="border-2 border-white rounded-2xl p-4 w-100%">
      <div className="flex justify-center items-center gap-3">
        <FaTrophy className="text-xl text-yellow-400" />
        <h2 className="text-xl font-semibold text-white text-center">
          Leaderboard
        </h2>
      </div>
      <ul>
        {leaderboard.map((leader, index) => {
          const player = players?.find((p) => p.id === leader.id);
          return (
            // mimicking first second and third place and colours to display negative and positive profit indication
            <li key={leader.id} className="flex justify-between p-1">
              <span
                className={`${index === 0 ? "text-yellow-400" : index === 1 ? "text-amber-600" : index === 2 ? "text-gray-400" : "text-white"} text-xl font-semibold`}
              >
                {index + 1}. {player?.firstName}
              </span>
              <span
                className={`${leader.profit > 1000 ? "text-green-400" : "text-red-400"} text-xl font-bold`}
              >
                ${leader.profit.toFixed(2)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Leaderboard;
