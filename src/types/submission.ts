export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  url: string;
  note: string;
  status: "PENDING" | "ACCEPTED" | "NEEDS_IMPROVEMENT";
  feedback: string;
  submittedAt: Date;
  instructorFeedbackAt?: Date;
}
