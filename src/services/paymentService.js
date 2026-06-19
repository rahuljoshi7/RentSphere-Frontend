import api from './axios'

export const paymentService = {
  generate:      (agreementId, month, year) => api.post(`/payments/generate/${agreementId}`, null, { params: { month, year } }),
  generateBulk:  (month, year)              => api.post('/payments/generate-bulk', null, { params: { month, year } }),
  record:        (id, data)                 => api.patch(`/payments/${id}/record`, data),
  getById:       (id)                       => api.get(`/payments/${id}`),
  getMine:       (params)                   => api.get('/payments/my', { params }),
  getByTenant:   (tenantId, params)         => api.get(`/payments/tenant/${tenantId}`, { params }),
  getByAgreement:(agreementId, params)      => api.get(`/payments/agreement/${agreementId}`, { params }),
  getByStatus:   (status, params)           => api.get(`/payments/status/${status}`, { params })
}
