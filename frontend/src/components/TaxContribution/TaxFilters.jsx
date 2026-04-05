import RegionSelect from "../Common/RegionSelect";
import { INCOME_GROUPS } from "../../utils/constants";

export default function TaxFilters({ filters, setFilters, onApply }) {
  return (
    <div className="bg-white p-4 rounded shadow mb-4 grid grid-cols-4 gap-4">

      {/* Region */}
      <RegionSelect
        value={filters.region}
        onChange={(value) => setFilters({ ...filters, region: value })}
      />

      {/* Year */}
      <input
        type="number"
        placeholder="Year"
        className="border p-2"
        value={filters.year}
        onChange={(e) => setFilters({ ...filters, year: e.target.value })}
      />

      {/* Income Bracket */}
      <select
        className="border p-2"
        value={filters.incomeBracket}
        onChange={(e) =>
          setFilters({ ...filters, incomeBracket: e.target.value })
        }
      >
        <option value="">All Income</option>
        {INCOME_GROUPS.map((i) => (
          <option key={i.value} value={i.value}>
            {i.label}
          </option>
        ))}
      </select>

      {/* Currency */}
      <select
        className="border p-2"
        value={filters.currency}
        onChange={(e) =>
          setFilters({ ...filters, currency: e.target.value })
        }
      >
        <option value="">LKR</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
      </select>

      {/* Apply Button */}
      <button
        onClick={onApply}
        className="col-span-4 bg-blue-500 text-white p-2"
      >
        Apply Filters
      </button>
    </div>
  );
}