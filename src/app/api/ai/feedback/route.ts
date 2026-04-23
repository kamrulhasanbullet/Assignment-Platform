import { NextRequest, NextResponse } from "next/server";
import { generateFeedback } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { submissionNote, assignmentDescription } = await request.json();

    const feedback = await generateFeedback(
      submissionNote,
      assignmentDescription,
    );

    return NextResponse.json({ feedback });
  } catch (error) {
    return NextResponse.json(
      { error: "AI feedback generation failed" },
      { status: 500 },
    );
  }
}
