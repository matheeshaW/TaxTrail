import { useId, useState } from "react";
import RegionSelect from "../Common/RegionSelect";
import {
  INCOME_BRACKETS,
  PAYER_TYPES,
  TAX_TYPES,
  YEAR_OPTIONS,
} from "../../utils/constants";

export default function TaxForm({ onSubmit, initialData = {}, onClose }) {
  const yearListId = useId();

  const [form, setForm] = useState({
    payerType: initialData.payerType || "Individual",
    incomeBracket: initialData.incomeBracket || "",
    taxType: initialData.taxType || "",
    amount: initialData.amount || "",
    year: initialData.year || "",
    region: initialData.region?._id || initialData.region || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
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
            onChange={(e) => setForm({ ...form, payerType: e.target.value })}
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
            onChange={(e) =>
              setForm({ ...form, incomeBracket: e.target.value })
            }
            className="w-full rounded-md border border-gray-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select Income</option>
            {INCOME_BRACKETS.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Tax Type</label>
          <select
            value={form.taxType}
            onChange={(e) => setForm({ ...form, taxType: e.target.value })}
            className="w-full rounded-md border border-gray-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
            className="w-full rounded-md border border-gray-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
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
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          />
          <datalist id={yearListId}>
            {YEAR_OPTIONS.map((year) => (
              <option key={year} value={year} />
            ))}
          </datalist>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Region</label>
          <RegionSelect
            value={form.region}
            onChange={(value) => setForm({ ...form, region: value })}
          />
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