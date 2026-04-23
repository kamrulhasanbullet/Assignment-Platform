"use client";

import { useState, useEffect } from "react";
import { Assignment } from "@/types/assignment";
import { assignmentService } from "@/services/assignmentService";

export function useAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const data = await assignmentService.getAll();
      setAssignments(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch assignments");
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => fetchAssignments();

  return {
    assignments,
    loading,
    error,
    refetch,
  };
}
