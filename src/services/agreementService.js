import api from './axios'

export const agreementService = {
  create: (data) =>
    api.post('/agreements', data),

  getById: (id) =>
    api.get(`/agreements/${id}`),

  // Tenant Agreements
  getMyAgreements: (params) =>
    api.get('/agreements/my', { params }),

  // Owner/Admin Agreements
  getOwnerAgreements: (params) =>
    api.get('/agreements/owner/my', { params }),

  getByProperty: (id, params) =>
    api.get(`/agreements/property/${id}`, { params }),

  getByTenant: (id, params) =>
    api.get(`/agreements/tenant/${id}`, { params }),

  uploadDocument: (id, formData) =>
    api.post(`/agreements/${id}/document`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),

  terminate: (id) =>
    api.patch(`/agreements/${id}/terminate`),

  renew: (id, data) =>
    api.post(`/agreements/${id}/renew`, data)
}
