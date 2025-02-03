"use client";

import { useGameControl } from "@/hooks/useGameControl";
import { Chart } from "./chart/chart";
import Leaderboard from "./leaderboard/leaderboard";
import Buy from "./Buy";
import Sell from "./Sell";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { IPlayer } from "@/app/types/gameTypes";

interface GameProps {
  gameCode: string;
  hostId: string;
  players?: IPlayer[];
}

export default function Game({ gameCode, hostId, players }: GameProps) {
  const {
    companyName,
    stockData,
    lastPrice,
    timeElapsed,
    timeRemaining,
    profit,
    buy,
    sell,
    availableFunds,
    totalHeld,
    endGame,
    leaderboard
  } = useGameControl(gameCode);

  const { user } = useUser();

  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [priceColor, setPriceColor] = useState("text-white");
  const colorChangeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (previousPrice !== null) {
      const newColor =
        lastPrice > previousPrice
          ? "text-green-500"
          : lastPrice < previousPrice
            ? "text-red-500"
            : priceColor;
      if (colorChangeTimeout.current) {
        clearTimeout(colorChangeTimeout.current);
      }

      colorChangeTimeout.current = setTimeout(() => {
        setPriceColor(newColor);
        setPreviousPrice(lastPrice);
      }, 100);
    } else {
      setPreviousPrice(lastPrice);
    }

    return () => {
      if (colorChangeTimeout.current) {
        clearTimeout(colorChangeTimeout.current);
      }
    };
  }, [lastPrice]);

  return timeRemaining > 0 ? (
    <div className="grid grid-cols-12 gap-5 p-5">
      <div className="grid col-span-2 justify-evenly h-min p-2">
        <div className="flex flex-row items-baseline justify-center mb-5">
          {companyName && (
            <Image
              src={`/images/${companyName.toLowerCase()}.png`}
              alt={companyName}
              className="mr-5"
              width={40}
              height={40}
            />
          )}
          <h1 className="text-6xl">{companyName}</h1>
        </div>
        <div className="p-5 text-xl text-center rounded-xl border-white">
          <p className="font-semibold">Total Stocks Held</p>
          <p className="mb-4 text-cyan-300"> {totalHeld.toFixed(2)}</p>
          <p className="font-semibold">Available Funds</p>
          <p className="mb-4 text-cyan-300">${availableFunds.toFixed(2)}</p>
          <p className="font-semibold">Net Worth</p>
          <p className=" mb-4 text-cyan-300">${profit.toFixed(2)}</p>
        </div>
      </div>
      <div className="grid col-span-8 h-min">
        <div>
          <h2 className="w-full text-center text-xl font-normal text-white">
            Current Stock Price:
          </h2>
          <h2 className={`w-full text-center text-4xl font-bold ${priceColor}`}>
            ${lastPrice.toFixed(2)}
          </h2>
          <Chart data={stockData || []} />
          <div className="flex justify-center gap-8 items-center w-full">
            <Buy onClick={buy} />
            <Sell onClick={sell} />
          </div>
        </div>
      </div>
      <div className="grid col-span-2 h-max">
        <Leaderboard leaderboard={leaderboard || []} players={players} />
      </div>
    </div>
  ) : (
    <div className="w-1/2 m-auto">
      <div className="w-full flex flex-row items-center justify-between mb-12">
        <p className="text-5xl font-bold text-center ">Game Over</p>
        {hostId == user?.id && (
          <button
            className="w-fit p-3 h-fit rounded-2xl bg-blue-400"
            onClick={() => endGame()}
          >
            End Game
          </button>
        )}
      </div>
      <Leaderboard leaderboard={leaderboard || []} players={players} />
    </div>
  );
}
