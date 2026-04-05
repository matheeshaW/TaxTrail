import { formatCurrency, formatNumber } from "../../utils/formatters";
import LoadingSpinner from "../Common/LoadingSpinner";

export default function InequalityAnalysis({
  countryCode,
  onCountryChange,
  onAnalyze,
  data,
  loading,
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">
        Inequality analysis
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        Gini index and program context (World Bank–style country code, e.g. LKA)
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div>
          <label
            htmlFor="inequality-country"
            className="mb-1 block text-xs font-medium text-gray-600"
          >
            Country code
          </label>
          <input
            id="inequality-country"
            type="text"
            value={countryCode}
            onChange={(e) => onCountryChange(e.target.value.toUpperCase())}
            maxLength={6}
            placeholder="LKA"
            className="w-32 rounded-md border border-gray-300 px-3 py-2 uppercase focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={() => onAnalyze(countryCode)}
          disabled={loading || !String(countryCode).trim()}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
        >
          {loading ? "Loading…" : "Run analysis"}
        </button>
      </div>

      {loading && (
        <div className="mt-6 flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {!loading && data && (
        <div className="mt-6 space-y-4 border-t border-gray-100 pt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium text-gray-500">Gini index</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {data.giniIndex != null ? data.giniIndex : "—"}
              </p>
              {data.giniYear != null && (
                <p className="text-xs text-gray-500">Year {data.giniYear}</p>
              )}
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium text-gray-500">
                Programs (dataset)
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {formatNumber(data.totalPrograms)}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium text-gray-500">
                Total beneficiaries
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {formatNumber(data.totalBeneficiaries)}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 sm:col-span-2 lg:col-span-3">
              <p className="text-xs font-medium text-gray-500">
                Total budget used
              </p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {formatCurrency(data.totalBudgetUsed)}
              </p>
            </div>
          </div>

          {data.sdgAlignment && (
            <p className="text-sm font-medium text-blue-800">{data.sdgAlignment}</p>
          )}

          {data.analysis && (
            <div className="rounded-lg border border-indigo-100 bg-indigo-50/80 p-4">
              <p className="text-sm font-medium text-indigo-900">Insight</p>
              <p className="mt-2 text-sm leading-relaxed text-indigo-950">
                {data.analysis}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
