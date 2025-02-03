import GameDashboard from "@/components/game/GameDashboard";
import Loader from "@/components/shared/Loader";
import { Suspense } from "react";

export default function GamePage() {
  return (
    <Suspense fallback={<Loader />}>
      <GameDashboard />
    </Suspense>
  );
}
