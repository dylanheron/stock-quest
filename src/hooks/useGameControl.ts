import { useEffect, useState, useRef } from "react";
import { useTimer } from "react-timer-hook";
import { useGameData } from "./useCompanyData";
import { useUser } from "@clerk/nextjs";
import { useGameProfit } from "./useGameLeaderboard";

export function useGameControl(
  gameCode: string,
  gameLength: number = 120,
  startingFunds: number = 1000
) {
  const { totalSeconds } = useTimer({
    autoStart: true,
    expiryTimestamp: new Date(Date.now() + gameLength * 1000)
  });

  const { leaderboard, updateProfit } = useGameProfit(
    gameCode,
    totalSeconds == 0
  );

  const [availableFunds, setAvailableFunds] = useState(startingFunds);
  const [totalHeld, setTotalHeld] = useState(0);

  const { data } = useGameData(gameCode);
  const { user } = useUser();

  const totalHeldRef = useRef(totalHeld);
  const availableFundsRef = useRef(availableFunds);
  const latestPriceRef = useRef(0); // Ref to hold the latest price

  useEffect(() => {
    totalHeldRef.current = totalHeld;
    availableFundsRef.current = availableFunds;
    latestPriceRef.current = data?.at(gameLength - totalSeconds)?.price || 0;
  }, [totalHeld, availableFunds, data, totalSeconds]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newProfit =
        latestPriceRef.current * totalHeldRef.current +
        availableFundsRef.current;
      updateProfit(newProfit);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  function lastPrice() {
    return data?.at(gameLength - totalSeconds)?.price || 0;
  }

  function profit() {
    return lastPrice() * totalHeld + availableFunds;
  }

  function buy(amount: number) {
    setTotalHeld((prev) => prev + (availableFunds * amount) / lastPrice());
    setAvailableFunds((prev) => {
      const newFunds = prev - prev * amount;
      updateProfit(lastPrice() * totalHeld + availableFunds); // Updating profit after buying it to dataabse
      return newFunds;
    });
  }

  function sell(amount: number) {
    setTotalHeld((prev) => {
      const newHeld = prev - prev * amount;
      return newHeld;
    });
    setAvailableFunds((prev) => {
      const newFunds = prev + totalHeld * amount * lastPrice();
      updateProfit(lastPrice() * totalHeld + availableFunds); //updating profit after selling
      return newFunds;
    });
  }

  async function endGame() {
    const response = await fetch(`/api/game/${gameCode}/end`, {
      method: "POST",
      headers: {
        userId: user?.id || ""
      }
    });

    if (response.ok) {
      return true;
    }
  }

  return {
    companyName: data?.at(gameLength - totalSeconds)?.companyName,
    stockData: data?.slice(0, gameLength - totalSeconds),
    lastPrice: lastPrice(),
    timeElapsed: gameLength - totalSeconds,
    timeRemaining: totalSeconds,
    hasEnded: gameLength - totalSeconds == 0,
    totalHeld: totalHeld,
    availableFunds: availableFunds,
    profit: profit(),
    buy: buy,
    sell: sell,
    endGame: endGame,
    leaderboard: leaderboard
  };
}
