<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSalesStore } from '../stores/sales'
import { useAuthStore } from '../stores/auth'
import type { SalesOverviewRequest } from '../types/sales.types'
import SalesChart from './DailySalesChart.vue'

const salesStore = useSalesStore()
const { sellerId, marketplace } = storeToRefs(useAuthStore())
const { chartData, isLoading, error } = storeToRefs(salesStore)

const hasAuthData = computed(() => sellerId.value && marketplace.value)

onMounted(async () => {
 if (!hasAuthData.value) return
 
 const params: SalesOverviewRequest = {
   marketplace: marketplace.value,
   sellerId: sellerId.value,
   requestStatus: 0,
   day: 60,
   excludeYoYData: true
 }

 await salesStore.fetchDailySalesOverview(params)
})
</script>

<template>
 <div class="p-4">
   <div 
     v-if="isLoading" 
     class="flex justify-center min-h-[200px]"
     role="status"
   >
     Loading...
   </div>
   
   <div v-else-if="error" class="text-red-500 text-center">
     {{ error }}
   </div>

   <SalesChart 
     v-else-if="chartData?.length"
     :data="chartData" 
   />
   
   <div v-else class="text-center text-gray-500">
     No data available
   </div>
 </div>
</template>