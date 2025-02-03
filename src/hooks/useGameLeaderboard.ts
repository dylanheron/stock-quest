import { useQuery, useMutation } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";

export function useGameProfit(gameCode: string, gameEnded: boolean) {
  const { user, isLoaded } = useUser();

  // Query for fetching leaderboard
  const {
    data: leaderboard,
    refetch,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["leaderboard", gameCode],
    queryFn: async () => {
      const response = await fetch(`/api/game/${gameCode}/leaderboard`);
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }
      return response.json();
    },
    refetchInterval: 1500, // fetching every 0.8 seconds (can change)
    enabled: !!gameCode && isLoaded && !!user && !gameEnded
  });

  // Mutation for posting profit updates
  const updateProfitMutation = useMutation({
    mutationFn: async (profit: number) => {
      const response = await fetch(`/api/game/${gameCode}/leaderboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          userId: user?.id || ""
        },
        body: JSON.stringify({ profit })
      });
      if (!response.ok) {
        throw new Error("Failed to update profit");
      }
      return response.json();
    },
    onSuccess: () => {
      // refetching leaderboard after updating profit
      refetch();
    },
    onError: (error: Error) => {
      toast.error(`Error updating profit: ${error.message}`);
    }
  });

  return {
    leaderboard,
    updateProfit: updateProfitMutation.mutate,
    isLoading,
    isError,
    error
  };
}
