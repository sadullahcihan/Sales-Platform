import { defineStore } from 'pinia'
import { authService } from '@/services/auth.service'
import type { LoginCredentials, UserData, TokenResponse } from '@/types/auth.types'

interface AuthState {  
 token: string
 refreshToken: string
 expiresAt: string
 userData: UserData | null
}

export const useAuthStore = defineStore('auth', {
 state: (): AuthState => ({
   token: localStorage.getItem('token') || '',
   refreshToken: localStorage.getItem('refreshToken') || '',
   expiresAt: localStorage.getItem('expiresAt') || '',
   userData: null
 }),

 getters: {
   isAuthenticated: state => Boolean(state.token),
   isTokenExpired: state => !state.expiresAt || new Date(state.expiresAt) <= new Date(),
   sellerId: state => state.userData?.user?.store?.[0]?.storeId ?? null,
   marketplace: state => state.userData?.user?.store?.[0]?.marketplaceName ?? null
 },

 actions: {
   async login(credentials: LoginCredentials) {
     const tokens = await authService.login(credentials)
     this.setTokens(tokens)
   },

   setTokens({ AccessToken, RefreshToken, ExpiresAt }: TokenResponse) {
     this.token = AccessToken
     this.refreshToken = RefreshToken
     this.expiresAt = ExpiresAt
     
     localStorage.setItem('token', AccessToken)
     localStorage.setItem('refreshToken', RefreshToken)
     localStorage.setItem('expiresAt', ExpiresAt)
   },

   async refreshAccessToken() {
     if (!this.refreshToken) throw new Error('No refresh token available')
     const tokens = await authService.refreshToken(this.refreshToken)
     this.setTokens(tokens)
     return tokens.AccessToken
   },

   async getUserInfo() {
     this.userData = await authService.getUserInfo()
   },

   logout() {
     const keys = ['token', 'refreshToken', 'expiresAt'] as const
     keys.forEach(key => {
       this[key] = ''
       localStorage.removeItem(key)
     })
     this.userData = null
   }
 }
})