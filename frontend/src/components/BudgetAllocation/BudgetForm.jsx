import { useEffect, useState } from "react";
import { SECTORS, INCOME_GROUPS } from "../../utils/constants";
import RegionSelect from "../Common/RegionSelect";

// Form for creating and editing allocations
export default function BudgetForm({
  isOpen,
  mode = "create",
  initialData = null,
  loading = false,
  onSubmit,
  onClose,
}) {
  const [formData, setFormData] = useState({
    sector: "",
    allocatedAmount: "",
    targetIncomeGroup: "",
    year: new Date().getFullYear().toString(),
    region: "",
  });

  const [errors, setErrors] = useState({});

  // Populate form when in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        sector: initialData.sector || "",
        allocatedAmount: initialData.allocatedAmount?.toString() || "",
        targetIncomeGroup: initialData.targetIncomeGroup || "",
        year: initialData.year?.toString() || "",
        region: initialData.region?._id || initialData.region || "",
      });
    } else {
      resetForm();
    }
    setErrors({});
  }, [mode, initialData, isOpen]);

  const resetForm = () => {
    setFormData({
      sector: "",
      allocatedAmount: "",
      targetIncomeGroup: "",
      year: new Date().getFullYear().toString(),
      region: "",
    });
  };

  // client side validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.sector) newErrors.sector = "Sector is required";
    if (!formData.allocatedAmount)
      newErrors.allocatedAmount = "Amount is required";
    if (parseFloat(formData.allocatedAmount) < 0)
      newErrors.allocatedAmount = "Amount cannot be negative";
    if (!formData.targetIncomeGroup)
      newErrors.targetIncomeGroup = "Income group is required";
    if (!formData.year) newErrors.year = "Year is required";
    if (parseInt(formData.year) < 2000)
      newErrors.year = "Year must be 2000 or later";
    if (!formData.region) newErrors.region = "Region is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRegionChange = (regionId) => {
    setFormData((prev) => ({ ...prev, region: regionId }));
    if (errors.region) {
      setErrors((prev) => ({ ...prev, region: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        allocatedAmount: parseFloat(formData.allocatedAmount),
        year: parseInt(formData.year),
      };

      await onSubmit(payload);
      resetForm();
      onClose();
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === "create" ? "New Budget Allocation" : "Edit Allocation"}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4">
          {/* Sector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sector <span className="text-red-500">*</span>
            </label>
            <select
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 ${
                errors.sector ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Sector...</option>
              {SECTORS.map((sector) => (
                <option key={sector.value} value={sector.value}>
                  {sector.label}
                </option>
              ))}
            </select>
            {errors.sector && (
              <p className="text-red-500 text-xs mt-1">{errors.sector}</p>
            )}
          </div>

          {/* Allocated Amount */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (LKR) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="allocatedAmount"
              value={formData.allocatedAmount}
              onChange={handleChange}
              min="0"
              step="1"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 ${
                errors.allocatedAmount ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="0"
            />
            {errors.allocatedAmount && (
              <p className="text-red-500 text-xs mt-1">
                {errors.allocatedAmount}
              </p>
            )}
          </div>

          {/* Income Group */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Income Group <span className="text-red-500">*</span>
            </label>
            <select
              name="targetIncomeGroup"
              value={formData.targetIncomeGroup}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 ${
                errors.targetIncomeGroup ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select income group...</option>
              {INCOME_GROUPS.map((group) => (
                <option key={group.value} value={group.value}>
                  {group.label}
                </option>
              ))}
            </select>
            {errors.targetIncomeGroup && (
              <p className="text-red-500 text-xs mt-1">
                {errors.targetIncomeGroup}
              </p>
            )}
          </div>

          {/* Year */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="2000"
              step="1"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 ${
                errors.year ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.year && (
              <p className="text-red-500 text-xs mt-1">{errors.year}</p>
            )}
          </div>

          {/* Region */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Region <span className="text-red-500">*</span>
            </label>
            <RegionSelect
              value={formData.region}
              onChange={handleRegionChange}
            />
            {errors.region && (
              <p className="text-red-500 text-xs mt-1">{errors.region}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md font-medium transition"
            >
              {loading ? "Saving..." : mode === "create" ? "Create" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
