import { dbConnect } from "@/lib/db";
import Game from "@/models/Game";
import GameUser from "@/models/GameUser";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { headers } from "next/headers";

const profitSchema = z.object({
  profit: z.number()
});

// gets the leaderboard information of a particular game
export async function GET(
  request: NextRequest,
  { params }: { params: { gameCode: string } }
) {
  await dbConnect();

  try {
    const game = await Game.findOne({
      gameCode: params.gameCode
    }).populate("hostId");

    if (!game) {
      return new NextResponse("Game doesn't exist", {
        status: 404
      });
    }

    // get all game players sorted by profit in descending order to easily map to leaderboard (limiting to 10 people)
    const players = await GameUser.find({ game: game._id })
      .sort({ profit: -1 })
      .limit(10);

    // map player data
    const playerData = players.map((player) => ({
      id: player.userId,
      profit: player.profit
    }));

    return NextResponse.json(playerData, { status: 200 });
  } catch (error) {
    console.error("Failed to retrieve leaderboard:", error);
    return new NextResponse("Internal server error", {
      status: 500
    });
  }
}

// endpoint to send the updated profits of a user for a particular game
export async function POST(
  request: NextRequest,
  { params }: { params: { gameCode: string } }
) {
  await dbConnect();

  try {
    const { gameCode } = params;
    const userId = request.headers.get("userId");
    const jsonResult = await request.json();

    const validationResult = profitSchema.safeParse(jsonResult);
    if (!validationResult.success) {
      return NextResponse.json(validationResult.error, {
        status: 400
      });
    }

    const { profit } = validationResult.data;

    // checking if profit and userId are both provided
    if (!profit || !userId) {
      return new NextResponse("Missing profit or userId", {
        status: 400
      });
    }

    // finding the game by gameCode
    const game = await Game.findOne({ gameCode: gameCode });
    if (!game) {
      return new NextResponse("Game doesn't exist", {
        status: 404
      });
    }

    // Update the profit for the user in this game
    const updatedGameUser = await GameUser.findOneAndUpdate(
      { userId: userId, game: game._id },
      { $set: { profit: profit } },
      { new: true }
    );

    if (!updatedGameUser) {
      return new NextResponse("User not found in this game", {
        status: 404
      });
    }

    return NextResponse.json(updatedGameUser, { status: 200 });
  } catch (error) {
    console.error("Failed to update user profit:", error);
    return new NextResponse("Internal server error", {
      status: 500
    });
  }
}
