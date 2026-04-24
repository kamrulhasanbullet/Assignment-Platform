"use client";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, ExternalLink, FileText } from "lucide-react";
import { Assignment } from "@/types/assignment";
import { useSession } from "next-auth/react";
import { getSubmissionStatus } from "@/modules/submission/actions";

interface AssignmentCardProps {
  assignment: Assignment;
  mode?: "student" | "instructor" | "view";
}

export default function AssignmentCard({
  assignment,
  mode = "student",
}: AssignmentCardProps) {
  const { data: session } = useSession();
  const isPastDeadline = new Date(assignment.deadline) < new Date();
  const timeLeft = formatDistanceToNow(new Date(assignment.deadline), {
    addSuffix: true,
  });

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-xl line-clamp-1 group-hover:text-primary transition-colors">
              {assignment.title}
            </CardTitle>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant="secondary" className="text-xs">
                {assignment.difficulty.toUpperCase()}
              </Badge>
              <Badge
                variant={isPastDeadline ? "destructive" : "outline"}
                className="text-xs"
              >
                {isPastDeadline ? "Closed" : `Due ${timeLeft}`}
              </Badge>
            </div>
          </div>
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-300">
            {assignment.difficulty.charAt(0).toUpperCase()}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
          {assignment.description}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(assignment.createdAt).toLocaleDateString()}
            </div>
            {mode === "instructor" && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {assignment.submissionsCount || 0} submissions
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          {mode === "student" ? (
            <>
              <Link href={`/assignments/${assignment.id}`}>
                <Button variant="outline" size="sm" className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  {isPastDeadline ? "View" : "Submit"}
                </Button>
              </Link>
              {!isPastDeadline && (
                <Button variant="default" size="sm" className="flex-1">
                  Submit Now
                </Button>
              )}
            </>
          ) : mode === "instructor" ? (
            <Link href={`/instructor/assignments/${assignment.id}`}>
              <Button className="flex-1">View Submissions</Button>
            </Link>
          ) : (
            <Button asChild size="sm">
              <Link href={`/assignments/${assignment.id}`}>View Details</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
