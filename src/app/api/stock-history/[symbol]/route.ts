import { dbConnect } from "@/lib/db";
import Company from "@/models/Company";
import StockHistory from "@/models/StockHistory";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  await dbConnect();

  const company = await Company.findOne({ symbol: params.symbol });

  if (!company) {
    return new NextResponse("No company found", { status: 404 });
  }

  // Find the stock history by company id
  const stockHistory = await StockHistory.findOne({ company: company.id });

  if (!stockHistory) {
    return new NextResponse("Stock history not found", { status: 404 });
  }

  const adjustedData = stockHistory.data.map((stockData) => {
    return {
      dateTime: stockData.date,
      price: stockData.close
    };
  });

  return NextResponse.json(adjustedData);
}
