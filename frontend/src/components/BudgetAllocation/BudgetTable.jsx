import { useAuth } from "../../hooks/useAuth";
import { formatCurrency, formatDate } from "../../utils/formatters";
import Pagination from "../Common/Pagination";
import LoadingSpinner from "../Common/LoadingSpinner";

// Table of budget allocations
export default function BudgetTable({
  data,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onView,
  onDelete,
}) {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  if (loading) return <LoadingSpinner />;

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No budget allocations found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Sector
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Income Group
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Year
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Region
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((record) => (
              <tr key={record._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    {record.sector}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {record.targetIncomeGroup}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {formatCurrency(record.allocatedAmount)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {record.year}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {record.region?.regionName || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatDate(record.updateAt)}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    {/* View Button (all users)*/}
                    <button
                      onClick={() => onView(record._id)}
                      className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition"
                    >
                      View
                    </button>

                    {/* Edit Button (admin only)*/}
                    {isAdmin && (
                      <button
                        onClick={() => onEdit(record)}
                        className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded transition"
                      >
                        Edit
                      </button>
                    )}

                    {/* Delete Button (admin only)*/}
                    {isAdmin && (
                      <button
                        onClick={() => onDelete(record)}
                        className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
