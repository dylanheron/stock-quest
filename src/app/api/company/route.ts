import { dbConnect } from "@/lib/db";
import Company from "@/models/Company";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createCompanySchema = z.object({
  name: z.string(),
  symbol: z.string(),
  description: z.string()
});

export async function POST(request: NextRequest) {
  await dbConnect();

  const rawCreateCompanyInput = await request.json();

  const { data: createCompanyInput, success } = createCompanySchema.safeParse(
    rawCreateCompanyInput
  );

  if (!success) {
    return new NextResponse("Incorrect params", { status: 400 });
  }

  const company = await Company.create({
    name: createCompanyInput.name,
    symbol: createCompanyInput.symbol,
    description: createCompanyInput.description
  });

  return NextResponse.json(company);
}

export async function GET() {
  await dbConnect();

  try {
    const companies = await Company.find({}); // fetching all the companies
    return NextResponse.json(companies, { status: 200 });
  } catch (error) {
    return new NextResponse("Couldn't get company data", { status: 404 });
  }
}
