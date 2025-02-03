import { User } from "@clerk/nextjs/server";
import { useQuery } from "@tanstack/react-query";

export function useGamePlayers(gameCode: string) {
  const { data: players } = useQuery({
    queryKey: ["gamePlayers", gameCode],
    queryFn: async () => {
      const response = await fetch(`/api/game/${gameCode}/players`, {
        method: "GET"
      });
      if (!response.ok) throw new Error("Failed to fetch players");
      return response.json() as Promise<
        {
          id: string | null;
          firstName: string | null;
          lastName: string | null;
        }[]
      >;
    },
    refetchInterval: 1500,
    enabled: !!gameCode
  });

  return {
    data: players
  };
}
