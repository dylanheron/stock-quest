import { GET } from "../app/api/game/[gameCode]/players/route";
import { NextRequest } from "next/server";
import { dbConnect } from "@/lib/db";
import Game from "@/models/Game";
import GameUser from "@/models/GameUser";
import { clerkClient } from "@clerk/nextjs/server";

jest.mock("@/lib/db");
jest.mock("@/models/Game");
jest.mock("@/models/GameUser");
jest.mock("@clerk/nextjs/server");

describe("Players route", () => {
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

    it("returns 200 and players when game exists", async () => {
      const mockGame = { _id: "gameId", hostId: "hostId" };
      const mockPlayers = [{ userId: "userId1" }, { userId: "userId2" }];
      (Game.findOne as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(mockGame)
      }));
      (GameUser.find as jest.Mock).mockResolvedValue(mockPlayers);
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
        { firstName: "User userId1", lastName: "Test" },
        { firstName: "User userId2", lastName: "Test" }
      ]);
    });
  });
});
