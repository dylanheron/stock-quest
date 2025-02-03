import { dbConnect } from "@/lib/db";
import Game from "@/models/Game";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { gameCode: string } }
) {
  await dbConnect();

  const userId = headers().get("userId");

  const game = await Game.findOne({ gameCode: params.gameCode });

  if (!game) {
    return new NextResponse("Could not find game", { status: 404 });
  }

  if (game.hostId !== userId) {
    return new NextResponse("No authoirsation", { status: 403 });
  }

  const updatedGame = await Game.updateOne(
    { gameCode: params.gameCode },
    { status: "STARTED", hasStarted: true }
  );

  return NextResponse.json(updatedGame);
}
