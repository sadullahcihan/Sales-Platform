import api from './api'
import type { LoginCredentials, TokenResponse, UserData } from '@/types/auth.types'

interface RefreshTokenRequest {
 RefreshToken: string
 GrantType: string
 Scope: string
 ClientId: string
 ClientSecret: string
 RedirectUri: string
}

interface UserInfoRequest {
 email: string 
}

const DEFAULT_CREDENTIALS = {
 Email: 'homework@eva.guru',
 Password: 'Homeworkeva1**', 
 GrantType: 'password',
 Scope: 'amazon_data',
 ClientId: 'C0001',
 ClientSecret: 'SECRET0001',
 RedirectUri: 'https://api.eva.guru'
} as const

export const authService = {
 async login(_credentials: LoginCredentials): Promise<TokenResponse> {
   const { data } = await api.post('/oauth/token', DEFAULT_CREDENTIALS)
   return data.Data
 },

 async refreshToken(refreshToken: string): Promise<TokenResponse> {
   const payload: RefreshTokenRequest = {
     RefreshToken: refreshToken,
     GrantType: 'refresh_token',
     Scope: DEFAULT_CREDENTIALS.Scope,
     ClientId: DEFAULT_CREDENTIALS.ClientId,  
     ClientSecret: DEFAULT_CREDENTIALS.ClientSecret,
     RedirectUri: DEFAULT_CREDENTIALS.RedirectUri
   }
   
   const { data } = await api.post('/oauth/token', payload)
   return data.Data
 },

 async getUserInfo(): Promise<UserData> {
   const token = localStorage.getItem('token')
   if (!token) throw new Error('No access token found')

   const payload: UserInfoRequest = { email: DEFAULT_CREDENTIALS.Email }
   const { data } = await api.post('/user/user-information', payload)
   return data.Data
 }
}