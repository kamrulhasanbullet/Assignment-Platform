"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getAssignmentById,
  getMySubmission,
} from "@/modules/assignment/actions";
import { createSubmission } from "@/modules/submission/actions";
import AssignmentCard from "@/modules/assignment/components/AssignmentCard";
import SubmissionForm from "@/components/forms/SubmissionForm";
import FeedbackPanel from "@/modules/submission/components/FeedbackPanel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Props {}

export default function StudentAssignmentDetail() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchAssignment();
    }
  }, [params.id]);

  const fetchAssignment = async () => {
    try {
      const [assignmentData, submissionData] = await Promise.all([
        getAssignmentById(params.id),
        getMySubmission(params.id, session.user.id),
      ]);

      setAssignment(assignmentData);
      setSubmission(submissionData);
    } catch (error) {
      console.error("Failed to fetch assignment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setSubmitting(true);
    try {
      await createSubmission(params.id, formData);
      toast({
        title: "Success!",
        description: "Submission created successfully!",
      });
      fetchAssignment(); // Refresh submission data
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit assignment.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="container mx-auto py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Assignment not found</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const isPastDeadline = new Date(assignment.deadline) < new Date();
  const hasSubmitted = !!submission;

  return (
    <div className="container mx-auto py-8 max-w-4xl space-y-6">
      {/* Assignment Header */}
      <AssignmentCard assignment={assignment} mode="student" />

      {/* Deadline Status */}
      <div className="flex gap-2">
        <Badge variant={isPastDeadline ? "destructive" : "secondary"}>
          {isPastDeadline ? "Deadline Passed" : "Open"}
        </Badge>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Due {new Date(assignment.deadline).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Submission Status */}
      {hasSubmitted && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
          <Badge className="bg-green-100 text-green-800">Submitted</Badge>
          <span className="text-sm font-medium text-green-800">
            You have submitted this assignment
          </span>
        </div>
      )}

      {/* Feedback Panel */}
      {submission?.feedback && <FeedbackPanel submission={submission} />}

      {/* Submission Form */}
      {!isPastDeadline && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Submit Your Work
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SubmissionForm
              onSubmit={handleSubmit}
              submitting={submitting}
              existingSubmission={submission}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
