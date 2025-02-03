import { dbConnect } from "@/lib/db";
import Company from "@/models/Company";
import Game from "@/models/Game";
import GameUser from "@/models/GameUser";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";

const createGameInputSchema = z.object({
  companyId: z.string()
});

export async function POST(request: NextRequest) {
  await dbConnect();

  const userId = headers().get("userId");

  const rawCreateGameInput = await request.json();

  const { data: createGameInput, error } =
    createGameInputSchema.safeParse(rawCreateGameInput);

  if (error) {
    return new NextResponse("Incorrect params", { status: 400 });
  }

  const company = await Company.findById(createGameInput.companyId);

  if (!company) {
    return new NextResponse("Invalid company id", { status: 400 });
  }

  const game = await Game.create({
    company: company._id, // reference id to the object
    gameCode: Math.random().toString(36).substring(2, 7),
    status: "NOT_STARTED",
    hostId: userId
  });

  await GameUser.create({
    game: game._id,
    userId: userId
  });

  return NextResponse.json(game, { status: 201 });
}
