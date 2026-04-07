import { useEffect, useState } from "react";
import { SECTORS, INCOME_GROUPS } from "../../utils/constants";
import RegionSelect from "../Common/RegionSelect";

// filter bar for budget allocations
export default function BudgetFilters({ filters, onFilterChange, onReset }) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleSectorChange = (e) => {
    const updated = { ...localFilters, sector: e.target.value };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const handleIncomeGroupChange = (e) => {
    const updated = { ...localFilters, targetIncomeGroup: e.target.value };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const handleYearChange = (e) => {
    const updated = { ...localFilters, year: e.target.value };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const handleRegionChange = (region) => {
    const updated = { ...localFilters, region };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const handleReset = () => {
    setLocalFilters({
      sector: "",
      year: "",
      region: "",
      targetIncomeGroup: "",
    });
    onReset();
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 25 }, (_, i) => currentYear - i);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sector Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sector
          </label>
          <select
            value={localFilters.sector}
            onChange={handleSectorChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Sectors</option>
            {SECTORS.map((sector) => (
              <option key={sector.value} value={sector.value}>
                {sector.label}
              </option>
            ))}
          </select>
        </div>
        {/* Income Group Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Income Group
          </label>
          <select
            value={localFilters.targetIncomeGroup || ""}
            onChange={handleIncomeGroupChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Groups</option>
            {INCOME_GROUPS.map((group) => (
              <option key={group.value} value={group.value}>
                {group.label}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <select
            value={localFilters.year}
            onChange={handleYearChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Region Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Region
          </label>
          <RegionSelect
            value={localFilters.region}
            onChange={handleRegionChange}
          />
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium transition"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
