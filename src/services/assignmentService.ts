import { Assignment } from "@/types/assignment";

export const assignmentService = {
  async getAll(): Promise<Assignment[]> {
    const res = await fetch("/api/assignments");
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  },

  async getById(id: string): Promise<Assignment> {
    const res = await fetch(`/api/assignments/${id}`);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  },

  async create(
    assignment: Omit<Assignment, "id" | "createdAt">,
  ): Promise<Assignment> {
    const res = await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assignment),
    });
    if (!res.ok) throw new Error("Failed to create");
    return res.json();
  },

  async update(
    id: string,
    assignment: Partial<Assignment>,
  ): Promise<Assignment> {
    const res = await fetch(`/api/assignments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assignment),
    });
    if (!res.ok) throw new Error("Failed to update");
    return res.json();
  },
};
