import API from "./api";

/**
 * Fetch all budget allocations with optional filters
 * @param {Object} params
 * @returns {Promise<{data: [], totalPages: number, currentPage: number}>}
 */
export const getAll = async (params = {}) => {
  const response = await API.get("/v1/budget-allocations", { params });
  return response.data;
};

/**
 * Fetch single budget allocation by ID
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const getOne = async (id) => {
  const response = await API.get(`/v1/budget-allocations/${id}`);
  return response.data;
};

/**
 * Create new budget allocation (Admin only)
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const create = async (data) => {
  const response = await API.post("/v1/budget-allocations", data);
  return response.data;
};

/**
 * Update budget allocation (Admin only)
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const update = async (id, data) => {
  const response = await API.put(`/v1/budget-allocations/${id}`, data);
  return response.data;
};

/**
 * Delete budget allocation (Admin only)
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const remove = async (id) => {
  const response = await API.delete(`/v1/budget-allocations/${id}`);
  return response.data;
};

/**
 * Get aggregate summary grouped by sector
 * @returns {Promise<Array>}
 */
export const getSummary = async () => {
  const response = await API.get("/v1/budget-allocations/summary/by-sector");
  return response.data;
};

/**
 * Get inflation-adjusted allocations for a year
 * @param {number} year
 * @returns {Promise<Array>}
 */
export const getAdjusted = async (year) => {
  const response = await API.get(`/v1/budget-allocations/adjusted/${year}`);
  return response.data;
};

export default {
  getAll,
  getOne,
  create,
  update,
  remove,
  getSummary,
  getAdjusted,
};
