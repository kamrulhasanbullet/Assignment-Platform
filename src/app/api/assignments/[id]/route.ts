import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Assignment from "@/models/Assignment";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const assignment = await Assignment.findById(params.id).lean();
    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(assignment);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const assignment = await Assignment.findByIdAndUpdate(
      params.id,
      await request.json(),
      { new: true },
    ).lean();

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(assignment);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    await Assignment.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Assignment deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
