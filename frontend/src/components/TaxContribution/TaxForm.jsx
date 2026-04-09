import { useState } from "react";
import RegionSelect from "../Common/RegionSelect";
import YearPicker from "../Common/YearPicker";
import {
  INCOME_BRACKETS,
  PAYER_TYPES,
  TAX_TYPES,
} from "../../utils/constants";

export default function TaxForm({ onSubmit, initialData = {}, onClose }) {
  const [form, setForm] = useState({
    payerType: initialData.payerType || "Individual",
    incomeBracket: initialData.incomeBracket || "",
    taxType: initialData.taxType || "",
    amount: initialData.amount || "",
    year: initialData.year || "",
    region: initialData.region?._id || initialData.region || "",
  });
  const [errors, setErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const validate = (candidate = form) => {
    const nextErrors = {};

    if (!candidate.incomeBracket) {
      nextErrors.incomeBracket = "Please select an income bracket.";
    }

    if (!candidate.taxType) {
      nextErrors.taxType = "Please select a tax type.";
    }

    if (candidate.amount === "" || candidate.amount === null || candidate.amount === undefined) {
      nextErrors.amount = "Please enter an amount.";
    } else if (Number(candidate.amount) < 0) {
      nextErrors.amount = "Amount cannot be negative.";
    }

    if (!candidate.year) {
      nextErrors.year = "Please select or enter a year.";
    } else if (!/^\d{4}$/.test(String(candidate.year))) {
      nextErrors.year = "Please enter a valid 4-digit year.";
    }

    if (!candidate.region) {
      nextErrors.region = "Please select a region.";
    }

    return nextErrors;
  };

  const updateField = (field, value) => {
    const nextForm = { ...form, [field]: value };
    setForm(nextForm);

    if (submitAttempted) {
      setErrors(validate(nextForm));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitAttempted(true);
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit({
      ...form,
      amount: Number.parseFloat(form.amount),
      year: Number.parseInt(form.year, 10),
    });
  };

  return (
    <div className="mb-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {initialData._id ? "Edit Tax" : "Create Tax"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Fill in tax contribution details and save the record.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Payer Type</label>
          <select
            value={form.payerType}
            onChange={(e) => updateField("payerType", e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {PAYER_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Income Bracket</label>
          <select
            value={form.incomeBracket}
            onChange={(e) => updateField("incomeBracket", e.target.value)}
            aria-invalid={!!errors.incomeBracket}
            aria-describedby={errors.incomeBracket ? "income-bracket-error" : undefined}
            className={`w-full rounded-md p-2.5 outline-none transition focus:ring-2 ${
              errors.incomeBracket
                ? "border border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border border-gray-300 focus:border-blue-500 focus:ring-blue-100"
            }`}
          >
            <option value="">Select Income</option>
            {INCOME_BRACKETS.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
          {errors.incomeBracket && (
            <p id="income-bracket-error" className="text-xs text-red-600">
              {errors.incomeBracket}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Tax Type</label>
          <select
            value={form.taxType}
            onChange={(e) => updateField("taxType", e.target.value)}
            aria-invalid={!!errors.taxType}
            className={`w-full rounded-md p-2.5 outline-none transition focus:ring-2 ${
              errors.taxType
                ? "border border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border border-gray-300 focus:border-blue-500 focus:ring-blue-100"
            }`}
          >
            <option value="">Select Tax Type</option>
            {TAX_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Amount (LKR)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 150000"
            aria-invalid={!!errors.amount}
            className={`w-full rounded-md p-2.5 outline-none transition focus:ring-2 ${
              errors.amount
                ? "border border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border border-gray-300 focus:border-blue-500 focus:ring-blue-100"
            }`}
            value={form.amount}
            onChange={(e) => updateField("amount", e.target.value)}
          />
          {errors.amount && <p className="text-xs text-red-600">{errors.amount}</p>}
        </div>

        <YearPicker
          value={form.year}
          onChange={(value) => updateField("year", value)}
          placeholder="Enter year"
          error={submitAttempted ? errors.year : ""}
        />

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Region</label>
          <RegionSelect
            value={form.region}
            onChange={(value) => updateField("region", value)}
            invalid={!!errors.region}
          />
          {errors.region && <p className="text-xs text-red-600">{errors.region}</p>}
        </div>

        <div className="md:col-span-2 flex flex-col gap-2 pt-1 sm:flex-row sm:justify-end">
          <button className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700">
            Save
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}