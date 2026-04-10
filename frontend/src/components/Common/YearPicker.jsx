import { useMemo, useState } from "react";
import { YEAR_OPTIONS } from "../../utils/constants";

const CUSTOM_VALUE = "__custom_year__";

export default function YearPicker({
  value,
  onChange,
  label = "Year",
  placeholder = "Enter year",
  error = "",
}) {
  const normalizedValue = value ? String(value) : "";
  const hasPresetValue = YEAR_OPTIONS.includes(normalizedValue);
  const [customMode, setCustomMode] = useState(
    normalizedValue !== "" && !hasPresetValue,
  );

  const selectValue = useMemo(() => {
    if (customMode) return CUSTOM_VALUE;
    return hasPresetValue ? normalizedValue : "";
  }, [customMode, hasPresetValue, normalizedValue]);

  const handleSelectChange = (event) => {
    const selected = event.target.value;

    if (selected === CUSTOM_VALUE) {
      setCustomMode(true);
      if (hasPresetValue || !normalizedValue) {
        onChange("");
      }
      return;
    }

    setCustomMode(false);
    onChange(selected);
  };

  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">
        {label}
      </label>

      <div className="space-y-2">
        <select
          aria-invalid={!!error}
          className={`w-full rounded-md bg-white p-2.5 outline-none transition focus:ring-2 ${
            error
              ? "border border-red-300 focus:border-red-500 focus:ring-red-100"
              : "border border-gray-300 focus:border-blue-500 focus:ring-blue-100"
          }`}
          value={selectValue}
          onChange={handleSelectChange}
        >
          <option value="">Select year</option>
          {YEAR_OPTIONS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
          <option value={CUSTOM_VALUE}>Custom year...</option>
        </select>

        {customMode && (
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength={4}
            placeholder={placeholder}
            aria-invalid={!!error}
            className={`w-full rounded-md p-2.5 outline-none transition focus:ring-2 ${
              error
                ? "border border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border border-gray-300 focus:border-blue-500 focus:ring-blue-100"
            }`}
            value={normalizedValue}
            onChange={(event) => onChange(event.target.value)}
          />
        )}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
