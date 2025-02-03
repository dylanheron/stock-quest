import { GET } from "../app/api/stock-history/[symbol]/route";
import { NextRequest } from "next/server";
import Company from "@/models/Company";
import StockHistory from "@/models/StockHistory";

jest.mock("@/lib/db");
jest.mock("@/models/Company");
jest.mock("@/models/StockHistory");

describe("GET function", () => {
  it("should return 404 if company is not found", async () => {
    const mockRequest = {
      params: {
        symbol: "invalidSymbol" // Invalid company symbol
      }
    };

    (Company.findOne as jest.Mock).mockResolvedValue(null); // Company not found

    const response = await GET(mockRequest as unknown as NextRequest, {
      params: mockRequest.params
    });

    expect(response.status).toBe(404);
  });

  it("should return 404 if stock history is not found", async () => {
    const mockRequest = {
      params: {
        symbol: "validSymbol"
      }
    };

    const mockCompany = { _id: "validCompanyId" };
    (Company.findOne as jest.Mock).mockResolvedValue(mockCompany);

    (StockHistory.findOne as jest.Mock).mockResolvedValue(null); // Stock history not found

    const response = await GET(mockRequest as unknown as NextRequest, {
      params: mockRequest.params
    });

    expect(response.status).toBe(404);
  });

  it("should return adjusted stock data if company and stock history are found", async () => {
    const mockRequest = {
      params: {
        symbol: "validSymbol"
      }
    };

    const mockCompany = { _id: "validCompanyId" };
    (Company.findOne as jest.Mock).mockResolvedValue(mockCompany);

    const mockStockHistory = {
      company: mockCompany._id,
      data: [{ date: "2022-01-01", close: 100 }]
    };
    (StockHistory.findOne as jest.Mock).mockResolvedValue(mockStockHistory);

    const response = await GET(mockRequest as unknown as NextRequest, {
      params: mockRequest.params
    });
    const responseBody = await response.json();

    expect(responseBody).toEqual([{ dateTime: "2022-01-01", price: 100 }]);
    expect(response.status).toBe(200);
  });

  it("should return 500 if there is an error", async () => {
    const mockRequest = {
      params: {
        symbol: "validSymbol"
      }
    };

    (Company.findOne as jest.Mock).mockImplementation(() => {
      throw new Error("Database error");
    });

    await expect(
      GET(mockRequest as unknown as NextRequest, { params: mockRequest.params })
    ).rejects.toThrow("Database error");
  });
});
