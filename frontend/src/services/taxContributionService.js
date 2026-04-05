import API from "./api";

// GET all (with filters + pagination)
export const getAllTax = (params) => {
  return API.get("/v1/tax-contributions", { params });
};

// GET one
export const getTaxById = (id) => {
  return API.get(`/v1/tax-contributions/${id}`);
};

// CREATE
export const createTax = (data) => {
  return API.post("/v1/tax-contributions", data);
};

// UPDATE
export const updateTax = (id, data) => {
  return API.put(`/v1/tax-contributions/${id}`, data);
};

// DELETE
export const deleteTax = (id) => {
  return API.delete(`/v1/tax-contributions/${id}`);
};

// SUMMARY
export const getTaxSummary = () => {
  return API.get("/v1/tax-contributions/summary/region");
};