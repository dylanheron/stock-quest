import { dbConnect } from "@/lib/db";
import Company from "@/models/Company";
import StockHistory from "@/models/StockHistory";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createStockHistorySchema = z.object({
  companySymbol: z.string(),
  stockData: z.array(
    z.object({
      date: z.string(),
      open: z.number(),
      high: z.number(),
      low: z.number(),
      close: z.number(),
      adjusted_close: z.number(),
      volume: z.number()
    })
  )
});

export async function POST(request: NextRequest) {
  await dbConnect();

  const rawInput = await request.json();
  const parseResult = createStockHistorySchema.safeParse(rawInput);

  if (!parseResult.success) {
    return new NextResponse("Incorrect params", { status: 400 });
  }

  const { companySymbol, stockData } = parseResult.data;

  // Find the company by symbol
  const company = await Company.findOne({ symbol: companySymbol });
  if (!company) {
    return new NextResponse("Company not found", { status: 404 });
  }

  const transformedStockData = stockData.map((item) => ({
    ...item,
    date: new Date(item.date) // Ensure dates are correctly parsed (from EODHD)
  }));

  // Create stock history record
  const newStockHistory = await StockHistory.create({
    company: company._id,
    data: transformedStockData
  });

  return NextResponse.json(newStockHistory);
}
