import mongoose, { Schema, Document } from "mongoose";

export interface IAssignment extends Document {
  title: string;
  description: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  deadline: Date;
  createdBy: string;
  createdAt: Date;
}

const AssignmentSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
    required: true,
  },
  deadline: { type: Date, required: true },
  createdBy: { type: String, required: true, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Assignment ||
  mongoose.model<IAssignment>("Assignment", AssignmentSchema);
