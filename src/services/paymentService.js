import api from './axios'

export const paymentService = {
  // ============================
  // Payment Generation
  // ============================

  generate: (agreementId, month, year) =>
    api.post(
      `/payments/generate/${agreementId}`,
      null,
      { params: { month, year } }
    ),

  generateBulk: (month, year) =>
    api.post(
      '/payments/generate-bulk',
      null,
      { params: { month, year } }
    ),

  // ============================
  // Record Payment
  // ============================

  record: (id, data) =>
    api.patch(`/payments/${id}/record`, data),

  // ============================
  // Get Payment Details
  // ============================

  getById: (id) =>
    api.get(`/payments/${id}`),

  // ============================
  // Tenant Payments
  // ============================

  getMyPayments: (params) =>
    api.get('/payments/my', { params }),

  // ============================
  // Owner/Admin Payments
  // ============================

  getOwnerPayments: (params) =>
    api.get('/payments/owner/my', { params }),

  // ============================
  // Payment History
  // ============================

  getByTenant: (tenantId, params) =>
    api.get(`/payments/tenant/${tenantId}`, { params }),

  getByAgreement: (agreementId, params) =>
    api.get(`/payments/agreement/${agreementId}`, { params }),

  // ============================
  // Payment Status
  // ============================

  getByStatus: (status, params) =>
    api.get(`/payments/status/${status}`, { params })
}
