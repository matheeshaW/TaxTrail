import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Sector,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import { formatCurrency } from "../../utils/formatters";
import LoadingSpinner from "../Common/LoadingSpinner";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

// chart showing budget allocation summary by sector
export default function BudgetSummaryChart({ data = [], loading = false }) {
  const [chartType, setChartType] = useState("bar");

  if (loading) return <LoadingSpinner />;

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No summary data available.</p>
      </div>
    );
  }

  const formattedData = data.map((item) => ({
    ...item,
    displayName: item.sector,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header & Toggle */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Budget by Sector
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType("bar")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition ${
              chartType === "bar"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Bar
          </button>
          <button
            onClick={() => setChartType("pie")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition ${
              chartType === "pie"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Pie
          </button>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        {chartType === "bar" ? (
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="displayName" />
            <YAxis />
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <Legend />
            <Bar
              dataKey="total"
              fill="#3b82f6"
              name="Total Amount"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={formattedData}
              dataKey="total"
              nameKey="displayName"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={(entry) => `${entry.displayName}`}
              shape={(props) => {
                const { index, ...rest } = props;
                return (
                  <Sector {...rest} fill={COLORS[index % COLORS.length]} />
                );
              }}
            />
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </PieChart>
        )}
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {formattedData.map((item) => (
          <div key={item.displayName} className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">{item.displayName}</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {formatCurrency(item.total)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {item.count} allocation{item.count !== 1 ? "s" : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
