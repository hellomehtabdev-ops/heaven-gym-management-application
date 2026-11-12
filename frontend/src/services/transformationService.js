import api from './apiClient';

export const transformationService = {
  getPublicTransformations(params = {}) {
    return api.get('/transformations/public', { params }).then((res) => res.data);
  },

  getPublicTransformation(id) {
    return api.get(`/transformations/public/${id}`).then((res) => res.data);
  },

  getAdminTransformations() {
    return api.get('/transformations/admin').then((res) => res.data);
  },

  getAdminTransformation(id) {
    return api.get(`/transformations/admin/${id}`).then((res) => res.data);
  },

  createTransformation(formData) {
    return api
      .post('/transformations/admin', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data);
  },

  updateTransformation(id, formData) {
    return api
      .put(`/transformations/admin/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data);
  },

  togglePublish(id, is_published, member_consent_obtained) {
    return api
      .patch(`/transformations/admin/${id}/publish`, {
        is_published,
        member_consent_obtained,
      })
      .then((res) => res.data);
  },

  deleteTransformation(id) {
    return api.delete(`/transformations/admin/${id}`).then((res) => res.data);
  },
};
