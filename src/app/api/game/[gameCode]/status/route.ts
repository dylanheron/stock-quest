import { dbConnect } from "@/lib/db";
import Company from "@/models/Company";
import Game, { IGame } from "@/models/Game";
import GameUser from "@/models/GameUser";
import { clerkClient } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { gameCode: string } }
) {
  await dbConnect();

  const userId = headers().get("userId");

  if (!userId) {
    return new NextResponse("You are not authuorised", { status: 403 });
  }

  const user = await clerkClient.users.getUser(userId);

  if (!user) {
    return new NextResponse("You are not authuorised - bad user id", {
      status: 403
    });
  }

  const game = await Game.findOne({
    gameCode: params.gameCode
  });

  if (!game) {
    return new NextResponse("Game doesn't exist", {
      status: 404
    });
  }

  const company = await Company.findById(game.company);

  if (!company) {
    return new NextResponse("Error fetching game", {
      status: 500
    });
  }

  const gameUser = await GameUser.findOne({
    game: game._id,
    userId: user.id
  });

  if (!gameUser) {
    return new NextResponse(
      "You are not authuorised - not a game participant",
      {
        status: 403
      }
    );
  }

  const returnGame: Partial<IGame> = {
    _id: game.id,
    gameCode: game.gameCode,
    status: game.status,
    company: company,
    hostId: game.hostId,
    hasStarted: game.hasStarted
  };

  return NextResponse.json(returnGame, { status: 200 });
}
