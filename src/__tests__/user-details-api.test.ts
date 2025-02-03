import { GET } from "../app/api/users/details/route";
import { NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

jest.mock("@clerk/nextjs/server");

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

  it("should return user details if userId is valid", async () => {
    const mockRequest = {
      headers: {
        get: jest.fn().mockReturnValue("validUserId")
      }
    };

    (clerkClient.users.getUser as jest.Mock).mockResolvedValue({
      firstName: "John",
      lastName: "Doe"
    });

    const response = await GET(mockRequest as unknown as NextRequest);
    const responseBody = await response.json();

    expect(responseBody).toEqual({
      firstName: "John",
      lastName: "Doe"
    });
    expect(response.status).toBe(200);
  });

  it("should return 500 if there is an error", async () => {
    const mockRequest = {
      headers: {
        get: jest.fn().mockReturnValue("validUserId")
      }
    };

    (clerkClient.users.getUser as jest.Mock).mockImplementation(() => {
      throw new Error("Database error");
    });

    const response = await GET(mockRequest as unknown as NextRequest);

    expect(response.status).toBe(500);
  });
});
