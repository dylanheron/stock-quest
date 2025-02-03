import { dbConnect } from "@/lib/db";
import Game from "@/models/Game";
import GameUser from "@/models/GameUser";
import { clerkClient } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// gets all the players in a particular game
export async function GET(
  request: NextRequest,
  { params }: { params: { gameCode: string } }
) {
  await dbConnect();

  const game = await Game.findOne({
    gameCode: params.gameCode
  }).populate("hostId");

  if (!game) {
    return new NextResponse("Game doesn't exist", {
      status: 404
    });
  }

  // Fetch all game players
  const players = await GameUser.find({ game: game._id });

  const playerPromises = players.map(async (player) => {
    return await clerkClient.users.getUser(player.userId);
  });

  const result = await Promise.all(playerPromises);

  const filteredPlayerData = result.map((player) => {
    return {
      id: player.id,
      firstName: player.firstName,
      lastName: player.lastName
    };
  });

  return NextResponse.json(filteredPlayerData, { status: 200 });
}
