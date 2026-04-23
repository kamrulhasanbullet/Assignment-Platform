"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

interface DifficultyBarProps {
  data: Array<{
    difficulty: string;
    accepted: number;
    total: number;
    acceptanceRate: number;
  }>;
}

const DIFFICULTY_COLORS = {
  beginner: "#10B981",
  intermediate: "#F59E0B",
  advanced: "#EF4444",
};

export default function DifficultyBar({ data }: DifficultyBarProps) {
  return (
    <Card className="h-[400px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Performance by Difficulty</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="difficulty"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis tickCount={4} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <ReferenceLine y={0.5} strokeDasharray="3 3" stroke="#e5e7eb" />
            <Bar
              dataKey="acceptanceRate"
              name="Acceptance Rate"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              label={({ payload }) =>
                `${(payload.acceptanceRate * 100).toFixed(0)}%`
              }
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
