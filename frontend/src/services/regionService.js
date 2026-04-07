import api from './api';
export const getRegions = async () => {
  const response = await api.get('/v1/regions');
  return response.data.data; 
};