import { POST } from "../app/api/game/[gameCode]/start/route";
import Game from "@/models/Game";
import { dbConnect } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

jest.mock("@/lib/db");
jest.mock("@/models/Game");
jest.mock("next/headers");

describe("POST function - Game Start", () => {
  beforeEach(() => {
    (dbConnect as jest.Mock).mockResolvedValue({});
    (headers as jest.Mock).mockReturnValue({
      get: jest.fn(() => "testUserId")
    });
  });

  it("should return 404 if the game does not exist", async () => {
    const mockRequest = {} as NextRequest; // Empty NextRequest object
    const params = { gameCode: "nonexistent" }; // Params object

    const response = await POST(mockRequest, { params });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Could not find game");
  });

  it("should return 403 if user is not the game host", async () => {
    const mockRequest = {} as NextRequest; // Empty NextRequest object
    const params = { gameCode: "testGame" }; // Params object
    Game.findOne = jest.fn().mockResolvedValue({
      gameCode: "testGame",
      hostId: "anotherUserId"
    });

    const response = await POST(mockRequest, { params });

    expect(response.status).toBe(403);
    expect(await response.text()).toBe("No authoirsation");
  });

  it("should update game status if the user is the host", async () => {
    const mockRequest = {} as NextRequest; // Empty NextRequest object
    const params = { gameCode: "testGame" }; // Params object
    Game.findOne = jest.fn().mockResolvedValue({
      gameCode: "testGame",
      hostId: "testUserId"
    });
    Game.updateOne = jest.fn().mockResolvedValue({
      nModified: 1
    });

    const response = await POST(mockRequest, { params });

    expect(Game.updateOne).toHaveBeenCalledWith(
      { gameCode: "testGame" },
      { status: "STARTED", hasStarted: true }
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ nModified: 1 });
  });
});
