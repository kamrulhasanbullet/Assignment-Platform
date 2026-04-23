"use client";

import { useState, useEffect } from "react";
import { Submission } from "@/types/submission";
import { submissionService } from "@/services/submissionService";

export function useSubmissions(assignmentId?: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (assignmentId) {
      fetchSubmissions();
    }
  }, [assignmentId]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await submissionService.getByAssignment(assignmentId!);
      setSubmissions(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch submissions");
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => fetchSubmissions();

  return {
    submissions,
    loading,
    error,
    refetch,
  };
}
