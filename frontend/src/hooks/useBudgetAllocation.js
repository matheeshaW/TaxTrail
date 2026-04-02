import { useState, useCallback } from "react";
import budgetAllocationService from "../services/budgetAllocationService";

/**
 * Custom hook for budget allocation CRUD and state management
 * Handles: fetching, filtering, pagination, loading, errors
 */
export const useBudgetAllocation = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // filters
  const [filters, setFilters] = useState({
    sector: "",
    year: "",
    region: "",
  });

  // single record for details modal
  const [selectedRecord, setSelectedRecord] = useState(null);

  // summary data
  const [summary, setSummary] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // adjusted data for inflation view
  const [adjustedData, setAdjustedData] = useState([]);
  const [adjustedLoading, setAdjustedLoading] = useState(false);

  // fetch all allocations based on current filters & pagination
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        ...filters,
        page: currentPage,
        limit: pageSize,
      };

      // remove empty filter values
      Object.keys(params).forEach(
        (key) => params[key] === "" && delete params[key],
      );

      const result = await budgetAllocationService.getAll(params);
      setData(result.data || []);
      setTotalPages(result.totalPages || 1);
      setCurrentPage(result.currentPage || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, pageSize]);

  // fetch single record for details modal
  const fetchOne = useCallback(async (id) => {
    try {
      const record = await budgetAllocationService.getOne(id);
      setSelectedRecord(record);
      return record;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load record");
    }
  }, []);

  // create new allocation
  const create = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await budgetAllocationService.create(formData);
      setData((prev) => [result, ...prev]);
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to create";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // update existing allocation
  const update = useCallback(async (id, formData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await budgetAllocationService.update(id, formData);
      setData((prev) => prev.map((item) => (item._id === id ? result : item)));
      setSelectedRecord(result);
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // delete an allocation
  const remove = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await budgetAllocationService.remove(id);
      setData((prev) => prev.filter((item) => item._id !== id));
      setSelectedRecord(null);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to delete";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // change filters and reset to page 1
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, []);

  // fetch sector summary
  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const result = await budgetAllocationService.getSummary();
      setSummary(result);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load summary");
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // fetch inflation-adjusted data
  const fetchAdjusted = useCallback(async (year) => {
    setAdjustedLoading(true);
    try {
      const result = await budgetAllocationService.getAdjusted(year);
      setAdjustedData(result);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load adjusted data");
    } finally {
      setAdjustedLoading(false);
    }
  }, []);

  // clear all filters and reset state
  const resetFilters = useCallback(() => {
    setFilters({ sector: "", year: "", region: "" });
    setCurrentPage(1);
  }, []);

  // clear any stored error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // data
    data,
    selectedRecord,
    summary,
    adjustedData,

    // pagination
    currentPage,
    totalPages,
    pageSize,
    setPageSize,
    setCurrentPage,

    // filters
    filters,
    updateFilters,
    resetFilters,

    // states
    loading,
    summaryLoading,
    adjustedLoading,
    error,
    clearError,

    // actions
    fetchAll,
    fetchOne,
    create,
    update,
    remove,
    fetchSummary,
    fetchAdjusted,
  };
};

export default useBudgetAllocation;
