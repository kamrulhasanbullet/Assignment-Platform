export interface User {
  id: string;
  email: string;
  name: string;
  role: "STUDENT" | "INSTRUCTOR";
  createdAt: Date;
}

export type UserRole = "STUDENT" | "INSTRUCTOR";
