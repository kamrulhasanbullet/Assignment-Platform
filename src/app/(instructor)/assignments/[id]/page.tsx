import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getAssignmentById } from "@/modules/assignment/actions";
import { AssignmentCard } from "@/modules/assignment/components/AssignmentCard";
import { getSubmissionsByAssignmentId } from "@/modules/submission/actions";
import SubmissionTable from "@/modules/submission/components/SubmissionTable";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  params: { id: string };
}

export default async function AssignmentDetail({ params }: Props) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "INSTRUCTOR") {
    redirect("/login");
  }

  const [assignment, submissions] = await Promise.all([
    getAssignmentById(params.id),
    getSubmissionsByAssignmentId(params.id),
  ]);

  if (!assignment) {
    redirect("/instructor/assignments");
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <Link
            href="/instructor/assignments"
            className="text-sm text-blue-600 hover:underline mb-2 inline-block"
          >
            ← Back to Assignments
          </Link>
          <AssignmentCard assignment={assignment} mode="view" />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {submissions.length} Submission{submissions.length !== 1 ? "s" : ""}
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date(assignment.deadline).toLocaleDateString()}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <SubmissionTable submissions={submissions} assignmentId={params.id} />
        </CardContent>
      </Card>
    </div>
  );
}
