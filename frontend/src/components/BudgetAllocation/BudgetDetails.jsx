import { useEffect } from "react";
import { formatCurrency, formatDate } from "../../utils/formatters";
import LoadingSpinner from "../Common/LoadingSpinner";

// details modal for single budget allocation
export default function BudgetDetails({
  isOpen,
  record,
  loading,
  onClose,
  onEdit,
}) {
  if (!isOpen) return null;

  if (loading || !record) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Budget Allocation Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sector */}
            <div>
              <p className="text-sm text-gray-500">Sector</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {record.sector}
              </p>
            </div>

            {/* Amount */}
            <div>
              <p className="text-sm text-gray-500">Allocated Amount</p>
              <p className="text-lg font-semibold text-green-600 mt-1">
                {formatCurrency(record.allocatedAmount)}
              </p>
            </div>

            {/* Income Group */}
            <div>
              <p className="text-sm text-gray-500">Target Income Group</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {record.targetIncomeGroup}
              </p>
            </div>

            {/* Year */}
            <div>
              <p className="text-sm text-gray-500">Year</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {record.year}
              </p>
            </div>

            {/* Region */}
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Region</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {record.region?.regionName || "-"}
              </p>
            </div>

            {/* Metadata */}
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="text-lg text-gray-700 mt-1">
                {formatDate(record.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {formatDate(record.updateAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(record)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition"
            >
              Edit
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
