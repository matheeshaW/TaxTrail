import { formatCurrency, formatDate, formatNumber } from "../../utils/formatters";
import LoadingSpinner from "../Common/LoadingSpinner";

export default function ProgramDetails({
  isOpen,
  record,
  loading,
  onClose,
  onEdit,
  isAdmin = false,
}) {
  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg text-center">
          <p className="text-gray-700">This record is no longer available.</p>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-800 hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Social program details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Program name</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {record.programName}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Sector</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {record.sector}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Target group</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {record.targetGroup}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Beneficiaries</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {formatNumber(record.beneficiariesCount)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Budget used</p>
              <p className="mt-1 text-lg font-semibold text-green-600">
                {formatCurrency(record.budgetUsed)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Year</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {record.year}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Region</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {record.region?.regionName || "—"}
              </p>
            </div>

            {record.createdBy?.name && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Created by</p>
                <p className="mt-1 text-gray-900">{record.createdBy.name}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="mt-1 text-gray-700">
                {formatDate(record.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Last updated</p>
              <p className="mt-1 text-gray-900">
                {formatDate(record.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
          {isAdmin && onEdit && (
            <button
              type="button"
              onClick={() => onEdit(record)}
              className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
            >
              Edit
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-800 transition hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
