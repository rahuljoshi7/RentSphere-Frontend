import api from './axios'

const download = (endpoint, params) =>
  api.post(endpoint, null, { params, responseType: 'blob' })

export const reportService = {
  revenue:       (p) => download('/reports/revenue', p),
  occupancy:     (p) => download('/reports/occupancy', p),
  rentCollection:(p) => download('/reports/rent-collection', p),
  tenant:        (p) => download('/reports/tenant', p),
  maintenance:   (p) => download('/reports/maintenance', p),
  getHistory:    (p) => api.get('/reports/history', { params: p })
}
