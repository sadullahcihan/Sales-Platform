<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useSkuListStore } from "@/stores/skuList";
import { useAuthStore } from "@/stores/auth";
import type { SkuListRequest } from "@/types/sales.types";

// Props
const props = defineProps<{
  selectedDates: string[];
  isVisible: boolean;
}>();

// Store Setup
const skuListStore = useSkuListStore();
const authStore = useAuthStore();
const { skuList, isLoading, totalItems } = storeToRefs(skuListStore);

// Pagination State
const currentPage = ref(1);
const itemsPerPage = 10;
const totalPages = ref(1);

// Methods
const loadSkuData = async (page = 1) => {
  if (!props.selectedDates.length) return;

  const pageSize = 30;
  const apiPage = Math.ceil(page / 3);

  const params: SkuListRequest = {
    marketplace: authStore.marketplace ?? "",
    sellerId: authStore.sellerId ?? "",
    salesDate: props.selectedDates[0],
    salesDate2: props.selectedDates[1] || "",
    pageSize,
    pageNumber: apiPage,
    isDaysCompare: props.selectedDates.length === 2 ? 1 : 0,
  };

  await skuListStore.fetchSkuList(params);
  totalPages.value = Math.ceil(totalItems.value / itemsPerPage);
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

// Computed
const paginatedSkuList = computed(() => {
  const startIdx = ((currentPage.value - 1) % 3) * itemsPerPage;
  return skuList.value.slice(startIdx, startIdx + itemsPerPage);
});

// Watchers
watch(
  () => props.selectedDates,
  async (newDates) => {
    if (newDates.length) {
      currentPage.value = 1;
      await loadSkuData();
    }
  },
  { deep: true }
);

watch(currentPage, async (newPage) => {
  if ((newPage - 1) % 3 === 0) {
    await loadSkuData(newPage);
  }
});
</script>

<template>
  <div
    v-if="isVisible && selectedDates.length"
    class="mt-6 bg-white rounded-lg shadow-lg p-4"
  >
    <div v-if="isLoading" class="flex justify-center py-4" role="status">
      Loading...
    </div>

    <div v-else>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th
                v-for="header in [
                  'Image',
                  'ASIN/SKU',
                  'Product Name',
                  'Quantity',
                  'Amount',
                  'Shipping',
                  ...(selectedDates.length === 2
                    ? ['Quantity (2)', 'Amount (2)', 'Shipping (2)']
                    : []),
                  'Refund Rate',
                ]"
                :key="header"
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                :class="{
                  'text-right': ['Quantity', 'Amount', 'Shipping'].some((col) =>
                    header.includes(col)
                  ),
                }"
              >
                {{ header }}
              </th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in paginatedSkuList" :key="item.asin">
              <td class="px-4 py-4">
                <img
                  :src="item.imageUrl"
                  :alt="item.productName"
                  class="w-16 h-16 object-contain"
                />
              </td>

              <td class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ item.asin }}</div>
                <div class="text-sm text-gray-500">{{ item.sku }}</div>
              </td>

              <td class="px-4 py-4 max-w-md">
                <div
                  class="text-sm text-gray-900 truncate hover:whitespace-normal hover:text-clip cursor-pointer"
                >
                  {{ item.productName }}
                </div>
              </td>

              <td class="px-4 py-4 text-right text-sm text-gray-900">
                {{ item.qty }}
              </td>

              <td class="px-4 py-4 text-right text-sm text-gray-900">
                {{ formatCurrency(item.amount) }}
              </td>

              <td class="px-4 py-4 text-right text-sm text-gray-900">
                {{ formatCurrency(item.shippingAmount) }}
              </td>

              <template v-if="selectedDates.length === 2">
                <td class="px-4 py-4 text-right text-sm text-gray-900">
                  {{ item.qty2 }}
                </td>

                <td class="px-4 py-4 text-right text-sm text-gray-900">
                  {{ formatCurrency(item.amount2) }}
                </td>

                <td class="px-4 py-4 text-right text-sm text-gray-900">
                  {{ formatCurrency(item.shippingAmount2) }}
                </td>
              </template>

              <td class="px-4 py-4 text-right text-sm text-gray-900">
                {{
                  item.refundPercantage !== null
                    ? `${item.refundPercantage}%`
                    : "-"
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded border"
            :class="
              currentPage === 1
                ? 'bg-gray-100 text-gray-400'
                : 'bg-white hover:bg-gray-50 text-black'
            "
          >
            Previous
          </button>

          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded border"
            :class="
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400'
                : 'bg-white hover:bg-gray-50 text-black'
            "
          >
            Next
          </button>
        </div>

        <div class="text-sm text-gray-700">
          Page {{ currentPage }} of {{ totalPages }}
        </div>
      </div>
    </div>
  </div>
</template>
