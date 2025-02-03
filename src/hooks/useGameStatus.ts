import { IGame } from "@/models/Game";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function useGameStatus(
  gameCode: string,
  redirectOnError: boolean = true
) {
  const { user, isLoaded } = useUser();
  const { push } = useRouter();

  // Query for game status
  const { data: gameStatus } = useQuery({
    queryKey: ["gameStatus", gameCode],
    queryFn: async () => {
      const response = await fetch(`/api/game/${gameCode}/status`, {
        method: "GET",
        headers: {
          userId: user?.id || ""
        }
      });
      if (!response.ok) {
        if (response.status === 404) {
          if (redirectOnError) {
            toast.error(
              "Invalid game code or authorization error. Redirecting to join page..."
            );
            push("/game/join"); // Redirect if game not found
          } else {
            throw new Error("Game not found");
          }
        } else {
          throw new Error("Error fetching game status");
        }
      } else {
        return response.json() as Promise<IGame>;
      }
    },
    refetchInterval: 1500,
    enabled: !!gameCode && isLoaded && !!user
  });

  return {
    data: gameStatus
  };
}
