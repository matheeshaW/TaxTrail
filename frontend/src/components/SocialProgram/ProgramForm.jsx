import { useEffect, useState } from "react";
import { SECTORS, SOCIAL_PROGRAM_TARGET_GROUPS } from "../../utils/constants";
import {
  validateSocialProgramProgramName,
  validateSocialProgramSector,
  validateSocialProgramTargetGroup,
  validateSocialProgramBeneficiariesCount,
  validateSocialProgramBudgetUsed,
  validateSocialProgramYear,
  validateSocialProgramRegion,
  validateSocialProgramLowIncomeBeneficiaries,
  validateSocialProgramBudgetPerBeneficiary,
} from "../../utils/validators";
import RegionSelect from "../Common/RegionSelect";

export default function ProgramForm({
  isOpen,
  mode = "create",
  initialData = null,
  loading = false,
  onSubmit,
  onClose,
}) {
  const [formData, setFormData] = useState({
    programName: "",
    sector: "",
    targetGroup: "",
    beneficiariesCount: "",
    budgetUsed: "",
    year: String(new Date().getFullYear()),
    region: "",
  });

  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setFormData({
      programName: "",
      sector: "",
      targetGroup: "",
      beneficiariesCount: "",
      budgetUsed: "",
      year: String(new Date().getFullYear()),
      region: "",
    });
  };

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        programName: initialData.programName || "",
        sector: initialData.sector || "",
        targetGroup: initialData.targetGroup || "",
        beneficiariesCount:
          initialData.beneficiariesCount != null
            ? String(initialData.beneficiariesCount)
            : "",
        budgetUsed:
          initialData.budgetUsed != null ? String(initialData.budgetUsed) : "",
        year: initialData.year != null ? String(initialData.year) : "",
        region: initialData.region?._id || initialData.region || "",
      });
    } else {
      resetForm();
    }
    setErrors({});
  }, [mode, initialData, isOpen]);

  const validateForm = () => {
    const next = {};
    const setIf = (key, msg) => {
      if (msg) next[key] = msg;
    };

    setIf("programName", validateSocialProgramProgramName(formData.programName));
    setIf("sector", validateSocialProgramSector(formData.sector));
    setIf(
      "targetGroup",
      validateSocialProgramTargetGroup(formData.targetGroup),
    );

    const benFieldErr = validateSocialProgramBeneficiariesCount(
      formData.beneficiariesCount,
    );
    const bc = parseInt(formData.beneficiariesCount, 10);
    const benLowIncomeErr = benFieldErr
      ? null
      : validateSocialProgramLowIncomeBeneficiaries(
          formData.targetGroup,
          Number.isNaN(bc) ? 0 : bc,
        );
    setIf("beneficiariesCount", benFieldErr || benLowIncomeErr);

    const budgetErr = validateSocialProgramBudgetUsed(formData.budgetUsed);
    setIf("budgetUsed", budgetErr);
    if (!budgetErr) {
      setIf(
        "budgetUsed",
        validateSocialProgramBudgetPerBeneficiary(
          Number.isNaN(bc) ? 0 : bc,
          formData.budgetUsed,
        ),
      );
    }

    setIf("year", validateSocialProgramYear(formData.year));
    setIf("region", validateSocialProgramRegion(formData.region));

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRegionChange = (regionId) => {
    setFormData((prev) => ({ ...prev, region: regionId }));
    if (errors.region) {
      setErrors((prev) => ({ ...prev, region: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const beneficiariesCount = parseInt(formData.beneficiariesCount, 10);
    const payload = {
      programName: formData.programName.trim(),
      sector: formData.sector,
      targetGroup: formData.targetGroup,
      beneficiariesCount,
      budgetUsed: parseFloat(formData.budgetUsed),
      year: parseInt(formData.year, 10),
      region: formData.region,
    };

    try {
      await onSubmit(payload);
      resetForm();
      onClose();
    } catch {
      /* parent sets error */
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-lg">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === "create" ? "New social program" : "Edit social program"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Program name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="programName"
              value={formData.programName}
              onChange={handleChange}
              className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.programName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.programName && (
              <p className="mt-1 text-xs text-red-500">{errors.programName}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Sector <span className="text-red-500">*</span>
            </label>
            <select
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.sector ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select sector…</option>
              {SECTORS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            {errors.sector && (
              <p className="mt-1 text-xs text-red-500">{errors.sector}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Target group <span className="text-red-500">*</span>
            </label>
            <select
              name="targetGroup"
              value={formData.targetGroup}
              onChange={handleChange}
              className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.targetGroup ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select target group…</option>
              {SOCIAL_PROGRAM_TARGET_GROUPS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
            {errors.targetGroup && (
              <p className="mt-1 text-xs text-red-500">{errors.targetGroup}</p>
            )}
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Beneficiaries <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="beneficiariesCount"
                value={formData.beneficiariesCount}
                onChange={handleChange}
                min="0"
                step="1"
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.beneficiariesCount
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.beneficiariesCount && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.beneficiariesCount}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Budget (LKR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="budgetUsed"
                value={formData.budgetUsed}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.budgetUsed ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.budgetUsed && (
                <p className="mt-1 text-xs text-red-500">{errors.budgetUsed}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Year <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear()}
              step="1"
              className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.year ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.year && (
              <p className="mt-1 text-xs text-red-500">{errors.year}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Region <span className="text-red-500">*</span>
            </label>
            <RegionSelect value={formData.region} onChange={handleRegionChange} />
            {errors.region && (
              <p className="mt-1 text-xs text-red-500">{errors.region}</p>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-800 transition hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? "Saving…" : mode === "create" ? "Create" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
