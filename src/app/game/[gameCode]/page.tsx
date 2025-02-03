import GameInstance from "@/components/game/GameInstance";
import Loader from "@/components/shared/Loader";
import { Suspense } from "react";

export default function GameInstancePage({
  params: { gameCode }
}: {
  params: { gameCode: string };
}) {
  return (
    <Suspense fallback={<Loader />}>
      <GameInstance gameCode={gameCode} />
    </Suspense>
  );
}
