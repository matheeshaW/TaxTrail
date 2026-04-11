import useAuth from "../../hooks/useAuth";
import { createPortal } from "react-dom";
import { formatCurrency, formatDate } from "../../utils/formatters";
import LoadingSpinner from "../Common/LoadingSpinner";

export default function TaxContributionDetails({
  isOpen,
  record,
  loading,
  onClose,
  onEdit,
}) {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  if (!isOpen) return null;

  if (loading || !record) {
    return createPortal(
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
        <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <LoadingSpinner />
        </div>
      </div>,
      document.body,
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="mx-4 w-full max-w-2xl rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Tax Contribution Details</h2>
          <button
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-gray-700"
            aria-label="Close details"
          >
            x
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Payer Type</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{record.payerType || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Tax Type</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{record.taxType || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Income Bracket</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{record.incomeBracket || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="mt-1 text-lg font-semibold text-green-600">{formatCurrency(record.amount)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Year</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{record.year || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Region</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{record.region?.regionName || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="mt-1 text-lg text-gray-700">{formatDate(record.createdAt)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{formatDate(record.updatedAt)}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
          {isAdmin && (
            <button
              onClick={() => onEdit(record)}
              className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
            >
              Edit
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-800 transition hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}