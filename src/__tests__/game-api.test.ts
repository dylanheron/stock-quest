import { POST } from "../app/api/game/route";
import Company from "@/models/Company";
import Game from "@/models/Game";
import GameUser from "@/models/GameUser";
import { NextRequest } from "next/server";

jest.mock("@/lib/db", () => ({
  dbConnect: jest.fn().mockResolvedValue(undefined)
}));
jest.mock("@/models/Company");
jest.mock("@/models/Game");
jest.mock("@/models/GameUser");
jest.mock("next/headers", () => ({
  headers: jest.fn(() => ({
    get: jest.fn(() => "testUserId")
  }))
}));

describe("POST function", () => {
  it("should return 400 if input parameters are invalid", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({})
    } as unknown as NextRequest;

    const response = await POST(mockRequest);

    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Incorrect params");
  });

  it("should return 400 if company id is invalid", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ companyId: "invalidCompanyId" })
    } as unknown as NextRequest;

    Company.findById = jest.fn().mockResolvedValue(null);

    const response = await POST(mockRequest);

    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Invalid company id");
  });

  it("should create a game and a game user if input is valid", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ companyId: "validCompanyId" })
    } as unknown as NextRequest;

    const mockCompany = { _id: "validCompanyId" };
    Company.findById = jest.fn().mockResolvedValue(mockCompany);

    const mockGame = {
      _id: "newGameId",
      company: "validCompanyId",
      gameCode: "abcde",
      status: "NOT_STARTED",
      hostId: "testUserId"
    };
    Game.create = jest.fn().mockResolvedValue(mockGame);

    GameUser.create = jest.fn().mockResolvedValue({
      _id: "newGameUserId",
      game: "newGameId",
      userId: "testUserId"
    });

    const response = await POST(mockRequest);

    expect(Game.create).toHaveBeenCalled();
    expect(GameUser.create).toHaveBeenCalled();
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual(mockGame);
  });
});
