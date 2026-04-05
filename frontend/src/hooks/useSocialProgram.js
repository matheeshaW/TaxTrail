import { useState, useCallback, useMemo, useEffect } from "react";
import socialProgramService from "../services/socialProgramService";

const getErrorMessage = (err) => {
  const data = err.response?.data;
  if (!data) return err.message || "Request failed";
  if (typeof data.message === "string") return data.message;
  if (Array.isArray(data.errors) && data.errors.length) {
    return data.errors.join(", ");
  }
  return "Request failed";
};

const regionId = (program) => {
  const r = program?.region;
  if (r && typeof r === "object" && r._id != null) return String(r._id);
  if (r != null) return String(r);
  return "";
};

/**
 * Social programs: fetch all from API, then filter + paginate on the client.
 */
export const useSocialProgram = () => {
  const [allPrograms, setAllPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filters, setFilters] = useState({
    sector: "",
    targetGroup: "",
    year: "",
    region: "",
  });

  const [selectedRecord, setSelectedRecord] = useState(null);

  const [inequalityData, setInequalityData] = useState(null);
  const [inequalityLoading, setInequalityLoading] = useState(false);

  const filteredPrograms = useMemo(() => {
    return allPrograms.filter((p) => {
      if (filters.sector && p.sector !== filters.sector) return false;
      if (filters.targetGroup && p.targetGroup !== filters.targetGroup) {
        return false;
      }
      if (filters.year !== "" && filters.year != null) {
        const y = Number(filters.year);
        if (!Number.isNaN(y) && Number(p.year) !== y) return false;
      }
      if (filters.region && regionId(p) !== String(filters.region)) {
        return false;
      }
      return true;
    });
  }, [allPrograms, filters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPrograms.length / pageSize),
  );

  useEffect(() => {
    setCurrentPage((prev) => (prev > totalPages ? totalPages : prev));
  }, [totalPages]);

  const data = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPrograms.slice(start, start + pageSize);
  }, [filteredPrograms, currentPage, pageSize]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await socialProgramService.getAll();
      setAllPrograms(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOne = useCallback(async (id) => {
    setError(null);
    try {
      const record = await socialProgramService.getOne(id);
      setSelectedRecord(record);
      return record;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, []);

  const create = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await socialProgramService.create(formData);
      setAllPrograms((prev) => [result, ...prev]);
      return result;
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id, formData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await socialProgramService.update(id, formData);
      setAllPrograms((prev) =>
        prev.map((item) => (item._id === id ? result : item)),
      );
      setSelectedRecord((prev) =>
        prev && prev._id === id ? result : prev,
      );
      return result;
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await socialProgramService.remove(id);
      setAllPrograms((prev) => prev.filter((item) => item._id !== id));
      setSelectedRecord((prev) => (prev && prev._id === id ? null : prev));
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      sector: "",
      targetGroup: "",
      year: "",
      region: "",
    });
    setCurrentPage(1);
  }, []);

  const fetchInequalityAnalysis = useCallback(async (country) => {
    const code = String(country ?? "").trim();
    if (!code) {
      setError("Country code is required");
      return null;
    }
    setInequalityLoading(true);
    setError(null);
    try {
      const result = await socialProgramService.getInequalityAnalysis(code);
      setInequalityData(result);
      return result;
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      throw err;
    } finally {
      setInequalityLoading(false);
    }
  }, []);

  const clearInequalityData = useCallback(() => {
    setInequalityData(null);
  }, []);

  const clearSelectedRecord = useCallback(() => {
    setSelectedRecord(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    allPrograms,
    filteredPrograms,
    filteredTotal: filteredPrograms.length,

    selectedRecord,
    clearSelectedRecord,

    inequalityData,
    inequalityLoading,
    fetchInequalityAnalysis,
    clearInequalityData,

    currentPage,
    totalPages,
    pageSize,
    setPageSize,
    setCurrentPage,

    filters,
    updateFilters,
    resetFilters,

    loading,
    error,
    clearError,

    fetchAll,
    fetchOne,
    create,
    update,
    remove,
  };
};

export default useSocialProgram;
