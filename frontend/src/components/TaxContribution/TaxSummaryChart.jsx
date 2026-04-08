import { memo, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency, formatNumber } from "../../utils/formatters";

function TaxSummaryChart({ data }) {
  const chartData = useMemo(
    () =>
      (data || []).map((item) => ({
        ...item,
        regionName: item.regionName || "Unknown Region",
        totalTax: Number(item.totalTax || 0),
      })),
    [data],
  );

  const summary = useMemo(() => {
    const regionsCount = chartData.length;
    const totalRevenue = chartData.reduce((sum, item) => sum + item.totalTax, 0);
    const averageRevenue = regionsCount > 0 ? totalRevenue / regionsCount : 0;
    const topRegion =
      chartData.length > 0
        ? [...chartData].sort((a, b) => b.totalTax - a.totalTax)[0]
        : null;

    return {
      regionsCount,
      totalRevenue,
      averageRevenue,
      topRegion,
    };
  }, [chartData]);

  if (!chartData.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Revenue by Region</h2>
        <p className="mt-2 text-sm text-gray-500">No summary data available for the selected criteria.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
      <h2 className="mb-1 text-lg font-semibold text-gray-900">
        Revenue by Region
      </h2>
      <p className="mb-5 text-sm text-gray-500">Compare total tax contribution amounts across regions.</p>

      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Total Revenue</p>
          <p className="mt-1 text-lg font-semibold text-blue-900">
            {formatCurrency(summary.totalRevenue)}
          </p>
        </div>
        <div className="rounded-lg bg-emerald-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Top Region</p>
          <p className="mt-1 text-lg font-semibold text-emerald-900">
            {summary.topRegion?.regionName || "-"}
          </p>
          <p className="mt-1 text-xs text-emerald-800">
            {summary.topRegion ? formatCurrency(summary.topRegion.totalTax) : "-"}
          </p>
        </div>
        <div className="rounded-lg bg-amber-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Average Per Region</p>
          <p className="mt-1 text-lg font-semibold text-amber-900">
            {formatCurrency(summary.averageRevenue)}
          </p>
          <p className="mt-1 text-xs text-amber-800">Across {summary.regionsCount} region(s)</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="regionName" />
          <YAxis tickFormatter={(value) => formatNumber(value)} />
          <Tooltip
            formatter={(value) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Bar dataKey="totalTax" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {chartData.map((item) => (
          <div key={item._id || item.regionName} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-700">{item.regionName}</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {formatCurrency(item.totalTax)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(TaxSummaryChart);