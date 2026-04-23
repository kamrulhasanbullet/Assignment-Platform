import { NextRequest, NextResponse } from "next/server";
import { improveAssignmentDescription } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();

    const improvedDescription = await improveAssignmentDescription(description);

    return NextResponse.json({ improvedDescription });
  } catch (error) {
    return NextResponse.json(
      { error: "AI description improvement failed" },
      { status: 500 },
    );
  }
}
