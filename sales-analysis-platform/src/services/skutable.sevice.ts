import api from './api'
import type { SkuListRequest, SkuListResponse } from '@/types/sales.types'

export const skutableService = {
 async getDailySkuList(params: SkuListRequest): Promise<SkuListResponse> {
   const { data } = await api.post('/data/daily-sales-sku-list', params)
   return data
 }
}