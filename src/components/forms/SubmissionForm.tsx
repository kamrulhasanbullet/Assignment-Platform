"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Send } from "lucide-react";

interface SubmissionFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  submitting?: boolean;
  existingSubmission?: {
    url: string;
    note: string;
    status: string;
  } | null;
}

export default function SubmissionForm({
  onSubmit,
  submitting = false,
  existingSubmission,
}: SubmissionFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (form: HTMLFormElement) => {
    startTransition(async () => {
      const formData = new FormData(form);
      try {
        await onSubmit(formData);
        toast({
          title: "Success!",
          description: "Your submission has been sent!",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to submit. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {existingSubmission && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  existingSubmission.status === "accepted"
                    ? "bg-green-100 text-green-800"
                    : existingSubmission.status === "needs_improvement"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-blue-100 text-blue-800"
                }`}
              >
                {existingSubmission.status.replace("_", " ").toUpperCase()}
              </div>
              Current Submission
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <ExternalLink className="w-4 h-4 text-blue-600" />
              <a
                href={existingSubmission.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm font-medium truncate"
              >
                {existingSubmission.url}
              </a>
            </div>
            <p className="text-sm text-muted-foreground p-3 bg-gray-50 rounded-lg">
              {existingSubmission.note}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <Label htmlFor="url">
          Live URL{" "}
          <span className="text-sm text-muted-foreground">
            (GitHub Pages, Vercel, Netlify, etc.)
          </span>
        </Label>
        <Input
          id="url"
          name="url"
          type="url"
          required
          placeholder="https://your-project.vercel.app"
          defaultValue={existingSubmission?.url || ""}
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">
          What did you do?{" "}
          <span className="text-sm text-muted-foreground">
            (Explain your approach)
          </span>
        </Label>
        <Textarea
          id="note"
          name="note"
          required
          placeholder="Describe your implementation, challenges faced, and key decisions..."
          rows={6}
          defaultValue={existingSubmission?.note || ""}
          className="min-h-[120px]"
        />
      </div>

      <Button
        type="submit"
        className="w-full h-12 text-lg gap-2"
        disabled={isPending || submitting}
      >
        {isPending || submitting ? (
          <>
            <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Submit Assignment
          </>
        )}
      </Button>
    </form>
  );
}
