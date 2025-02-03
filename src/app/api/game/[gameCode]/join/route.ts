import { dbConnect } from "@/lib/db";
import Game from "@/models/Game";
import GameUser from "@/models/GameUser";
import { clerkClient } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { gameCode: string } }
) {
  await dbConnect();

  const userId = headers().get("userId");

  if (!userId) {
    return new NextResponse("You are not authorised", { status: 403 });
  }

  const user = await clerkClient.users.getUser(userId);

  if (!user) {
    return new NextResponse("You are not authorised - bad user id", {
      status: 403
    });
  }

  const game = await Game.findOne({
    gameCode: params.gameCode
  });

  if (!game) {
    return new NextResponse("Game doesn't exist", { status: 404 });
  }

  // if game already ended, no new users can join
  if (game.status == "ENDED") {
    return NextResponse.json("Game has ended", { status: 400 });
  }

  // if game has already started, no new users can join
  if (game.hasStarted) {
    return NextResponse.json("Game has already started", { status: 409 });
  }

  // if exsiting user already part of the game return back to lobby or game
  const existingGameUser = await GameUser.findOne({
    game: game._id,
    userId: userId
  });

  if (existingGameUser) {
    return new NextResponse("User already joined the game", { status: 200 });
  }

  // if not part of existing game, new user joins the lobby
  await GameUser.create({
    game: game._id,
    userId: userId
  });

  return new NextResponse(null, { status: 201 });
}
