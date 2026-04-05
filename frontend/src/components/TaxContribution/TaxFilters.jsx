import { useId } from "react";
import RegionSelect from "../Common/RegionSelect";
import { INCOME_BRACKETS, YEAR_OPTIONS } from "../../utils/constants";

export default function TaxFilters({ filters, setFilters, onApply }) {
  const yearListId = useId();

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
      <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Filter Tax Records</h2>
          <p className="text-sm text-gray-500">Narrow results by region, year, income group, or currency.</p>
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

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Year</label>
          <input
            type="text"
            list={yearListId}
            inputMode="numeric"
            pattern="[0-9]{4}"
            placeholder="Select or type year"
            className="w-full rounded-md border border-gray-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          />
          <datalist id={yearListId}>
            {YEAR_OPTIONS.map((year) => (
              <option key={year} value={year} />
            ))}
          </datalist>
        </div>

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

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={handleClear}
          className="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={onApply}
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>
    </section>
  );
}