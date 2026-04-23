"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { eq, desc, and } from "drizzle-orm";
import { assignments, submissions, users } from "@/src/lib/schema";
import { createAssignmentSchema } from "@/src/types/assignment";

export async function getAssignments() {
  const data = await db.query.assignments.findMany({
    orderBy: desc(assignments.createdAt),
    with: {
      submissions: true,
    },
  });

  return data.map((assignment) => ({
    ...assignment,
    submissionsCount: assignment.submissions.length,
  }));
}

export async function getAssignmentById(id: string) {
  const assignment = await db.query.assignments.findFirst({
    where: eq(assignments.id, id),
    with: {
      submissions: {
        with: {
          user: true,
        },
      },
    },
  });

  if (!assignment) return null;

  return {
    ...assignment,
    submissionsCount: assignment.submissions.length,
  };
}

export async function getAssignmentsStats() {
  const total = await db.select({ count: count() }).from(assignments);
  const active = await db
    .select({ count: count() })
    .from(assignments)
    .where(lt(assignments.deadline, new Date().toISOString()));

  return {
    total: total[0]?.count || 0,
    active: active[0]?.count || 0,
  };
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

  const { title, description, difficulty, deadline } = validatedFields;

  await db.insert(assignments).values({
    title,
    description,
    difficulty: difficulty as "beginner" | "intermediate" | "advanced",
    deadline: new Date(deadline),
    instructorId: session.user.id,
  });

  redirect("/instructor/assignments");
}
