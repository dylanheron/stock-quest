import { POST } from "../app/api/game/[gameCode]/end/route";
import Game from "../models/Game";
import { clerkClient } from "@clerk/nextjs/server";
import { dbConnect } from "../lib/db";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

jest.mock("@clerk/nextjs/server", () => ({
  clerkClient: { users: { getUser: jest.fn() } }
}));
jest.mock("../lib/db", () => ({ dbConnect: jest.fn() }));
jest.mock("next/headers", () => ({
  headers: jest.fn(() => ({ get: jest.fn(() => "testUserId") }))
}));
jest.mock("../models/Game", () => ({
  findOne: jest.fn(),
  updateOne: jest.fn()
}));

describe("POST function - End Game", () => {
  beforeEach(() => {
    (dbConnect as jest.Mock).mockResolvedValue({});
    (headers as jest.Mock).mockReturnValue({
      get: jest.fn(() => "testUserId")
    });
    (clerkClient.users.getUser as jest.Mock).mockResolvedValue({
      id: "testUserId"
    });
    (Game.findOne as jest.Mock).mockResolvedValue({
      _id: "gameId",
      status: "NOT_STARTED",
      hasStarted: false,
      hostId: "testUserId"
    });
  });

  it("should return 404 if the game does not exist", async () => {
    (Game.findOne as jest.Mock).mockResolvedValue(null);
    const mockRequest = {
      params: { gameCode: "nonexistentGame" }
    } as unknown as NextRequest;

    const response = await POST(mockRequest, {
      params: { gameCode: "nonexistentGame" }
    });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Could not find game");
  });

  it("should return 403 if user is not the host", async () => {
    const mockGame = { _id: "gameId", hostId: "otherUserId" };
    (Game.findOne as jest.Mock).mockResolvedValue(mockGame);
    const mockRequest = {
      params: { gameCode: "existingGame" }
    } as unknown as NextRequest;

    const response = await POST(mockRequest, {
      params: { gameCode: "existingGame" }
    });

    expect(response.status).toBe(403);
    expect(await response.text()).toBe("No authorisation");
  });

  it("should return 200 and updated game when game exists and user is the host", async () => {
    const mockGame = { _id: "gameId", hostId: "testUserId" };
    const updatedGame = { ...mockGame, status: "ENDED", hasStarted: true };
    (Game.findOne as jest.Mock).mockResolvedValue(mockGame);
    (Game.updateOne as jest.Mock).mockResolvedValue(updatedGame);
    const mockRequest = {
      params: { gameCode: "existingGame" }
    } as unknown as NextRequest;

    const response = await POST(mockRequest, {
      params: { gameCode: "existingGame" }
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(updatedGame);
  });
});
