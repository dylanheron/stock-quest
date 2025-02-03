import { GET } from "../app/api/users/history/route";
import { NextRequest } from "next/server";
import GameUser from "@/models/GameUser";
import Game from "@/models/Game";
import Company from "@/models/Company";
import { dbConnect } from "@/lib/db";
import mongoose from "mongoose";

jest.mock("../lib/db");
jest.mock("@/models/GameUser");
jest.mock("@/models/Game");
jest.mock("@/models/Company");

describe("GET function", () => {
  it("should return 400 if userId is missing", async () => {
    const mockRequest = {
      headers: {
        get: jest.fn().mockReturnValue("") // No userId
      }
    };

    const response = await GET(mockRequest as unknown as NextRequest);

    expect(response.status).toBe(400);
  });

  it("should return game history if userId is valid", async () => {
    const mockRequest = {
      headers: {
        get: jest.fn().mockReturnValue("validUserId")
      }
    };

    const mockGameUser = {
      userId: "validUserId",
      game: "validGameId",
      profit: 1000
    };
    (GameUser.find as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue([mockGameUser])
    });

    const mockGame = {
      _id: new mongoose.Types.ObjectId("605cd5f4f60f486b88f3e3e2"),
      company: "validCompanyId",
      status: "ENDED"
    };
    (Game.findOne as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockGame)
    });

    const mockCompany = {
      _id: "validCompanyId",
      name: "validCompanyName",
      symbol: "validCompanySymbol"
    };
    (Company.findById as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockCompany)
    });

    const response = await GET(mockRequest as unknown as NextRequest);
    const responseBody = await response.json();

    expect(responseBody).toEqual([
      {
        gameId: "605cd5f4f60f486b88f3e3e2",
        gameDate: "2021-03-25T18:27:00.000Z",
        company: "validCompanyName",
        companyCode: "validCompanySymbol",
        profit: 1000,
        playedAgo: expect.any(Number)
      }
    ]);
    expect(response.status).toBe(200);
  });

  it("should return 500 if there is an error", async () => {
    const mockRequest = {
      headers: {
        get: jest.fn().mockReturnValue("validUserId")
      }
    };

    (GameUser.find as jest.Mock).mockImplementation(() => {
      throw new Error("Database error");
    });

    const response = await GET(mockRequest as unknown as NextRequest);

    expect(response.status).toBe(500);
  });
});
