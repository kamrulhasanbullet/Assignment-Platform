import mongoose, { Schema, Document } from "mongoose";

export interface ISubmission extends Document {
  assignmentId: string;
  studentId: string;
  url: string;
  note: string;
  status: "PENDING" | "ACCEPTED" | "NEEDS_IMPROVEMENT";
  feedback: string;
  submittedAt: Date;
  instructorFeedbackAt?: Date;
}

const SubmissionSchema: Schema = new Schema({
  assignmentId: { type: String, required: true, ref: "Assignment" },
  studentId: { type: String, required: true, ref: "User" },
  url: { type: String, required: true },
  note: { type: String, required: true },
  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "NEEDS_IMPROVEMENT"],
    default: "PENDING",
  },
  feedback: { type: String, default: "" },
  submittedAt: { type: Date, default: Date.now },
  instructorFeedbackAt: { type: Date },
});

export default mongoose.models.Submission ||
  mongoose.model<ISubmission>("Submission", SubmissionSchema);
