import api from './axios'

export const agreementService = {
  create:         (data)       => api.post('/agreements', data),
  getById:        (id)         => api.get(`/agreements/${id}`),
  getMine:        (params)     => api.get('/agreements/my', { params }),
  getByProperty:  (id, params) => api.get(`/agreements/property/${id}`, { params }),
  getByTenant:    (id, params) => api.get(`/agreements/tenant/${id}`, { params }),
  uploadDocument: (id, fd)     => api.post(`/agreements/${id}/document`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  terminate:      (id)         => api.patch(`/agreements/${id}/terminate`),
  renew:          (id, data)   => api.post(`/agreements/${id}/renew`, data)
}
