import useAuth from "../../hooks/useAuth";
import CurrencyBadge from "./CurrencyBadge";

export default function TaxTable({ data, onEdit, onDelete, onView }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
          Tax Records
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
          <tr>
            <th className="px-4 py-3 font-semibold">Payer Type</th>
            <th className="px-4 py-3 font-semibold">Tax Type</th>
            <th className="px-4 py-3 font-semibold">Income Bracket</th>
            <th className="px-4 py-3 font-semibold">Amount</th>
            <th className="px-4 py-3 font-semibold">Year</th>
            <th className="px-4 py-3 font-semibold">Region</th>
            <th className="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="px-4 py-10 text-center text-sm text-gray-500"
              >
                No tax records found for the current filters.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item._id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.payerType}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.taxType}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.incomeBracket}</td>
                <td className="px-4 py-3 text-sm text-gray-800">
                  <CurrencyBadge item={item} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.year}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.region?.regionName || "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView(item._id)}
                      className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      View
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => onEdit(item)}
                        className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:from-amber-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-amber-300"
                      >
                        Edit
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => onDelete(item._id)}
                        className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-red-600 to-rose-600 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:from-red-700 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
    </section>
  );
}