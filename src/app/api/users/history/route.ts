import { NextRequest, NextResponse } from "next/server";
import GameUser from "@/models/GameUser";
import { dbConnect } from "@/lib/db";
import Company from "@/models/Company";
import Game from "@/models/Game";

export async function GET(req: NextRequest) {
  await dbConnect();
  const userId = req.headers.get("userId");

  // if no user id then throw error
  if (!userId) {
    return NextResponse.json("Missing userId in headers", { status: 400 });
  }

  try {
    // find the game user with the given user id and only games that have ended
    const gameUsers = await GameUser.find({ userId }).lean();

    const history = await Promise.all(
      gameUsers.map(async (gameUser) => {
        // finds the associated game from game user but only if the game has ended
        const game = await Game.findOne({
          _id: gameUser.game,
          status: "ENDED"
        }).lean();
        if (!game) {
          // console.warn("Game not found or hasn't ended", { gameId: gameUser.game });
          return null;
        }
        // finds associated company from that game
        const company = await Company.findById(game.company).lean();
        if (!company) {
          // console.warn("Company not found", { companyId: game.company });
          return null;
        }
        // returns all the necessary information to display history
        return {
          gameId: game._id.toString(),
          gameDate: game._id.getTimestamp(),
          company: company.name,
          companyCode: company.symbol,
          profit: gameUser.profit,
          playedAgo: Date.now() - game._id.getTimestamp().getTime()
        };
      })
    );

    // return it
    return NextResponse.json(
      history.filter((h) => h !== null),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching game history:", error);
    return NextResponse.json(
      { error: "Error fetching game history" },
      { status: 500 }
    );
  }
}
