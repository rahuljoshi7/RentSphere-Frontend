import api from './axios'

export const maintenanceService = {
  create:        (data)          => api.post('/maintenance', data),
  getById:       (id)            => api.get(`/maintenance/${id}`),
  getMine:       (params)        => api.get('/maintenance/my', { params }),
  getByProperty: (id, params)    => api.get(`/maintenance/property/${id}`, { params }),
  getByStatus:   (status, params)=> api.get(`/maintenance/status/${status}`, { params }),
  getAssigned:   (params)        => api.get('/maintenance/assigned', { params }),
  getForOwner:   (params)        => api.get('/maintenance/owner', { params }),
  assign:        (id, staffId)   => api.post(`/maintenance/${id}/assign`, null, { params: { staffId } }),
  updateStatus:  (id, data)      => api.patch(`/maintenance/${id}/status`, data),
  close:         (id)            => api.patch(`/maintenance/${id}/close`),
  uploadImage:   (id, fd)        => api.post(`/maintenance/${id}/image`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
}
