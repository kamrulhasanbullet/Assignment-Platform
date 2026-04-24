"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Assignment from "@/models/Assignment";
import Submission from "@/models/Submission";
import { createAssignmentSchema } from "@/types/assignment";

export async function getAssignments() {
  await connectDB();

  const assignments = (await Assignment.find()
    .sort({ createdAt: -1 })
    .lean()) as any[];

  const assignmentsWithCount = await Promise.all(
    assignments.map(async (assignment) => {
      const submissionsCount = await Submission.countDocuments({
        assignmentId: assignment._id,
      });
      return {
        ...assignment,
        id: assignment._id.toString(),
        submissionsCount,
      };
    }),
  );

  return assignmentsWithCount;
}

export async function getAssignmentById(id: string) {
  await connectDB();

  const assignment = (await Assignment.findById(id).lean()) as any;
  if (!assignment) return null;

  const submissions = (await Submission.find({ assignmentId: id })
    .populate("studentId", "name email")
    .lean()) as any[];

  return {
    ...assignment,
    id: assignment._id.toString(),
    submissions: submissions.map((s) => ({
      ...s,
      id: s._id.toString(),
    })),
    submissionsCount: submissions.length,
  };
}

export async function getAssignmentsStats() {
  await connectDB();

  const total = await Assignment.countDocuments();
  const active = await Assignment.countDocuments({
    deadline: { $gt: new Date() },
  });

  return { total, active };
}

export async function createAssignment(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "INSTRUCTOR") {
    throw new Error("Unauthorized");
  }

  const validatedFields = createAssignmentSchema.parse({
    title: formData.get("title"),
    description: formData.get("description"),
    difficulty: formData.get("difficulty"),
    deadline: formData.get("deadline"),
  });

  await connectDB();

  await Assignment.create({
    title: validatedFields.title,
    description: validatedFields.description,
    difficulty: validatedFields.difficulty,
    deadline: new Date(validatedFields.deadline),
    instructorId: session.user.id,
  });

  redirect("/instructor/assignments");
}
