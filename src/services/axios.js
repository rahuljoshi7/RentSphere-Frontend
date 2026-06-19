import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

// ── Request interceptor — attach JWT ───────────────────────────────────────
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  error => Promise.reject(error)
)

// ── Response interceptor — normalise errors ────────────────────────────────
api.interceptors.response.use(
  response => response,
  error => {
    const status  = error.response?.status
    const message = error.response?.data?.message || 'Something went wrong'

    if (status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
      return Promise.reject(error)
    }

    if (status === 403) {
      toast.error('You do not have permission to perform this action.')
      return Promise.reject(error)
    }

    if (status >= 500) {
      toast.error('Server error. Please try again later.')
      return Promise.reject(error)
    }

    return Promise.reject({ ...error, userMessage: message })
  }
)

export default api
