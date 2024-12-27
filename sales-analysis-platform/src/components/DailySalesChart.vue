<script setup lang="ts">
import { defineProps, type PropType, ref, computed, watch } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartOptions,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import type { ChartDataPoint } from "../types/sales.types";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels
);

// Types & Enums
enum DateRange {
  DAYS_60 = 60,
  DAYS_30 = 30,
  DAYS_14 = 14,
  DAYS_7 = 7,
}

type SeriesName = "Total Sales" | "FBA Sales" | "FBM Sales" | "Profit";
interface LegendItem {
  label: SeriesName;
  color: string;
}

// Props & Emits
const props = defineProps({
  data: {
    type: Array as PropType<ChartDataPoint[]>,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits<{
  (e: "update:dateRange", value: DateRange): void;
  (e: "barClick", dates: string[]): void;
}>();

// State
const selectedDates = ref<string[]>([]);
const selectedRange = ref<DateRange>(DateRange.DAYS_60);
const seriesVisibility = ref({
  "Total Sales": true,
  "FBA Sales": false,
  "FBM Sales": false,
  Profit: true,
});

// Constants
const dateRangeOptions = [
  { label: "Last 60 Days", value: DateRange.DAYS_60 },
  { label: "Last 30 Days", value: DateRange.DAYS_30 },
  { label: "Last 14 Days", value: DateRange.DAYS_14 },
  { label: "Last 7 Days", value: DateRange.DAYS_7 },
];

const legendItems: LegendItem[] = [
  { label: "Total Sales", color: "#8884d8" },
  { label: "FBA Sales", color: "#4A90E2" },
  { label: "FBM Sales", color: "#FF7F00" },
  { label: "Profit", color: "#00C49F" },
];

// Computed
const filteredData = computed(() => props.data.slice(-selectedRange.value));

const chartData = computed(() => ({
  labels: filteredData.value.map((item) => formatDate(item.date)),
  datasets: generateDatasets(),
}));

const chartOptions = computed<ChartOptions<"bar">>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  onClick: (_, elements) => {
    if (elements.length > 0) handleBarClick(elements[0].index);
  },
  plugins: {
    title: {
      display: true,
      text: "Daily Sales",
      align: "start",
      position: "top",
      padding: 20,
      font: { size: 18, weight: "bold" as const },
    },
    datalabels: generateDataLabelsConfig(),
    tooltip: { callbacks: { label: generateTooltipLabel } },
    legend: { display: false },
  },
  scales: generateScalesConfig(),
}));

