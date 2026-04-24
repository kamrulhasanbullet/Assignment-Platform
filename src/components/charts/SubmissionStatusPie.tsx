"use client";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SubmissionStatusPieProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  totalSubmissions: number;
}

const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

export default function SubmissionStatusPie({
  data,
  totalSubmissions,
}: SubmissionStatusPieProps) {
  return (
    <Card className="h-[400px]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Submission Status</CardTitle>
          <Badge variant="secondary">{totalSubmissions} total</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value}`, "Submissions"]}
              labelFormatter={(name) => `Status: ${name}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
