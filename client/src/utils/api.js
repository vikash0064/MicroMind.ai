import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Auto-attach JWT token
api.interceptors.request.use((config) => {
  const state = JSON.parse(localStorage.getItem('macromind-auth') || '{}')
  const token = state?.state?.token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('macromind-auth')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
}

// Meals / Food Scanning
export const mealAPI = {
  scan: (formData) => api.post('/meals/scan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  saveMeal: (data) => api.post('/meals', data),
  getMeals: (params) => api.get('/meals', { params }),
  getMeal: (id) => api.get(`/meals/${id}`),
  deleteMeal: (id) => api.delete(`/meals/${id}`),
  getDailyStats: () => api.get('/meals/stats/daily'),
  getWeeklyStats: () => api.get('/meals/stats/weekly'),
}

export default api
