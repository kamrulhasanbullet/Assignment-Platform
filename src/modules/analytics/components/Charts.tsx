"use client";
import SubmissionStatusPie from "@/components/charts/SubmissionStatusPie";
import DifficultyBar from "@/components/charts/DifficultyBar";
import AcceptanceRateLine from "@/components/charts/AcceptanceRateLine";
import { AnalyticsData } from "@/types/analytics";

interface ChartsProps {
  analyticsData: AnalyticsData;
}

export default function Charts({ analyticsData }: ChartsProps) {
  const pieData = [
    {
      name: "Accepted",
      value: analyticsData.submissionsStats.accepted,
      color: "#10B981",
    },
    {
      name: "Pending",
      value: analyticsData.submissionsStats.pending,
      color: "#F59E0B",
    },
    {
      name: "Needs Improvement",
      value: analyticsData.submissionsStats.needsImprovement,
      color: "#EF4444",
    },
  ];

  const difficultyData = analyticsData.difficultyStats.map((diff) => ({
    difficulty: diff.difficulty,
    accepted: diff.accepted,
    total: diff.total,
    acceptanceRate: diff.total > 0 ? diff.accepted / diff.total : 0,
  }));

  const trendData = analyticsData.trendData.map((point) => ({
    date: point.date,
    acceptanceRate: point.acceptanceRate,
    submissions: point.submissions,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <SubmissionStatusPie
        data={pieData}
        totalSubmissions={analyticsData.submissionsStats.total}
      />

      <DifficultyBar data={difficultyData} />

      <div className="lg:col-span-2">
        <AcceptanceRateLine data={trendData} />
      </div>
    </div>
  );
}
