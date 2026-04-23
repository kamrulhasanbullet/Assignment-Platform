export interface AssignmentStats {
  total: number;
  active: number;
}

export interface SubmissionStats {
  total: number;
  accepted: number;
  pending: number;
  needsImprovement: number;
}

export interface DifficultyStats {
  difficulty: string;
  accepted: number;
  total: number;
}

export interface TrendPoint {
  date: string;
  acceptanceRate: number;
  submissions: number;
}

export interface AnalyticsData {
  assignmentsStats: AssignmentStats;
  submissionsStats: SubmissionStats;
  difficultyStats: DifficultyStats[];
  trendData: TrendPoint[];
}
