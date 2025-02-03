import { GET } from "../app/api/game/[gameCode]/status/route";
import Game from "../models/Game";
import GameUser from "../models/GameUser";
import { clerkClient } from "@clerk/nextjs/server";
import { dbConnect } from "../lib/db";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import Company from "@/models/Company";
import mongoose from "mongoose";

jest.mock("@clerk/nextjs/server", () => ({
  clerkClient: { users: { getUser: jest.fn() } }
}));
jest.mock("../lib/db", () => ({ dbConnect: jest.fn() }));
jest.mock("next/headers", () => ({
  headers: jest.fn(() => ({ get: jest.fn(() => "testUserId") }))
}));
jest.mock("@/models/Game", () => ({
  findOne: jest.fn()
}));
jest.mock("../models/GameUser", () => ({
  findOne: jest.fn()
}));
jest.mock("../models/Company", () => ({
  findById: jest.fn()
}));

describe("GET function - Game Status", () => {
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
      hasStarted: false
    });
  });

  it("should return 403 if user is not authorized", async () => {
    (clerkClient.users.getUser as jest.Mock).mockResolvedValue(null);
    const mockRequest = {
      params: { gameCode: "existingGame" }
    } as unknown as NextRequest;

    const response = await GET(mockRequest, {
      params: { gameCode: "existingGame" }
    });

    expect(response.status).toBe(403);
    expect(await response.text()).toBe("You are not authuorised - bad user id");
  });

  it("should return 404 if the game does not exist", async () => {
    (Game.findOne as jest.Mock).mockResolvedValue(null);
    const mockRequest = {
      params: { gameCode: "nonexistentGame" }
    } as unknown as NextRequest;

    const response = await GET(mockRequest, {
      params: { gameCode: "nonexistentGame" }
    });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Game doesn't exist");
  });

  it("should return 403 if user is not a game participant", async () => {
    const mockGame = { _id: "gameId", hostId: "hostId" };
    const mockCompany = {
      name: "test",
      symbol: "TST",
      description: "Test Company"
    };
    (Game.findOne as jest.Mock).mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(mockGame)
    }));
    (GameUser.findOne as jest.Mock).mockResolvedValue(null);
    (Company.findById as jest.Mock).mockResolvedValue(mockCompany);
    const mockRequest = {
      params: { gameCode: "existingGame" }
    } as unknown as NextRequest;

    const response = await GET(mockRequest, {
      params: { gameCode: "existingGame" }
    });

    expect(response.status).toBe(403);
    expect(await response.text()).toBe(
      "You are not authuorised - not a game participant"
    );
  });

  it("should return 200 and game when game exists and user is a participant", async () => {
    const mockGame = {
      _id: new mongoose.Types.ObjectId("605cd5f4f60f486b88f3e3e2"),
      company: new mongoose.Types.ObjectId("605cd5f4f60f486b88f3e3e2"),
      gameCode: "validGameCode"
    };
    const mockGameUser = { game: mockGame._id, userId: "userId" };
    const mockCompany = {
      _id: new mongoose.Types.ObjectId("605cd5f4f60f486b88f3e3e2"),
      name: "test",
      symbol: "TST",
      description: "Test Company"
    };
    (Game.findOne as jest.Mock).mockResolvedValue(mockGame);
    (GameUser.findOne as jest.Mock).mockResolvedValue(mockGameUser);
    (Company.findById as jest.Mock).mockResolvedValue(mockCompany);
    const mockRequest = {
      params: { gameCode: "validGameCode" }
    } as unknown as NextRequest;

    const response = await GET(mockRequest, {
      params: { gameCode: "validGameCode" }
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      company: {
        _id: mockCompany._id.toString(),
        name: mockCompany.name,
        symbol: mockCompany.symbol,
        description: mockCompany.description
      },
      gameCode: mockGame.gameCode
    });
  });
});
