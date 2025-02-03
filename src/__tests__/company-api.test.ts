import Company from "../models/Company";
import { GET, POST } from "../app/api/company/route";
import { NextRequest } from "next/server";
import { dbConnect } from "../lib/db";

jest.mock("../lib/db");
jest.mock("../models/Company");

describe("POST function", () => {
  it("should return 400 if input is invalid", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ name: "test", symbol: "TST" }) // Missing description so should fail
    };

    const response = await POST(mockRequest as unknown as NextRequest);

    expect(response.status).toBe(400);
  });

  it("should create a company if input is valid", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        name: "test",
        symbol: "TST",
        description: "Test Company"
      })
    };

    const mockCompany = {
      name: "test",
      symbol: "TST",
      description: "Test Company"
    };
    (Company.create as jest.Mock).mockResolvedValue(mockCompany);

    const response = await POST(mockRequest as unknown as NextRequest);

    const responseBody = await response.json();

    expect(Company.create).toHaveBeenCalledWith(mockCompany);
    expect(response.status).toBe(200);
    expect(responseBody).toEqual(mockCompany);
  });

  it("should handle errors from Company.create", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        name: "test",
        symbol: "TST",
        description: "Test Company"
      })
    };

    (Company.create as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    await expect(POST(mockRequest as unknown as NextRequest)).rejects.toThrow(
      "Database error"
    );
  });
});

describe("GET function", () => {
  it("should return all companies", async () => {
    const mockCompanies = [
      { name: "Company 1", symbol: "C1", description: "Description 1" },
      { name: "Company 2", symbol: "C2", description: "Description 2" }
    ];

    (dbConnect as jest.Mock).mockResolvedValue({});
    (Company.find as jest.Mock).mockResolvedValue(mockCompanies);

    const response = await GET();
    const responseBody = await response.json();

    expect(responseBody).toEqual(mockCompanies);
    expect(response.status).toBe(200);
  });

  it("should return 404 if there is an error", async () => {
    (dbConnect as jest.Mock).mockResolvedValue({});
    (Company.find as jest.Mock).mockRejectedValue(new Error("Database error"));

    const response = await GET();
    const responseBody = await response.text();

    expect(responseBody).toBe("Couldn't get company data");
    expect(response.status).toBe(404);
  });
});
