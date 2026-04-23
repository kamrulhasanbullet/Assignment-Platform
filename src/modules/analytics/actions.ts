"use server";

import { db } from "@/src/lib/db";
import { submissions, assignments } from "@/src/lib/schema";
import { AnalyticsData } from "@/src/types/analytics";
import { sql, desc, eq, gt, gte } from "drizzle-orm";

export async function getAnalyticsData(): Promise<AnalyticsData> {
  // Assignments stats
  const assignmentsStats = await db
    .select({
      total: sql<number>`count(*)`.mapWith(Number),
    })
    .from(assignments);

  // Submission stats
  const submissionsStatsRaw = await db
    .select({
      status: submissions.status,
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(submissions)
    .groupBy(submissions.status);

  const submissionsStats = {
    total: 0,
    accepted: 0,
    pending: 0,
    needsImprovement: 0,
  };

  submissionsStatsRaw.forEach((stat) => {
    submissionsStats[stat.status as keyof typeof submissionsStats] = stat.count;
  });

  // Difficulty stats
  const difficultyStats = await db
    .select({
      difficulty: assignments.difficulty,
      accepted:
        sql<number>`count(case when ${submissions.status} = 'accepted' then 1 end)`.mapWith(
          Number,
        ),
      total: sql<number>`count(*)`.mapWith(Number),
    })
    .from(assignments)
    .leftJoin(submissions, eq(assignments.id, submissions.assignmentId))
    .groupBy(assignments.difficulty);

  // Trend data (last 7 days)
  const trendData = await db
    .select({
      date: sql<string>`date(${submissions.createdAt})`.mapWith(String),
      acceptanceRate:
        sql<number>`avg(case when ${submissions.status} = 'accepted' then 1.0 else 0.0 end)`.mapWith(
          Number,
        ),
      submissions: sql<number>`count(*)`.mapWith(Number),
    })
    .from(submissions)
    .where(
      gte(
        submissions.createdAt,
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      ),
    )
    .groupBy(sql`date(${submissions.createdAt})`)
    .orderBy(sql`date(${submissions.createdAt})`);

  return {
    assignmentsStats: {
      total: assignmentsStats[0]?.total || 0,
      active: 0, 
    },
    submissionsStats,
    difficultyStats,
    trendData,
  };
}
