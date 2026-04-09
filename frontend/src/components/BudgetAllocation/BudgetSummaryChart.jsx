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
export default function BudgetSummaryChart({
  data = [],
  loading = false,
  availableYears = [],
  selectedYear = null,
  onYearChange = () => {},
}) {
  const [chartType, setChartType] = useState("pie");

  if (loading) return <LoadingSpinner />;

  // Handle year change
  const handleYearChange = (newYear) => {
    onYearChange(newYear);
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No summary data available.</p>
      </div>
    );
  }

  const formattedData = data.map((item) => {
    const sector = item.sector ?? item._id ?? "Unknown";
    const total = item.total ?? item.totalAllocated ?? 0;
    const count = item.count ?? 0;
    return {
      ...item,
      sector,
      total,
      count,
      displayName: sector,
    };
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Budget by Sector
        </h3>

        {/* Year Filter */}
        {availableYears.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Year:</label>
            <select
              value={selectedYear || ""}
              onChange={(e) => handleYearChange(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Chart Type Toggle - RIGHT */}
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
