"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AssignmentForm from "@/src/components/forms/AssignmentForm";
import { createAssignment } from "@/src/modules/assignment/actions";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { useToast } from "@/src/components/ui/use-toast";
import AISuggestions from "@/src/components/AISuggestions";

export default function CreateAssignment() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      await createAssignment(formData);
      toast({
        title: "Success!",
        description: "Assignment created successfully.",
      });
      router.push("/instructor/assignments");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create assignment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImproveDescription = async (description: string) => {
    try {
      const response = await fetch("/api/ai/improve-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const data = await response.json();
      setAiSuggestion(data.improvedDescription);
    } catch (error) {
      toast({
        title: "AI Error",
        description: "Failed to improve description.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Create New Assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AssignmentForm
            onSubmit={handleSubmit}
            loading={loading}
            onImproveDescription={handleImproveDescription}
            aiSuggestion={aiSuggestion}
          />
        </CardContent>
      </Card>
    </div>
  );
}
