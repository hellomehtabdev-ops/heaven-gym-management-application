import api from './apiClient';

export const offlineSaleService = {
  list: (params = {}) => api.get('/offline-sales', { params }).then((response) => response.data),
  create: (data) => api.post('/offline-sales', data).then((response) => response.data),
  getById: (id) => api.get(`/offline-sales/${id}`).then((response) => response.data),
};
