import api from './axios'

export const dashboardService = {
  getAdmin:          () => api.get('/dashboard/admin'),
  getAdminAnalytics: () => api.get('/dashboard/admin/analytics'),
  getOwner:          () => api.get('/dashboard/owner'),
  getOwnerAnalytics: () => api.get('/dashboard/owner/analytics'),
  getManager:        () => api.get('/dashboard/manager'),
  getTenant:         () => api.get('/dashboard/tenant'),
  getStaff:          () => api.get('/dashboard/staff')
}
