import { useEffect, useState } from "react";
import API from "../../services/api";

/**
 * Controlled region dropdown component
 * Shared across all module
 */
export default function RegionSelect({
  value,
  onChange,
  disabled = false,
  placeholder = "Select a region...",
}) {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // fetch regions on mount
  useEffect(() => {
    const fetchRegions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.get("/v1/regions");
        const regionList = response.data.data || response.data;
        setRegions(Array.isArray(regionList) ? regionList : []);
      } catch (err) {
        console.error("Failed to fetch regions:", err);
        setError("Failed to load regions");
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  if (loading) {
    return (
      <select
        disabled
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
      >
        <option>Loading regions...</option>
      </select>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600 p-2 bg-red-50 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={disabled}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 ${
        disabled
          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
          : "border-gray-300 bg-white text-gray-900"
      }`}
    >
      <option value="">{placeholder}</option>
      {regions.map((region) => (
        <option key={region._id} value={region._id}>
          {region.regionName || region.name}
        </option>
      ))}
    </select>
  );
}
