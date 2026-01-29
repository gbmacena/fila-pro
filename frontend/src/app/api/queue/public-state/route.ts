import { NextResponse } from "next/server";

const API_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3000";

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/queue/public-state`);

    if (!response.ok) {
      throw new Error("Failed to fetch queue state");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching public queue state:", error);
    return NextResponse.json(
      { error: "Failed to fetch queue state" },
      { status: 500 },
    );
  }
}
