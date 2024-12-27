import { defineStore } from 'pinia'
import { salesService } from '@/services/sales.service'
import type { SalesOverviewRequest, SalesApiResponse, SalesState, ChartDataPoint } from '@/types/sales.types'

export const useSalesStore = defineStore('sales', {
 state: (): SalesState => ({
   dailySalesOverview: null,
   isLoading: false,
   error: null
 }),

 getters: {
   hasSalesData: state => Boolean(state.dailySalesOverview),
   
   chartData: (state): ChartDataPoint[] => {
     if (!state.dailySalesOverview?.item) return []

     return state.dailySalesOverview.item.map(({ 
       date, fbaAmount, fbmAmount, fbaShippingAmount, profit 
     }) => ({
       date,
       totalSales: fbaAmount + fbmAmount,
       shipping: fbaShippingAmount,
       profit,
       fbaSales: fbaAmount,
       fbmSales: fbmAmount
     }))
   }
 },

 actions: {
   async fetchDailySalesOverview(params: SalesOverviewRequest) {
     this.isLoading = true
     this.error = null
     
     try {
       const response = await salesService.getDailySalesOverview(params)
       
       if (!response.ApiStatus) {
         throw new Error(response.ApiStatusMessage || 'Failed to fetch sales data')
       }

       this.dailySalesOverview = response.Data
     } catch (error) {
       this.error = error instanceof Error ? error.message : 'An error occurred'
       throw error
     } finally {
       this.isLoading = false
     }
   },

   resetSalesData() {
     this.$reset()
   }
 }
})