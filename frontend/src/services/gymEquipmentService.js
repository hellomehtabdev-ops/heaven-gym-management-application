import api from './apiClient';

function toFormData(data) {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === 'images') {
      value.forEach((file) => form.append('images', file));
    } else form.append(key, String(value));
  });
  return form;
}

export const gymEquipmentService = {
  getPublic: (params = {}) => api.get('/gym-equipment/public', { params }).then((r) => r.data),
  getPublicBySlug: (slug) => api.get(`/gym-equipment/public/${slug}`).then((r) => r.data),
  getAdmin: (params = {}) => api.get('/gym-equipment', { params }).then((r) => r.data),
  create: (data) => api.post('/gym-equipment', toFormData(data)).then((r) => r.data),
  update: (id, data) => api.put(`/gym-equipment/${id}`, toFormData(data)).then((r) => r.data),
  delete: (id) => api.delete(`/gym-equipment/${id}`).then((r) => r.data),
};
