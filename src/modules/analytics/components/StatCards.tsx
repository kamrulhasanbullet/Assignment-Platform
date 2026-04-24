import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, FileText, CheckCircle, Clock } from "lucide-react";
import { AssignmentStats, SubmissionStats } from "@/types/analytics";

interface StatCardsProps {
  assignmentsStats: AssignmentStats;
  submissionsStats: SubmissionStats;
}

export default function StatCards({
  assignmentsStats,
  submissionsStats,
}: StatCardsProps) {
  const acceptanceRate =
    submissionsStats.accepted > 0
      ? Math.round((submissionsStats.accepted / submissionsStats.total) * 100)
      : 0;

  const stats = [
    {
      title: "Total Assignments",
      value: assignmentsStats.total.toLocaleString(),
      change: "+12%",
      trend: "up" as const,
      icon: FileText,
      description: "Active assignments this month",
    },
    {
      title: "Total Submissions",
      value: submissionsStats.total.toLocaleString(),
      change: "+28%",
      trend: "up" as const,
      icon: Users,
      description: "All time submissions",
    },
    {
      title: "Acceptance Rate",
      value: `${acceptanceRate}%`,
      change: "+5%",
      trend: "up" as const,
      icon: CheckCircle,
      description: "Overall acceptance rate",
    },
    {
      title: "Pending Review",
      value: submissionsStats.pending.toLocaleString(),
      change: "-3%",
      trend: "down" as const,
      icon: Clock,
      description: "Awaiting instructor review",
    },
  ];

  return (
    <>
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br hover:from-background/50"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-xl bg-gradient-to-r group-hover:scale-110 transition-all duration-300 ${
                  stat.trend === "up"
                    ? "from-green-500 to-green-600 shadow-green-200"
                    : "from-orange-500 to-orange-600 shadow-orange-200"
                }`}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-foreground leading-tight">
                  {stat.value}
                </CardTitle>
                <CardDescription>{stat.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={`text-xs px-2 py-1 ${
                  stat.trend === "up"
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "bg-orange-100 text-orange-800 hover:bg-orange-200"
                }`}
              >
                <TrendingUp
                  className={`w-3 h-3 mr-1 ${stat.trend === "up" ? "rotate-0" : "rotate-180"}`}
                />
                {stat.change}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
