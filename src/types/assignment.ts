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
