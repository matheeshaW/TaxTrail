import { useAuth } from "../../hooks/useAuth";
import { formatCurrency, formatDate, formatNumber } from "../../utils/formatters";
import Pagination from "../Common/Pagination";
import LoadingSpinner from "../Common/LoadingSpinner";

export default function ProgramTable({
  data,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onView,
  onDelete,
  filteredTotal,
  totalLoaded,
}) {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  if (loading) return <LoadingSpinner />;

  if (data.length === 0) {
    const filteredOut = totalLoaded > 0 && filteredTotal === 0;
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow">
        <p className="text-gray-500">
          {filteredOut
            ? "No programs match your filters."
            : "No social programs found."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Program
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Sector
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Target group
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Beneficiaries
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Budget
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Year
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Region
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Updated
              </th>
              <th className="w-56 px-6 py-3 text-center text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((record) => (
              <tr key={record._id} className="transition hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {record.programName}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                    {record.sector}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {record.targetGroup}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {formatNumber(record.beneficiariesCount)}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {formatCurrency(record.budgetUsed)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {record.year}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {record.region?.regionName || "—"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatDate(record.updatedAt)}
                </td>
                <td className="px-6 py-4 text-center align-middle">
                  <div className="flex flex-nowrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onView(record._id)}
                      className="inline-flex h-9 items-center justify-center rounded-md border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      View
                    </button>
                    {isAdmin && (
                      <>
                        <button
                          type="button"
                          onClick={() => onEdit(record)}
                          className="inline-flex h-9 items-center justify-center rounded-md border border-amber-300 bg-amber-50 px-3 text-sm font-medium text-amber-800 transition hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(record)}
                          className="inline-flex h-9 items-center justify-center rounded-md bg-red-600 px-3 text-sm font-medium text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
