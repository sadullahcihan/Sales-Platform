import { defineStore } from 'pinia'
import type { SkuListRequest, SkuItem } from '@/types/sales.types'
import { skutableService } from '@/services/skutable.sevice'
import { refundService } from '@/services/refund.service'

interface SkuListState {
 skuList: SkuItem[]
 selectedDates: string[]
 totalSale: number 
 totalShippingAmount: number
 isLoading: boolean
 error: string | null
 totalItems: number
}

export const useSkuListStore = defineStore('skuList', {
 state: (): SkuListState => ({
   skuList: [],
   selectedDates: [],
   totalSale: 0,
   totalShippingAmount: 0,
   isLoading: false,
   error: null,
   totalItems: 0
 }),

 actions: {
   async fetchSkuList(params: SkuListRequest) {
     this.isLoading = true
     this.error = null

     try {
       const response = await skutableService.getDailySkuList(params)
       
       if (!response.ApiStatus) {
         throw new Error(response.ApiStatusMessage || 'Failed to fetch SKU list')
       }

       const skuParams = {
         marketplace: params.marketplace,
         sellerId: params.sellerId,
         skuList: response.Data.item.skuList.map(sku => sku.sku),
         requestedDay: 1
       }

       const refundResponse = await refundService.getSkuRefundRate(skuParams)
       
       if (refundResponse.ApiStatus) {
         response.Data.item.skuList.forEach(skuItem => {
           const refundRate = refundResponse.Data.find(
             refund => refund.sku === skuItem.sku
           )?.refundRate
           skuItem.refundPercantage = refundRate ?? 0
         })
       }

       const { item } = response.Data
       this.skuList = item.skuList
       this.totalSale = item.totalSale
       this.totalShippingAmount = item.totalShippingAmount
       this.totalItems = item.skuList.length

       this.updateSelectedDates(params.salesDate, params.salesDate2)
     } catch (error) {
       this.error = error instanceof Error ? error.message : 'An error occurred'
       throw error
     } finally {
       this.isLoading = false
     }
   },

   updateSelectedDates(date1: string, date2?: string) {
     if (!this.selectedDates.includes(date1)) {
       this.selectedDates.push(date1)
     }
     if (date2 && !this.selectedDates.includes(date2)) {
       this.selectedDates.push(date2)
     }
   },

   resetSelectedDates() {
     this.selectedDates = []
     this.skuList = []
   }
 }
})