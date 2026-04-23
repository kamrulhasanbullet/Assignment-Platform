import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/lib/auth";
import StatCards from "@/src/modules/analytics/components/StatCards";
import Charts from "@/src/modules/analytics/components/Charts";
import { getAnalyticsData } from "@/src/modules/analytics/actions";
import DashboardShell from "@/src/components/layout/DashboardShell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "INSTRUCTOR") {
    redirect("/login");
  }

  const analyticsData = await getAnalyticsData();

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights into student performance and assignment
            trends
          </p>
        </div>

        <StatCards
          assignmentsStats={analyticsData.assignmentsStats}
          submissionsStats={analyticsData.submissionsStats}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Submission Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <Charts analyticsData={analyticsData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance by Difficulty</CardTitle>
            </CardHeader>
            <CardContent>
              <Charts analyticsData={analyticsData} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acceptance Rate Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <Charts analyticsData={analyticsData} />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
