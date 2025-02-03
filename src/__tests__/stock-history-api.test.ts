import { POST } from "../app/api/stock-history/route";
import { NextRequest } from "next/server";
import Company from "@/models/Company";
import StockHistory from "@/models/StockHistory";

jest.mock("@/lib/db");
jest.mock("@/models/Company");
jest.mock("@/models/StockHistory");

describe("POST function", () => {
  it("should return 400 if input is invalid", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({})
    };

    const response = await POST(mockRequest as unknown as NextRequest);

    expect(response.status).toBe(400);
  });

  it("should return 404 if company is not found", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        companySymbol: "invalidSymbol", // Invalid company symbol
        stockData: []
      })
    };

    (Company.findOne as jest.Mock).mockResolvedValue(null); // Company not found

    const response = await POST(mockRequest as unknown as NextRequest);

    expect(response.status).toBe(404);
  });

  it("should create stock history if input is valid", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        companySymbol: "validSymbol",
        stockData: []
      })
    };

    const mockCompany = { _id: "validCompanyId" };
    (Company.findOne as jest.Mock).mockResolvedValue(mockCompany);

    const mockStockHistory = { company: mockCompany._id, data: [] };
    (StockHistory.create as jest.Mock).mockResolvedValue(mockStockHistory);

    const response = await POST(mockRequest as unknown as NextRequest);
    const responseBody = await response.json();

    expect(StockHistory.create).toHaveBeenCalledWith(mockStockHistory);
    expect(response.status).toBe(200);
    expect(responseBody).toEqual(mockStockHistory);
  });

  it("should handle errors from StockHistory POST request", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        companySymbol: "validSymbol",
        stockData: []
      })
    };

    const mockCompany = { _id: "validCompanyId" };
    (Company.findOne as jest.Mock).mockResolvedValue(mockCompany);

    (StockHistory.create as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    await expect(POST(mockRequest as unknown as NextRequest)).rejects.toThrow(
      "Database error"
    );
  });
});
