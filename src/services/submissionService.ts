import { Submission } from "@/types/submission";

export const submissionService = {
  async getByAssignment(assignmentId: string): Promise<Submission[]> {
    const res = await fetch(`/api/assignments/${assignmentId}/submissions`);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  },

  async getMySubmissions(): Promise<Submission[]> {
    const res = await fetch("/api/submissions");
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  },

  async create(
    submission: Omit<Submission, "id" | "submittedAt">,
  ): Promise<Submission> {
    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    });
    if (!res.ok) throw new Error("Failed to submit");
    return res.json();
  },

  async update(
    id: string,
    feedback: string,
    status: Submission["status"],
  ): Promise<Submission> {
    const res = await fetch(`/api/submissions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback, status }),
    });
    if (!res.ok) throw new Error("Failed to update");
    return res.json();
  },
};
