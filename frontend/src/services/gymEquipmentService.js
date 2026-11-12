import api from './apiClient';

function toFormData(data) {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'images') {
      (value || []).forEach((file) => form.append('images', file));
    } else if (value !== undefined && value !== null) {
      form.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
    }
  });
  return form;
}

export const gymEquipmentService = {
  getPublic: (params = {}) => api.get('/gym-equipment/public', { params }).then((r) => r.data),
  getPublicBySlug: (slug) => api.get(`/gym-equipment/public/${slug}`).then((r) => r.data),
  getAdmin: () => api.get('/gym-equipment/admin').then((r) => r.data),
  create: (data) => api.post('/gym-equipment/admin', toFormData(data)).then((r) => r.data),
  update: (id, data) => api.put(`/gym-equipment/admin/${id}`, toFormData(data)).then((r) => r.data),
  delete: (id) => api.delete(`/gym-equipment/admin/${id}`).then((r) => r.data),
};
