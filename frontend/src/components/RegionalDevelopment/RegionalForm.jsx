import React, { useState, useEffect } from 'react';

const RegionalForm = ({ initialData, onSubmit, onCancel, regions = [] }) => {
  // Set default values, or load existing data if we are Editing
  const [formData, setFormData] = useState({
    region: '',
    year: new Date().getFullYear(),
    averageIncome: '',
    unemploymentRate: '',
    povertyRate: '',
    accessToServicesIndex: 50,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        region: initialData.region?._id || initialData.region || '',
        year: initialData.year || new Date().getFullYear(),
        averageIncome: initialData.averageIncome || '',
        unemploymentRate: initialData.unemploymentRate || '',
        povertyRate: initialData.povertyRate || '',
        accessToServicesIndex: initialData.accessToServicesIndex || 50,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {initialData ? 'Edit Regional Data' : 'Add New Regional Data'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Region Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a Region...</option>
             {regions.map((r) => (
  <option key={r._id} value={r._id}>{r.regionName}</option>
))}
            </select>
          </div>

          {/* Year Input (Validation: Min 2000) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              type="number"
              name="year"
              min="2000"
              max="2030"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Average Income */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Average Income (LKR)</label>
            <input
              type="number"
              name="averageIncome"
              min="0"
              value={formData.averageIncome}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Unemployment Rate (Validation: 0-100) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unemployment Rate (%)</label>
            <input
              type="number"
              step="0.1"
              name="unemploymentRate"
              min="0"
              max="100"
              value={formData.unemploymentRate}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Poverty Rate (Validation: 0-100) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Poverty Rate (%)</label>
            <input
              type="number"
              step="0.1"
              name="povertyRate"
              min="0"
              max="100"
              value={formData.povertyRate}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Access to Services Index (Validation: 0-100) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Services Index (0-100)</label>
            <input
              type="number"
              name="accessToServicesIndex"
              min="0"
              max="100"
              value={formData.accessToServicesIndex}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition-colors"
          >
            {initialData ? 'Update Record' : 'Save Record'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegionalForm;