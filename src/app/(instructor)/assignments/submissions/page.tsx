import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import SubmissionTable from "@/modules/submission/components/SubmissionTable";
import { getAllSubmissions } from "@/modules/submission/actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getStatsByStatus } from "@/modules/submission/actions";

export default async function SubmissionsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "INSTRUCTOR") {
    redirect("/login");
  }

  const [submissions, stats] = await Promise.all([
    getAllSubmissions(),
    getStatsByStatus(),
  ]);

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Submissions</h1>
          <p className="text-muted-foreground mt-1">
            Review and provide feedback on student submissions
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(stats).map(([status, count]) => (
            <Badge
              key={status}
              variant="secondary"
              className="text-sm px-3 py-1"
            >
              {status.replace("_", " ").toUpperCase()}: {count}
            </Badge>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Review Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <SubmissionTable submissions={submissions} />
        </CardContent>
      </Card>
    </div>
  );
}
