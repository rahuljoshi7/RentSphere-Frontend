import api from './axios'

export const facilityService = {
  add:              (propId, data) => api.post(`/facilities/property/${propId}`, data),
  update:           (id, data)     => api.put(`/facilities/${id}`, data),
  getByProperty:    (propId)       => api.get(`/facilities/property/${propId}`),
  raiseComplaint:   (data)         => api.post('/facilities/complaints', data),
  resolveComplaint: (id)           => api.patch(`/facilities/complaints/${id}/resolve`),
  getComplaintsByProperty: (propId, status, params) => api.get(`/facilities/complaints/property/${propId}`, { params: { status, ...params } }),
  getMyComplaints:  (params)       => api.get('/facilities/complaints/my', { params })
}
