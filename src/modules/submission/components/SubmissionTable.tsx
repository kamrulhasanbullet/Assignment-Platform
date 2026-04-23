"use client";
import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { updateSubmissionStatus, updateSubmissionFeedback } from "../actions";
import { Submission } from "@/src/types/submission";
import {
  MoreVertical,
  Eye,
  Edit3,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface SubmissionTableProps {
  submissions: Submission[];
  mode?: "instructor" | "student";
  assignmentId?: string;
  onRefresh?: () => void;
}

const STATUS_CONFIG = {
  accepted: {
    label: "Accepted",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  pending: {
    label: "Pending",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  needs_improvement: {
    label: "Needs Work",
    color: "bg-red-100 text-red-800 border-red-200",
  },
} as const;

export default function SubmissionTable({
  submissions,
  mode = "instructor",
  assignmentId,
  onRefresh,
}: SubmissionTableProps) {
  const [feedbackDialog, setFeedbackDialog] = useState<{
    open: boolean;
    submissionId: string | null;
  }>({
    open: false,
    submissionId: null,
  });

  const handleStatusUpdate = async (
    submissionId: string,
    status: "accepted" | "pending" | "needs_improvement",
  ) => {
    try {
      await updateSubmissionStatus(submissionId, status);
      onRefresh?.();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2 text-muted-foreground">
          No submissions yet
        </h3>
        <p className="text-sm text-muted-foreground">
          {mode === "instructor"
            ? "Students haven't submitted anything yet."
            : "You haven't submitted this assignment yet."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Student</TableHead>
              {mode === "instructor" && <TableHead>URL</TableHead>}
              <TableHead>Note</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              {mode === "instructor" && (
                <TableHead className="w-24 text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow
                key={submission.id}
                className="border-t hover:bg-accent/50"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {submission.user.firstName.charAt(0)}
                      {submission.user.lastName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">
                        {submission.user.firstName} {submission.user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {submission.user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {mode === "instructor" && (
                  <TableCell className="max-w-xs">
                    <a
                      href={submission.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm font-medium truncate block"
                    >
                      {submission.url}
                    </a>
                  </TableCell>
                )}

                <TableCell className="max-w-md">
                  <p className="text-sm line-clamp-2">{submission.note}</p>
                </TableCell>

                <TableCell className="text-xs text-muted-foreground">
                  {new Date(submission.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  <Badge
                    className={`text-xs px-2 py-1 ${STATUS_CONFIG[submission.status as keyof typeof STATUS_CONFIG].color}`}
                  >
                    {
                      STATUS_CONFIG[
                        submission.status as keyof typeof STATUS_CONFIG
                      ].label
                    }
                  </Badge>
                </TableCell>

                {mode === "instructor" && (
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <a
                            href={submission.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 w-full cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                            View Live
                          </a>
                        </DropdownMenuItem>

                        <Dialog
                          open={feedbackDialog.submissionId === submission.id}
                          onOpenChange={() =>
                            setFeedbackDialog({
                              open: false,
                              submissionId: null,
                            })
                          }
                        >
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault();
                                setFeedbackDialog({
                                  open: true,
                                  submissionId: submission.id,
                                });
                              }}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Edit3 className="h-4 w-4" />
                              Add Feedback
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Feedback</DialogTitle>
                              <DialogDescription>
                                Provide constructive feedback for{" "}
                                {submission.user.firstName}'s submission
                              </DialogDescription>
                            </DialogHeader>
                            <form
                              action={async (formData) => {
                                await updateSubmissionFeedback(
                                  submission.id,
                                  formData.get("feedback") as string,
                                );
                                setFeedbackDialog({
                                  open: false,
                                  submissionId: null,
                                });
                                onRefresh?.();
                              }}
                              className="space-y-4"
                            >
                              <div className="space-y-2">
                                <Label htmlFor="feedback">Feedback</Label>
                                <Textarea
                                  id="feedback"
                                  name="feedback"
                                  placeholder="What was done well? What needs improvement? Be specific..."
                                  className="min-h-[120px]"
                                  defaultValue={submission.feedback || ""}
                                  required
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button type="submit" className="flex-1">
                                  Save Feedback
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() =>
                                    setFeedbackDialog({
                                      open: false,
                                      submissionId: null,
                                    })
                                  }
                                >
                                  Cancel
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>

                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault();
                            handleStatusUpdate(submission.id, "accepted");
                          }}
                          className="flex items-center gap-2 text-green-600 cursor-pointer"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Mark Accepted
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault();
                            handleStatusUpdate(
                              submission.id,
                              "needs_improvement",
                            );
                          }}
                          className="flex items-center gap-2 text-orange-600 cursor-pointer"
                        >
                          <AlertCircle className="h-4 w-4" />
                          Needs Improvement
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
