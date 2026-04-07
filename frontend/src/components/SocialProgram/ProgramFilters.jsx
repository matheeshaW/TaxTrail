import { useEffect, useState } from "react";
import { SECTORS, SOCIAL_PROGRAM_TARGET_GROUPS, SOCIAL_PROGRAM_YEAR_MIN } from "../../utils/constants";
import RegionSelect from "../Common/RegionSelect";

export default function ProgramFilters({ filters, onFilterChange, onReset }) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleSectorChange = (e) => {
    const updated = { ...localFilters, sector: e.target.value };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const handleTargetGroupChange = (e) => {
    const updated = { ...localFilters, targetGroup: e.target.value };
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
      targetGroup: "",
      year: "",
      region: "",
    });
    onReset();
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - SOCIAL_PROGRAM_YEAR_MIN + 1 },
    (_, i) => currentYear - i,
  );

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Sector
          </label>
          <select
            value={localFilters.sector}
            onChange={handleSectorChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">All sectors</option>
            {SECTORS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Target group
          </label>
          <select
            value={localFilters.targetGroup || ""}
            onChange={handleTargetGroupChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">All groups</option>
            {SOCIAL_PROGRAM_TARGET_GROUPS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Year
          </label>
          <select
            value={localFilters.year}
            onChange={handleYearChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">All years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Region
          </label>
          <RegionSelect
            value={localFilters.region}
            onChange={handleRegionChange}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleReset}
          className="rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-800 transition hover:bg-gray-300"
        >
          Reset filters
        </button>
      </div>
    </div>
  );
}
