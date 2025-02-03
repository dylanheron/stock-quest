// import { Company } from '@/models/Company';
import { User } from "@clerk/nextjs/server";
import { useQuery } from "@tanstack/react-query";
import { useGameStatus } from "./useGameStatus";
import StockHistory, { IStockHistory } from "@/models/StockHistory";

export function useGameData(gameCode: string) {
  const { data: gameData } = useGameStatus(gameCode);

  const { data: stockHistory } = useQuery({
    queryKey: ["gameData", gameCode],
    queryFn: async () => {
      const response = await fetch(
        `/api/stock-history/${gameData?.company.symbol}`,
        {
          method: "GET"
        }
      );
      if (!response.ok) throw new Error("Failed to fetch game data");
      return response.json() as Promise<{ dateTime: string; price: number }[]>;
    },
    refetchInterval: 1500,
    enabled: !!gameCode && !!gameData
  });

  return {
    data: stockHistory?.map((stock) => {
      return {
        dateTime: new Date(stock.dateTime),
        price: stock.price,
        companyName: gameData?.company.name
      };
    })
  };
}