// Methods
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.toLocaleDateString("en-US", {
    weekday: "short",
  })}. ${date.toLocaleDateString("en-US", {
    month: "2-digit",
    year: "2-digit",
  })}`;
}

function generateDatasets() {
  const getBackgroundColor = (
    date: string,
    baseColor: string,
    activeColor: string
  ) =>
    date === selectedDates.value[0] || date === selectedDates.value[1]
      ? activeColor
      : baseColor;

  return [
    {
      label: "Total Sales",
      backgroundColor: filteredData.value.map((item) =>
        getBackgroundColor(item.date, "#8884d8", "#4F46E5")
      ),
      data: filteredData.value.map((item) => item.totalSales),
      hidden: !seriesVisibility.value["Total Sales"],
    },
    {
      label: "FBA Sales",
      backgroundColor: filteredData.value.map((item) =>
        getBackgroundColor(item.date, "#FCD5A2", "#2563EB")
      ),
      data: filteredData.value.map((item) => item.fbaSales),
      hidden: !seriesVisibility.value["FBA Sales"],
    },
    {
      label: "FBM Sales",
      backgroundColor: filteredData.value.map((item) =>
        getBackgroundColor(item.date, "#FFB380", "#FF5722")
      ),
      data: filteredData.value.map((item) => item.fbmSales),
      hidden: !seriesVisibility.value["FBM Sales"],
    },
    {
      label: "Profit",
      backgroundColor: filteredData.value.map((item) =>
        getBackgroundColor(item.date, "#66DBC4", "#00A67C")
      ),
      data: filteredData.value.map((item) => item.profit),
      hidden: !seriesVisibility.value["Profit"],
    },
  ];
}

function generateDataLabelsConfig() {
  return {
    color: "#ffffff",
    rotation: -90,
    align: "center" as const,
    anchor: "center" as const,
    formatter: (value: number, context: any) => {
      if (context.dataset.label === "Total Sales" && !context.dataset.hidden) {
        return `$${value.toFixed(2)}`;
      }
      return null;
    },
    font: { weight: "bold" as const, size: 11 },
    padding: 0,
  };
}

function generateTooltipLabel(context: any) {
  const dataIndex = context.dataIndex;
  const label = context.dataset.label || "";
  const value = context.parsed.y;

  if (value !== null) {
    if (label === "Total Sales") {
      const currentData = filteredData.value[dataIndex];
      return [
        `${label}: $${value.toFixed(2)}`,
        `├─ FBA Sales: $${currentData.fbaSales.toFixed(2)}`,
        `└─ FBM Sales: $${currentData.fbmSales.toFixed(2)}`,
        `Shipping: $${currentData.shipping.toFixed(2)}`,
      ];
    }
    return `${label}: $${value.toFixed(2)}`;
  }
  return label;
}

function generateScalesConfig() {
  return {
    x: {
      stacked: true,
      grid: { offset: true },
      ticks: {
        autoSkip: false,
        font: {
          size:
            selectedRange.value === DateRange.DAYS_60
              ? 10
              : selectedRange.value === DateRange.DAYS_30
              ? 12
              : selectedRange.value === DateRange.DAYS_14
              ? 14
              : 16,
        },
      },
    },
    y: {
      title: {
        display: true,
        text: "Amount",
        position: "left",
      },
      stacked: true,
      type: "linear" as const,
      beginAtZero: true,
      ticks: {
        callback: (value: number | string) =>
          typeof value === "number" ? `$${value.toFixed(2)}` : value,
      },
    },
  };
}

function handleBarClick(dataIndex: number) {
  const date = filteredData.value[dataIndex].date;

  if (selectedDates.value.includes(date)) {
    selectedDates.value = selectedDates.value.filter((d) => d !== date);
  } else if (selectedDates.value.length < 2) {
    selectedDates.value.push(date);
  } else {
    selectedDates.value = [date];
  }

  emit("barClick", selectedDates.value);
}

function toggleSeries(seriesName: SeriesName) {
  seriesVisibility.value[seriesName] = !seriesVisibility.value[seriesName];
}

// Watchers
watch(selectedRange, (newValue) => {
  emit("update:dateRange", newValue);
});
</script>

<template>
  <div class="w-full bg-white rounded-lg shadow-lg p-4">
    <div class="flex justify-end mb-4">
      <select
        v-model="selectedRange"
        class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500"
      >
        <option
          v-for="option in dateRangeOptions"
          :key="option.value"
          :value="option.value"
          class="hover:bg-gray-100"
        >
          {{ option.label }}
        </option>
      </select>
    </div>

    <div class="h-[600px]">
      <Bar :data="chartData" :options="chartOptions" class="w-full h-full" />
    </div>

    <div class="flex flex-wrap gap-6 mb-4 justify-center">
      <div
        v-for="item in legendItems"
        :key="item.label"
        class="flex flex-col items-center"
      >
        <div class="flex items-center gap-2 mb-1">
          <div
            class="w-3 h-3 rounded-sm"
            :style="{ backgroundColor: item.color }"
          />
          <span class="text-sm font-medium text-black">{{ item.label }}</span>
        </div>
        <button
          @click="toggleSeries(item.label)"
          :class="[
            seriesVisibility[item.label]
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
            'px-3 py-1 text-xs font-medium rounded-full transition-colors',
          ]"
        >
          {{ seriesVisibility[item.label] ? "ON" : "OFF" }}
        </button>
      </div>
    </div>
  </div>
</template>
