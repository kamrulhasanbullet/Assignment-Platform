import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Assignment from "@/models/Assignment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const assignments = await Assignment.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(assignments);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user.role !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { title, description, difficulty, deadline } = await request.json();

    const assignment = new Assignment({
      title,
      description,
      difficulty,
      deadline: new Date(deadline),
      createdBy: session.user.id,
    });

    await assignment.save();
    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
