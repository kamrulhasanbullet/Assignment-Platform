import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Submission } from "@/types/submission";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Calendar } from "lucide-react";

interface FeedbackPanelProps {
  submission: Submission;
}

export default function FeedbackPanel({ submission }: FeedbackPanelProps) {
  if (!submission.feedback) return null;

  return (
    <Card className="border-blue-100 bg-blue-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Instructor Feedback
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {formatDistanceToNow(new Date(submission.updatedAt), {
              addSuffix: true,
            })}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {new Date(submission.updatedAt).toLocaleDateString()}
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {submission.feedback}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
