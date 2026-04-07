import API from "./api";

/**
 * Fetch all social programs (array; no server-side pagination)
 * @returns {Promise<Array>}
 */
export const getAll = async () => {
  const response = await API.get("/socialprograms");
  const { data } = response;
  return Array.isArray(data) ? data : [];
};

/**
 * Fetch a single social program by ID
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const getOne = async (id) => {
  const response = await API.get(`/socialprograms/${id}`);
  return response.data;
};

/**
 * Create a social program (Admin only)
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const create = async (data) => {
  const response = await API.post("/socialprograms", data);
  return response.data;
};

/**
 * Update a social program (Admin only)
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const update = async (id, data) => {
  const response = await API.put(`/socialprograms/${id}`, data);
  return response.data;
};

/**
 * Delete a social program (Admin only). Server responds 204 with no body.
 * @param {string} id
 * @returns {Promise<void>}
 */
export const remove = async (id) => {
  await API.delete(`/socialprograms/${id}`);
};

/**
 * Gini / inequality analysis for a World Bank country code (e.g. LKA)
 * @param {string} country
 * @returns {Promise<Object>}
 */
export const getInequalityAnalysis = async (country) => {
  const code = encodeURIComponent(String(country).trim());
  const response = await API.get(
    `/socialprograms/inequality-analysis/${code}`,
  );
  return response.data;
};

export default {
  getAll,
  getOne,
  create,
  update,
  remove,
  getInequalityAnalysis,
};
