import { useState, useCallback } from "react";
import * as taxService from "../services/taxContributionService";

export default function useTaxContribution() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    pages: 1,
  });

  const [filters, setFilters] = useState({
    region: "",
    year: "",
    incomeBracket: "",
    currency: "",
  });

  // FETCH ALL
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await taxService.getAllTax({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });

      setData(res.data.data);
      setPagination((prev) => ({
        ...prev,
        total: res.data.total,
        pages: res.data.pages,
      }));
    } catch (err) {
      setError("Failed to fetch tax data");
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  // FETCH SUMMARY
  const fetchSummary = async () => {
    try {
      const res = await taxService.getTaxSummary();
      setSummary(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  return {
    data,
    summary,
    loading,
    error,
    filters,
    setFilters,
    pagination,
    setPagination,
    fetchAll,
    fetchSummary,
  };
}