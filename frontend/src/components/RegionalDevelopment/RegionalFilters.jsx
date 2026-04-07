import React from 'react';

const RegionalFilters = ({ filters, onFilterChange, regions = [] }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row md:items-end gap-4">
      {/* Region Dropdown */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Region</label>
        <select
          name="region"
          value={filters.region || ''}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
        >
          <option value="">All Regions</option>
          {regions.map((r) => (
            <option key={r._id} value={r._id}>{r.regionName}</option>
          ))}
        </select>
      </div>

      {/* Year Input */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Year</label>
        <input
          type="number"
          name="year"
          placeholder="e.g., 2026"
          value={filters.year || ''}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Clear Filters Button */}
      <div>
        <button
          onClick={() => onFilterChange({ region: '', year: '' })}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors w-full md:w-auto"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default RegionalFilters;