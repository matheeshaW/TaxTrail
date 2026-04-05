import { useState } from "react";
import RegionSelect from "../Common/RegionSelect";
import { INCOME_BRACKETS, PAYER_TYPES, TAX_TYPES } from "../../utils/constants";

export default function TaxForm({ onSubmit, initialData = {}, onClose }) {
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
    <div className="bg-white p-6 rounded shadow">

      <h2 className="text-xl font-bold mb-4">
        {initialData._id ? "Edit Tax" : "Create Tax"}
      </h2>

      <form onSubmit={handleSubmit} className="grid gap-3">

        <select
          value={form.payerType}
          onChange={(e) => setForm({ ...form, payerType: e.target.value })}
          className="border p-2"
        >
          {PAYER_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={form.incomeBracket}
          onChange={(e) =>
            setForm({ ...form, incomeBracket: e.target.value })
          }
          className="border p-2"
        >
          <option value="">Select Income</option>
          {INCOME_BRACKETS.map((i) => (
            <option key={i.value} value={i.value}>
              {i.label}
            </option>
          ))}
        </select>

        <select
          value={form.taxType}
          onChange={(e) => setForm({ ...form, taxType: e.target.value })}
          className="border p-2"
        >
          <option value="">Select Tax Type</option>
          {TAX_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount"
          className="border p-2"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <input
          type="number"
          placeholder="Year"
          className="border p-2"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
        />

        <RegionSelect
          value={form.region}
          onChange={(value) => setForm({ ...form, region: value })}
        />

        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-4 py-2">
            Save
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}