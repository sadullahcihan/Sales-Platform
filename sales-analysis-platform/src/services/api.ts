import { useAuthStore } from '@/stores/auth'
import axios, { type AxiosInstance } from 'axios'

const api: AxiosInstance = axios.create({
 baseURL: 'https://iapitest.eva.guru',
 headers: {
   'Content-Type': 'application/json'
 }
})

api.interceptors.request.use(async (config) => {
 const authStore = useAuthStore()
 
 if (authStore.isTokenExpired && authStore.refreshToken) {
   const newToken = await authStore.refreshAccessToken()
   config.headers.Authorization = `Bearer ${newToken}`
 } else if (authStore.token) {
   config.headers.Authorization = `Bearer ${authStore.token}`
 }
 
 return config
}, error => Promise.reject(error))

api.interceptors.response.use(
 response => response,
 async error => {
   if (error.response?.status === 401) {
     localStorage.removeItem('token')
     window.location.href = '/login'
   }
   return Promise.reject(error)
 }
)

export default api