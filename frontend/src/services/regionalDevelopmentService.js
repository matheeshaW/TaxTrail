import api from './api';

const API_URL = '/v1/regional-development';

const regionalDevelopmentService = {
  // 1. CRUD: Get all records (supports pagination and filtering)
  getAll: async (params) => {
    const response = await api.get(API_URL, { params });
    return response.data;
  },

  // 2. CRUD: Get a single record by ID
  getOne: async (id) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  },

  // 3. CRUD: Create a new regional record
  create: async (data) => {
    const response = await api.post(API_URL, data);
    return response.data;
  },

  // 4. CRUD: Update an existing record
  update: async (id, data) => {
    const response = await api.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  // 5. CRUD: Delete a record
  delete: async (id) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  },

// 6. ANALYTICS: Fetch the World Bank Gini Index comparison
getInequalityIndex: async () => {
  const response = await api.get(`${API_URL}/inequality-index`); 
  return response.data;
},

// 7. ANALYTICS: Fetch the specific SDG 10 metrics for a region
  getSDGMetrics: async (id) => {
   
    const response = await api.get(`/v1/regional-development/sdg-metrics/${id}`);
    return response.data;
  }
};

export default regionalDevelopmentService;