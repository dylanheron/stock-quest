import type { NextRequest } from "next/server";

export const runtime = "edge"; // Corrected config

export async function GET(request: NextRequest) {
  const startDate = "2023-01-01";
  const endDate = "2024-01-01";
  const symbol = "MCD.US"; // Refer to Jira documentation (List of Support exchanges)
  const period = "d"; // 'd' for daily, 'w' for weekly, 'm' for monthly
  const order = "a"; // 'a' for ascending, 'd' for descending
  const API_KEY = process.env.EOD_HISTORICAL_DATA_API_KEY;

  if (!API_KEY) {
    return new Response(
      JSON.stringify({
        message: "API key is missing from the environment variables."
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const url = `https://eodhd.com/api/eod/${symbol}?from=${startDate}&to=${endDate}&api_token=${API_KEY}&fmt=json&period=${period}&order=${order}`;

  try {
    const apiResponse = await fetch(url);
    if (!apiResponse.ok) {
      return new Response(
        JSON.stringify({
          message: `Error from EOD API: ${apiResponse.statusText}`
        }),
        {
          status: apiResponse.status,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const jsonData = await apiResponse.json();

    return new Response(JSON.stringify(jsonData), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching JSON:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
