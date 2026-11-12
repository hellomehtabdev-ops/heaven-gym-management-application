import api from './apiClient';

export const gymEquipmentService = {
  getPublic: (params = {}) => api.get('/gym-equipment/public', { params }).then((r) => r.data),
  getPublicBySlug: (slug) => api.get(`/gym-equipment/public/${slug}`).then((r) => r.data),
};
