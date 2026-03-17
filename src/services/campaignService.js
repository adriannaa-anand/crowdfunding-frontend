import api from './api';

export const campaignService = {
  getAll: (params) => api.get('/campaigns', { params }),
  getOne: (id) => api.get(`/campaigns/${id}`),
  getMy: () => api.get('/campaigns/my'),
  create: (data) => api.post('/campaigns', data),
  update: (id, data) => api.put(`/campaigns/${id}`, data),
  delete: (id) => api.delete(`/campaigns/${id}`),
  getUploadUrl: (filename, contentType) =>
    api.get('/campaigns/upload-url', { params: { filename, contentType } }),
  getProgress: (id) => api.get(`/analytics/progress/${id}`),
};
