import { useState, useCallback } from 'react';
import regionalDevelopmentService from '../services/regionalDevelopmentService';

const useRegionalDevelopment = () => {
  // --- State ---
  const [data, setData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [inequalityData, setInequalityData] = useState(null);
  const [sdgMetrics, setSdgMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  // --- Methods ---

  // Get all records (with filters/pagination)
  const fetchAll = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await regionalDevelopmentService.getAll(params);
      setData(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to fetch regional data.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a single record
  const fetchOne = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await regionalDevelopmentService.getOne(id);
      setSelectedRecord(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to fetch record details.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new record
  const create = async (recordData) => {
    setLoading(true);
    setError(null);
    try {
      await regionalDevelopmentService.create(recordData);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to create record.');
      throw err; 
    } finally {
      setLoading(false);
    }
  };

  // Update a record
  const update = async (id, recordData) => {
    setLoading(true);
    setError(null);
    try {
      await regionalDevelopmentService.update(id, recordData);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to update record.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a record
  const remove = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await regionalDevelopmentService.delete(id);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to delete record.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ANALYTICS: Fetch Gini Index Comparison
  const fetchInequalityIndex = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await regionalDevelopmentService.getInequalityIndex();
      setInequalityData(response); 
    } catch (err) {
      console.error("Inequality Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ANALYTICS: Fetch specific SDG 10 Metrics
  const fetchSDGMetrics = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await regionalDevelopmentService.getSDGMetrics(id);
      setSdgMetrics(response); 
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to fetch SDG metrics.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // State
    data,
    selectedRecord,
    inequalityData,
    sdgMetrics,
    loading,
    error,
    pagination,
    // Methods
    fetchAll,
    fetchOne,
    create,
    update,
    remove,
    fetchInequalityIndex,
    fetchSDGMetrics
  };
};

export default useRegionalDevelopment;