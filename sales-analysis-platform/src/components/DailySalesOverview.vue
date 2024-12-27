<script setup lang="ts">
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { type SalesOverviewRequest } from "../types/sales.types";
import DailySalesChart from "./DailySalesChart.vue";
import SkuListTable from "./SkuListTable.vue";
import { useSalesStore } from "@/stores/sales";
import { useSkuListStore } from "@/stores/skuList";
import { useAuthStore } from "@/stores/auth";

// Store setup
const salesStore = useSalesStore();
const skuListStore = useSkuListStore();
const { sellerId, marketplace } = storeToRefs(useAuthStore());
const { chartData, isLoading } = storeToRefs(salesStore);

// State
const selectedDates = ref<string[]>([]);
const isTableVisible = ref(false);

// Methods
const handleBarClick = (dates: string[]) => {
  selectedDates.value = dates;
  isTableVisible.value = dates.length > 0;
};

const fetchSalesData = async () => {
  if (!sellerId.value || !marketplace.value) return;

  const params: SalesOverviewRequest = {
    marketplace: marketplace.value,
    sellerId: sellerId.value,
    requestStatus: 0,
    day: 60,
    excludeYoYData: true,
  };

  await salesStore.fetchDailySalesOverview(params);
};

// Lifecycle
onMounted(fetchSalesData);
</script>

<template>
  <div class="p-4">
    <div
      v-if="isLoading"
      class="flex items-center justify-center min-h-[200px]"
    >
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
      />
    </div>

    <template v-else-if="chartData.length">
      <DailySalesChart :data="chartData" @bar-click="handleBarClick" />
      <SkuListTable
        :selected-dates="selectedDates"
        :is-visible="isTableVisible"
      />
    </template>

    <div v-else class="text-center py-4 text-gray-600">
      No data available for the selected period
    </div>
  </div>
</template>
