import { GET, POST } from "../app/api/game/[gameCode]/leaderboard/route";
import { NextRequest } from "next/server";
import { dbConnect } from "@/lib/db";
import Game from "@/models/Game";
import GameUser from "@/models/GameUser";
import { clerkClient } from "@clerk/nextjs/server";

jest.mock("@/lib/db");
jest.mock("@/models/Game");
jest.mock("@/models/GameUser");
jest.mock("@clerk/nextjs/server");

describe("Leaderboard route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET method", () => {
    it("returns 404 when game does not exist", async () => {
      (Game.findOne as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(null)
      }));

      const mockRequest = {
        params: { gameCode: "nonexistentGame" }
      } as unknown as NextRequest;

      const response = await GET(mockRequest, {
        params: { gameCode: "nonexistentGame" }
      });

      expect(response.status).toBe(404);
      expect(await response.text()).toBe("Game doesn't exist");
    });

    it("returns 200 and leaderboard when game exists", async () => {
      const mockGame = { _id: "gameId", hostId: "hostId" };
      const mockPlayers = [
        { userId: "userId1", profit: 100 },
        { userId: "userId2", profit: 50 }
      ];
      (Game.findOne as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(mockGame)
      }));
      (GameUser.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockPlayers)
        })
      });
      (clerkClient.users.getUser as jest.Mock).mockImplementation((userId) => {
        return { firstName: `User ${userId}`, lastName: "Test" };
      });

      const mockRequest = {
        params: { gameCode: "existingGame" }
      } as unknown as NextRequest;

      const response = await GET(mockRequest, {
        params: { gameCode: "existingGame" }
      });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual([
        { id: "userId1", profit: 100 },
        { id: "userId2", profit: 50 }
      ]);
    });
  });

  describe("POST method", () => {
    it("returns 404 when game does not exist", async () => {
      (Game.findOne as jest.Mock).mockResolvedValue(null);

      const mockRequest = {
        params: { gameCode: "nonexistentGame" },
        headers: { get: () => "userId" },
        json: () => Promise.resolve({ profit: 100 })
      } as unknown as NextRequest;

      const response = await POST(mockRequest, {
        params: { gameCode: "nonexistentGame" }
      });

      expect(response.status).toBe(404);
      expect(await response.text()).toBe("Game doesn't exist");
    });

    it("returns 400 when profit or userId is missing", async () => {
      const mockGame = { _id: "gameId" };
      (Game.findOne as jest.Mock).mockResolvedValue(mockGame);

      const mockRequest = {
        params: { gameCode: "existingGame" },
        headers: { get: () => null },
        json: () => Promise.resolve({ profit: 100 })
      } as unknown as NextRequest;

      const response = await POST(mockRequest, {
        params: { gameCode: "existingGame" }
      });

      expect(response.status).toBe(400);
      expect(await response.text()).toBe("Missing profit or userId");
    });

    it("returns 404 when user not found in this game", async () => {
      const mockGame = { _id: "gameId" };
      (Game.findOne as jest.Mock).mockResolvedValue(mockGame);
      (GameUser.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      const mockRequest = {
        params: { gameCode: "existingGame" },
        headers: { get: () => "userId" },
        json: () => Promise.resolve({ profit: 100 })
      } as unknown as NextRequest;

      const response = await POST(mockRequest, {
        params: { gameCode: "existingGame" }
      });

      expect(response.status).toBe(404);
      expect(await response.text()).toBe("User not found in this game");
    });

    it("returns 200 when user profit is updated", async () => {
      const mockGame = { _id: "gameId" };
      const mockGameUser = { userId: "userId", game: "gameId", profit: 100 };
      (Game.findOne as jest.Mock).mockResolvedValue(mockGame);
      (GameUser.findOneAndUpdate as jest.Mock).mockResolvedValue(mockGameUser);

      const mockRequest = {
        params: { gameCode: "existingGame" },
        headers: { get: () => "userId" },
        json: () => Promise.resolve({ profit: 100 })
      } as unknown as NextRequest;

      const response = await POST(mockRequest, {
        params: { gameCode: "existingGame" }
      });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(mockGameUser);
    });
  });
});
