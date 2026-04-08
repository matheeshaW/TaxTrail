import { useEffect, useMemo, useState } from "react";
import {
  FALLBACK_CURRENCIES,
  POPULAR_CURRENCIES,
} from "../../utils/constants";

export default function CurrencySelect({ value, onChange }) {
  const [currencyOptions, setCurrencyOptions] = useState(FALLBACK_CURRENCIES);
  const [currencyError, setCurrencyError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    const loadCurrencies = async () => {
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/LKR");
        const payload = await response.json();

        if (!response.ok || payload?.result !== "success" || !payload?.rates) {
          throw new Error("Invalid currency response");
        }

        const codes = Object.keys(payload.rates)
          .filter((code) => code !== "LKR")
          .sort((a, b) => a.localeCompare(b));

        if (!isCancelled && codes.length > 0) {
          setCurrencyOptions(codes);
          setCurrencyError(null);
        }
      } catch {
        if (!isCancelled) {
          setCurrencyOptions(FALLBACK_CURRENCIES);
          setCurrencyError("Showing a fallback currency list.");
        }
      }
    };

    loadCurrencies();

    return () => {
      isCancelled = true;
    };
  }, []);

  const allCurrencies = useMemo(() => {
    const merged = new Set(currencyOptions);

    if (value) {
      merged.add(value);
    }

    return [...merged].sort((a, b) => a.localeCompare(b));
  }, [currencyOptions, value]);

  const popular = useMemo(
    () => POPULAR_CURRENCIES.filter((code) => allCurrencies.includes(code)),
    [allCurrencies],
  );

  const others = useMemo(
    () => allCurrencies.filter((code) => !popular.includes(code)),
    [allCurrencies, popular],
  );

  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">
        Currency
      </label>
      <select
        className="w-full rounded-md border border-gray-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">LKR</option>

        {popular.length > 0 && (
          <optgroup label="Popular">
            {popular.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </optgroup>
        )}

        {others.length > 0 && (
          <optgroup label="All Currencies">
            {others.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </optgroup>
        )}
      </select>
      {currencyError && <p className="text-xs text-amber-700">{currencyError}</p>}
    </div>
  );
}