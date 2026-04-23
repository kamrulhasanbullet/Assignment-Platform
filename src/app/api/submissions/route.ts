import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Submission from "@/models/Submission";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    const submissions = await Submission.find({ studentId: session?.user.id })
      .populate("assignmentId", "title deadline")
      .sort({ submittedAt: -1 })
      .lean();

    return NextResponse.json(submissions);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    const { assignmentId, url, note } = await request.json();

    const submission = new Submission({
      assignmentId,
      studentId: session!.user.id!,
      url,
      note,
    });

    await submission.save();
    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
