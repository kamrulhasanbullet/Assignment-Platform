"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getMySubmissions } from "@/src/modules/submission/actions";
import SubmissionTable from "@/src/modules/submission/components/SubmissionTable";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MySubmissions() {
  const { data: session, status } = useSession();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    accepted: 0,
    pending: 0,
    needsImprovement: 0,
  });
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      fetchMySubmissions();
    }
  }, [status]);

  const fetchMySubmissions = async () => {
    try {
      const data = await getMySubmissions(session.user.id);
      setSubmissions(data.submissions);

      // Calculate stats
      const statsCount = data.submissions.reduce(
        (acc, sub) => {
          acc[sub.status.toLowerCase()]++;
          return acc;
        },
        { accepted: 0, pending: 0, needsImprovement: 0 },
      );

      setStats(statsCount);
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Submissions</h1>
          <p className="text-muted-foreground mt-1">
            Track your assignment submissions and instructor feedback
          </p>
        </div>
        <Link href="/assignments">
          <Button>Browse Assignments</Button>
        </Link>
      </div>

      {/* Stats Badges */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Badge variant="secondary" className="text-sm px-3 py-1">
          Accepted: {stats.accepted}
        </Badge>
        <Badge
          variant="default"
          className="text-sm px-3 py-1 bg-orange-100 text-orange-800"
        >
          Pending: {stats.pending}
        </Badge>
        <Badge
          variant="outline"
          className="text-sm px-3 py-1 border-red-200 text-red-800"
        >
          Needs Work: {stats.needsImprovement}
        </Badge>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2">No submissions yet</h3>
            <p className="text-muted-foreground mb-6">
              Start by browsing available assignments and submitting your work.
            </p>
            <Link href="/assignments">
              <Button>Find Assignments</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Submission History</CardTitle>
          </CardHeader>
          <CardContent>
            <SubmissionTable
              submissions={submissions}
              mode="student"
              onRefresh={fetchMySubmissions}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
