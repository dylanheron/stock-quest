import { POST } from "../app/api/game/[gameCode]/join/route";
import Game from "../models/Game";
import GameUser from "../models/GameUser";
import { clerkClient } from "@clerk/nextjs/server";
import { dbConnect } from "../lib/db";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

jest.mock("@clerk/nextjs/server", () => ({
  clerkClient: { users: { getUser: jest.fn() } }
}));
jest.mock("@/lib/db", () => ({ dbConnect: jest.fn() }));
jest.mock("next/headers", () => ({
  headers: jest.fn(() => ({ get: jest.fn(() => "testUserId") }))
}));
jest.mock("@/models/Game", () => ({
  findOne: jest.fn()
}));
jest.mock("@/models/GameUser", () => ({
  findOne: jest.fn(),
  create: jest.fn()
}));

describe("POST function - Join Game", () => {
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
    (GameUser.findOne as jest.Mock).mockResolvedValue(null); // Ensure this is returning null
  });

  it("should return 403 if userId is not found in headers", async () => {
    (headers as jest.Mock).mockReturnValue({ get: jest.fn(() => null) });
    const mockRequest = {
      params: { gameCode: "someCode" }
    } as unknown as NextRequest;

    const response = await POST(mockRequest, {
      params: { gameCode: "someCode" }
    });

    expect(response.status).toBe(403);
    expect(await response.text()).toBe("You are not authorised");
  });

  it("should return 403 if user is not found via Clerk", async () => {
    (clerkClient.users.getUser as jest.Mock).mockResolvedValue(null);
    const mockRequest = {
      params: { gameCode: "validGame" }
    } as unknown as NextRequest;

    const response = await POST(mockRequest, {
      params: { gameCode: "validGame" }
    });

    expect(response.status).toBe(403);
    expect(await response.text()).toBe("You are not authorised - bad user id");
  });

  it("should return 404 if the game does not exist", async () => {
    (clerkClient.users.getUser as jest.Mock).mockResolvedValue({
      id: "testUserId"
    });
    (Game.findOne as jest.Mock).mockResolvedValue(null);
    const mockRequest = {
      params: { gameCode: "nonexistentGame" }
    } as unknown as NextRequest;

    const response = await POST(mockRequest, {
      params: { gameCode: "nonexistentGame" }
    });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Game doesn't exist");
  });

  it("should return 400 if the game has already ended", async () => {
    const mockGame = { _id: "gameId", status: "ENDED", hasStarted: false };
    (Game.findOne as jest.Mock).mockResolvedValue(mockGame);
    (clerkClient.users.getUser as jest.Mock).mockResolvedValue({
      id: "testUserId"
    });
    const mockRequest = {
      params: { gameCode: "endedGame" }
    } as unknown as NextRequest;

    const response = await POST(mockRequest, {
      params: { gameCode: "endedGame" }
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toBe("Game has ended");
  });

  it("should return 409 if the game has already started", async () => {
    const mockGame = { _id: "gameId", status: "NOT_STARTED", hasStarted: true };
    (Game.findOne as jest.Mock).mockResolvedValue(mockGame);
    (clerkClient.users.getUser as jest.Mock).mockResolvedValue({
      id: "testUserId"
    });
    const mockRequest = {
      params: { gameCode: "startedGame" }
    } as unknown as NextRequest;

    const response = await POST(mockRequest, {
      params: { gameCode: "startedGame" }
    });

    expect(response.status).toBe(409);
    expect(await response.json()).toBe("Game has already started");
  });

  it("should return 200 if the user is already part of the game", async () => {
    const mockGame = {
      _id: "gameId",
      status: "NOT_STARTED",
      hasStarted: false
    };
    const mockGameUser = { game: "gameId", userId: "testUserId" };
    (Game.findOne as jest.Mock).mockResolvedValue(mockGame);
    (GameUser.findOne as jest.Mock).mockResolvedValue(mockGameUser);
    (clerkClient.users.getUser as jest.Mock).mockResolvedValue({
      id: "testUserId"
    });
    const mockRequest = {
      params: { gameCode: "gameCode" }
    } as unknown as NextRequest;

    const response = await POST(mockRequest, {
      params: { gameCode: "gameCode" }
    });

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("User already joined the game");
  });

  it("should create a new game user if not already part of the game", async () => {
    const mockGame = {
      _id: "gameId",
      status: "NOT_STARTED",
      hasStarted: false
    };
    (Game.findOne as jest.Mock).mockResolvedValue(mockGame);
    (GameUser.findOne as jest.Mock).mockResolvedValue(null);
    (clerkClient.users.getUser as jest.Mock).mockResolvedValue({
      id: "testUserId"
    });
    const mockRequest = {
      params: { gameCode: "newGameCode" }
    } as unknown as NextRequest;

    const response = await POST(mockRequest, {
      params: { gameCode: "newGameCode" }
    });

    expect(GameUser.create).toHaveBeenCalledWith({
      game: "gameId",
      userId: "testUserId"
    });
    expect(response.status).toBe(201);
  });
});
