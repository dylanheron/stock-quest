"use client";

import Game from "./Game";
import { useGamePlayers } from "@/hooks/useGamePlayers";
import { useGameStatus } from "@/hooks/useGameStatus";
import { useUser } from "@clerk/nextjs";
import Loader from "../shared/Loader";

export default function GameInstance({ gameCode }: { gameCode: string }) {
  const { user, isLoaded } = useUser();

  const { data: gameStatus } = useGameStatus(gameCode);
  const { data: players } = useGamePlayers(gameCode);

  async function handleGameStart() {
    await fetch(`/api/game/${gameCode}/start`, {
      method: "POST",
      headers: { userId: user?.id || "" }
    });
  }

  if (!isLoaded || !gameStatus) {
    return <Loader />;
  }

  if (!user) {
    return <div>Error, you might not be logged in.</div>;
  }

  switch (gameStatus.status) {
    case "NOT_STARTED":
      return (
        <div className="grid grid-rows-2 p-10 gap-20">
          <div className="grid grid-cols-2">
            <div className="grid col-span-1">
              <div className="flex flex-col justify-center items-center">
                <div>Lobby code - share it with your friends! &#127881;</div>
                <div>
                  <h1 className="text-9xl font-semibold">{gameCode}</h1>
                </div>
              </div>
            </div>
            <div
              className={`grid gap-10 text-6xl items-center justify-center col-span-1 text-center`}
            >
              <h2>
                Hey! You{" "}
                {user.id === gameStatus.hostId
                  ? "are the host"
                  : "are in the waiting lobby, please wait until the host starts the game :)"}{" "}
              </h2>
              {user.id === gameStatus.hostId &&
                gameStatus.status === "NOT_STARTED" && (
                  <button
                    className="p-3 rounded-2xl bg-blue-400"
                    onClick={() => handleGameStart()}
                  >
                    Start Game
                  </button>
                )}
            </div>
          </div>
          <div className="flex justify-center items-center text-center flex-col text-3xl gap-5">
            <h1>Current players in the lobby:</h1>
            <ul className="grid grid-cols-3 gap-5">
              {players?.map((player, index: number) => (
                <li
                  className="p-3 border-2 mb-3 rounded-2xl hover:bg-slate-400 duration-200 "
                  key={index}
                >
                  {player.firstName} {player.lastName}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    case "STARTED":
      return (
        <Game
          gameCode={gameCode}
          hostId={gameStatus.hostId}
          players={players}
        />
      );
    case "ENDED":
      return (
        <div className="flex w-1/2 m-auto h-full justify-center items-center mt-16">
          <p className="text-3xl font-bold w-full text-center">
            This game has been ended, thanks for playing
          </p>
        </div>
      );
  }
}
