import API from "./api";

/**
 * Fetch all budget allocations with optional filters
 * @param {Object} params
 * @returns {Promise<{data: [], totalPages: number, currentPage: number}>}
 */
export const getAll = async (params = {}) => {
  const response = await API.get("/v1/budget-allocations", { params });
  const { data, total, page, pages, ...rest } = response.data;
  return {
    ...rest,
    data,
    total,
    totalPages: pages,
    currentPage: page,
  };
};

/**
 * Fetch single budget allocation by ID
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const getOne = async (id) => {
  const response = await API.get(`/v1/budget-allocations/${id}`);
  return response.data.data;
};

/**
 * Create new budget allocation (Admin only)
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const create = async (data) => {
  const response = await API.post("/v1/budget-allocations", data);
  return response.data.data;
};

/**
 * Update budget allocation (Admin only)
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const update = async (id, data) => {
  const response = await API.patch(`/v1/budget-allocations/${id}`, data);
  return response.data.data;
};

/**
 * Delete budget allocation (Admin only)
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const remove = async (id) => {
  const response = await API.delete(`/v1/budget-allocations/${id}`);
  return response.data.data;
};

/**
 * Get aggregate summary grouped by sector
 * @returns {Promise<Array>}
 */
export const getSummary = async () => {
  const response = await API.get("/v1/budget-allocations/summary/by-sector");
  return Array.isArray(response.data) ? response.data : response.data.data;
};

/**
 * Get budget summary for a specific year
 * @param {number} year
 * @returns {Promise<Array>}
 */
export const getSummaryByYear = async (year) => {
  const response = await API.get("/v1/budget-allocations/summary/by-sector", {
    params: { year },
  });
  return Array.isArray(response.data) ? response.data : response.data.data;
};

/**
 * Get available years with budget allocations
 * @returns {Promise<Array>}
 */
export const getAvailableYears = async () => {
  const response = await API.get(
    "/v1/budget-allocations/summary/available-years",
  );
  return response.data.data || [];
};

/**
 * Get inflation-adjusted allocations for a year
 * @param {number} year
 * @returns {Promise<Array>}
 */
export const getAdjusted = async (year) => {
  const response = await API.get(`/v1/budget-allocations/adjusted/${year}`);
  return response.data.data;
};

export default {
  getAll,
  getOne,
  create,
  update,
  remove,
  getSummary,
  getSummaryByYear,
  getAvailableYears,
  getAdjusted,
};
