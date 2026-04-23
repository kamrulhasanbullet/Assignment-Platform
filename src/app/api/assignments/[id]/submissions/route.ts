import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Submission from "@/models/Submission";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    const submissions = await Submission.find({ assignmentId: params.id })
      .populate("studentId", "name email")
      .sort({ submittedAt: -1 })
      .lean();

    return NextResponse.json(submissions);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
