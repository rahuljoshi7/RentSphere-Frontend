import api from './axios'

export const propertyService = {
  search:       (params)          => api.get('/properties/search', { params }),
  getCities:    ()                => api.get('/properties/cities'),
  getAll:       (params)          => api.get('/properties', { params }),
  getMine:      (params)          => api.get('/properties/my', { params }),
  getById:      (id)              => api.get(`/properties/${id}`),
  create:       (data)            => api.post('/properties', data),
  update:       (id, data)        => api.put(`/properties/${id}`, data),
  delete:       (id)              => api.delete(`/properties/${id}`),
  updateStatus: (id, status)      => api.patch(`/properties/${id}/status`, null, { params: { status } }),
  uploadImages: (id, formData)    => api.post(`/properties/${id}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteImage:  (id, imageId)     => api.delete(`/properties/${id}/images/${imageId}`)
}
