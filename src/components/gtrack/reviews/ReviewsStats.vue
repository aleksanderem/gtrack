<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <!-- Overall Rating -->
    <Card class="border border-gray-100 shadow-sm">
      <template #content>
        <div class="flex flex-col items-center justify-center h-full py-2">
          <div class="text-5xl font-bold text-gray-800 mb-2">{{ stats.average_rating }}</div>
          <Rating :modelValue="stats.average_rating" readonly :cancel="false" class="mb-2" />
          <div class="text-sm text-gray-500">Na podstawie {{ stats.total_reviews }} opinii</div>
        </div>
      </template>
    </Card>

    <!-- Breakdown -->
    <Card class="border border-gray-100 shadow-sm">
      <template #title>
        <div class="text-sm font-semibold text-gray-500 uppercase mb-2">Źródła Opinii</div>
      </template>
      <template #content>
        <div class="space-y-4">
          <div v-for="source in stats.sources_breakdown" :key="source.label" class="flex flex-col gap-1">
            <div class="flex justify-between text-xs text-gray-600">
              <span class="flex items-center gap-1">
                <i :class="source.icon" :style="{ color: source.color }"></i>
                {{ source.label }}
              </span>
              <span class="font-bold">{{ source.value }}</span>
            </div>
            <!-- Custom Progress Bar using Tailwind for easy color customization -->
            <div class="w-full bg-gray-100 rounded-full h-2">
              <div 
                class="h-2 rounded-full transition-all duration-500" 
                :style="{ width: (source.value / stats.total_reviews * 100) + '%', backgroundColor: source.color }"
              ></div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- KPIs -->
    <Card class="border border-gray-100 shadow-sm">
      <template #title>
        <div class="text-sm font-semibold text-gray-500 uppercase mb-2">Jakość Obsługi</div>
      </template>
      <template #content>
        <div class="grid grid-rows-2 gap-4">
          <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
            <div>
              <div class="text-xs text-gray-500">Wskaźnik Odpowiedzi</div>
              <div class="text-xl font-bold text-green-700">{{ stats.response_rate }}%</div>
            </div>
            <i class="pi pi-check-circle text-green-400 text-2xl"></i>
          </div>
          <div class="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
             <div>
              <div class="text-xs text-gray-500">Net Promoter Score</div>
              <div class="text-xl font-bold text-purple-700">{{ stats.nps_score }}</div>
            </div>
            <i class="pi pi-chart-line text-purple-400 text-2xl"></i>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from 'primevue/card';
import Rating from 'primevue/rating';

defineProps({
  stats: {
    type: Object,
    required: true,
    default: () => ({
      average_rating: 0,
      total_reviews: 0,
      nps_score: 0,
      sources_breakdown: [],
      response_rate: 0
    })
  }
});
</script>
