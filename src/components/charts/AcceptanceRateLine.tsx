"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { format } from "date-fns";

interface AcceptanceRateLineProps {
  data: Array<{
    date: string;
    acceptanceRate: number;
    submissions: number;
  }>;
}

export default function AcceptanceRateLine({ data }: AcceptanceRateLineProps) {
  return (
    <Card className="h-[400px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Acceptance Rate Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => format(new Date(value), "MMM dd")}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              tickCount={5}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              labelFormatter={(value) =>
                format(new Date(value), "MMM dd, yyyy")
              }
              formatter={(value: number) => [
                `${(value * 100).toFixed(1)}%`,
                "Acceptance Rate",
              ]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="acceptanceRate"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ fill: "#10B981", strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
