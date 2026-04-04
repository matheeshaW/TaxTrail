import { useEffect, useState } from "react";
import { formatCurrency, formatWholePercent } from "../../utils/formatters";
import LoadingSpinner from "../Common/LoadingSpinner";

// View inflation-adjusted budget allocation
export default function InflationAdjustedView({
  data = [],
  loading = false,
  onFetch,
}) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 25 }, (_, i) => currentYear - i);

  useEffect(() => {
    if (onFetch) {
      onFetch(selectedYear);
    }
  }, [selectedYear, onFetch]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header & Year Selector */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Inflation-Adjusted View</h3>
            <p className="text-blue-100 text-sm mt-1">
              Compare original vs. inflation-adjusted amounts
            </p>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 bg-blue-500 text-white rounded-md border border-blue-400 focus:outline-none"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {data.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <p>No inflation data available for {selectedYear}.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Sector
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Original Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Inflation Rate
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Adjusted Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Difference
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((item) => {
                const difference = item.adjustedAmount - item.allocatedAmount;
                const isPositive = difference >= 0;

                return (
                  <tr
                    key={item._id || item.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.sector}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-700">
                      {formatCurrency(item.allocatedAmount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <span className="inline-flex px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold">
                        {formatWholePercent(item.inflationRate)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-semibold text-green-600">
                      {formatCurrency(item.adjustedAmount)}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm text-right font-semibold ${
                        isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {formatCurrency(difference)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Summary */}
          <div className="px-6 py-4 bg-gray-50 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Original</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {formatCurrency(
                    data.reduce((sum, item) => sum + item.allocatedAmount, 0),
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Inflation Rate</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {formatWholePercent(
                    data.reduce((sum, item) => sum + item.inflationRate, 0) /
                      data.length,
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Adjusted</p>
                <p className="text-lg font-semibold text-green-600 mt-1">
                  {formatCurrency(
                    data.reduce((sum, item) => sum + item.adjustedAmount, 0),
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
