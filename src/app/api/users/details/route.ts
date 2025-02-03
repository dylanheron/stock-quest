import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("userId");

  if (!userId) {
    return new NextResponse("Missing userId in headers", { status: 400 });
  }

  try {
    const { firstName, lastName } = await clerkClient.users.getUser(userId);

    return NextResponse.json({ firstName, lastName }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return new NextResponse("Failed to fetch user details", { status: 500 });
  }
}
