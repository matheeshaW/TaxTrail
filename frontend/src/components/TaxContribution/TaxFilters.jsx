import RegionSelect from "../Common/RegionSelect";
import YearPicker from "../Common/YearPicker";
import { INCOME_BRACKETS } from "../../utils/constants";

export default function TaxFilters({ filters, setFilters, onApply }) {
  const handleClear = () => {
    setFilters({
      region: "",
      year: "",
      incomeBracket: "",
      currency: "",
    });
  };

  return (
    <section className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Filter Tax Records</h2>
          <p className="text-sm text-gray-500">Narrow results by region, year, income group, or currency.</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onApply}
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Region</label>
          <RegionSelect
            value={filters.region}
            onChange={(value) => setFilters({ ...filters, region: value })}
          />
        </div>

        <YearPicker
          value={filters.year}
          onChange={(value) => setFilters({ ...filters, year: value })}
          placeholder="Enter year"
        />

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Income Bracket</label>
          <select
            className="w-full rounded-md border border-gray-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={filters.incomeBracket}
            onChange={(e) =>
              setFilters({ ...filters, incomeBracket: e.target.value })
            }
          >
            <option value="">All Income</option>
            {INCOME_BRACKETS.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Currency</label>
          <select
            className="w-full rounded-md border border-gray-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={filters.currency}
            onChange={(e) =>
              setFilters({ ...filters, currency: e.target.value })
            }
          >
            <option value="">LKR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>

    </section>
  );
}