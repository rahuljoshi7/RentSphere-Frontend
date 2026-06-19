import api from './axios'

export const tenantService = {
  getAll:        (params) => api.get('/tenants', { params }),
  getById:       (id)     => api.get(`/tenants/${id}`),
  getMe:         ()       => api.get('/tenants/me'),
  search:        (q, p)   => api.get('/tenants/search', { params: { q, ...p } }),
  getForOwner:   (params) => api.get('/tenants/my-owner', { params }),
  updateProfile: (id, d)  => api.put(`/tenants/${id}`, d),
  deactivate:    (id)     => api.delete(`/tenants/${id}`)
}
