"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { submissions } from "@/lib/schema";
import { z } from "zod";

const updateStatusSchema = z.object({
  status: z.enum(["accepted", "pending", "needs_improvement"]),
});

export async function getAllSubmissions() {
  const data = await db.query.submissions.findMany({
    orderBy: (submissions, { desc }) => [desc(submissions.createdAt)],
    with: {
      user: true,
      assignment: true,
    },
  });
  return data;
}

export async function getSubmissionsByAssignmentId(assignmentId: string) {
  const data = await db.query.submissions.findMany({
    where: eq(submissions.assignmentId, assignmentId),
    orderBy: (submissions, { desc }) => [desc(submissions.createdAt)],
    with: {
      user: true,
    },
  });
  return data;
}

export async function getMySubmission(assignmentId: string, userId: string) {
  const submission = await db.query.submissions.findFirst({
    where: and(
      eq(submissions.assignmentId, assignmentId),
      eq(submissions.userId, userId),
    ),
  });
  return submission || null;
}

export async function getMySubmissions(userId: string) {
  const submissions = await db.query.submissions.findMany({
    where: eq(submissions.userId, userId),
    with: {
      assignment: true,
    },
    orderBy: (submissions, { desc }) => [desc(submissions.createdAt)],
  });
  return { submissions };
}

export async function getStatsByStatus() {
  const stats = await db
    .select({
      status: submissions.status,
      count: db.fn.count(submissions.id).as("count"),
    })
    .from(submissions)
    .groupBy(submissions.status);

  const result = {
    accepted: 0,
    pending: 0,
    needs_improvement: 0,
  };

  stats.forEach((stat) => {
    result[stat.status as keyof typeof result] = Number(stat.count);
  });

  return result;
}

export async function createSubmission(
  assignmentId: string,
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user.id) {
    throw new Error("Unauthorized");
  }

  const url = formData.get("url") as string;
  const note = formData.get("note") as string;

  // Check if user already submitted
  const existing = await db.query.submissions.findFirst({
    where: and(
      eq(submissions.assignmentId, assignmentId),
      eq(submissions.userId, session.user.id),
    ),
  });

  if (existing) {
    await db
      .update(submissions)
      .set({ url, note, updatedAt: new Date() })
      .where(eq(submissions.id, existing.id));
  } else {
    await db.insert(submissions).values({
      assignmentId,
      userId: session.user.id,
      url,
      note,
      status: "pending",
    });
  }
}

export async function updateSubmissionStatus(
  submissionId: string,
  status: "accepted" | "pending" | "needs_improvement",
) {
  const session = await auth();
  if (!session || session.user.role !== "INSTRUCTOR") {
    throw new Error("Unauthorized");
  }

  const validated = updateStatusSchema.parse({ status });

  await db
    .update(submissions)
    .set({
      status: validated.status,
      updatedAt: new Date(),
    })
    .where(eq(submissions.id, submissionId));
}

export async function updateSubmissionFeedback(
  submissionId: string,
  feedback: string,
) {
  const session = await auth();
  if (!session || session.user.role !== "INSTRUCTOR") {
    throw new Error("Unauthorized");
  }

  await db
    .update(submissions)
    .set({
      feedback,
      updatedAt: new Date(),
    })
    .where(eq(submissions.id, submissionId));
}
