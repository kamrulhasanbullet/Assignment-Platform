"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getAssignments } from "@/modules/assignment/actions";
import { AssignmentCard } from "@/modules/assignment/components/AssignmentCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StudentAssignments() {
  const { data: session, status } = useSession();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user.role === "STUDENT") {
      fetchAssignments();
    }
  }, [status, session]);

  const fetchAssignments = async () => {
    try {
      const data = await getAssignments();
      setAssignments(data);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
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
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Assignments</h1>
        <p className="text-muted-foreground">
          Browse available assignments and track your progress
        </p>
      </div>

      <div className="grid gap-6">
        {assignments.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">
                No assignments available
              </h3>
              <p className="text-muted-foreground mb-6">
                Check back later for new assignments from your instructor.
              </p>
              <Link href="/my-submissions">
                <Button variant="outline">View My Submissions</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          assignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              mode="student"
            />
          ))
        )}
      </div>
    </div>
  );
}
