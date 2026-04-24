import { z } from "zod";

export const createAssignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  deadline: z.string().min(1, "Deadline is required"),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;

export interface Assignment {
  id: string;
  title: string;
  description: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  deadline: Date;
  createdAt: Date;
  createdBy: string;
}

export type DifficultyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
