<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    <!-- Overall Rating -->
    <Card 
      class="border-0 shadow-lg overflow-hidden relative h-full rating-card" 
      :class="scenario?.id === 'negative' ? 'bg-gradient-to-br from-red-50 to-red-100' : scenario?.id === 'neutral' ? 'bg-gradient-to-br from-yellow-50 to-orange-50' : 'bg-gradient-to-br from-green-50 to-emerald-50'" 
      :pt="{
        body: {
          class: 'p-ripple relative',
          style: '--p-ripple-background: rgba(34, 197, 94, 0.3); cursor: pointer; position: relative;'
        }
      }"
    >
      <div class="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-20" :class="scenario?.id === 'negative' ? 'bg-red-200' : scenario?.id === 'neutral' ? 'bg-yellow-200' : 'bg-green-200'"></div>
      <div class="absolute bottom-0 left-0 w-24 h-24 rounded-full -ml-12 -mb-12 opacity-20" :class="scenario?.id === 'negative' ? 'bg-red-300' : scenario?.id === 'neutral' ? 'bg-orange-200' : 'bg-emerald-200'"></div>
      <template #content>
        <div class="absolute inset-0 p-ripple" v-ripple style="--p-ripple-background: rgba(34, 197, 94, 0.3);"></div>
        <div class="flex flex-col items-center justify-center min-h-full py-6 relative z-10">
          <div class="text-5xl mb-3">{{ scenario?.emoji || '🎉' }}</div>
          <div class="flex items-baseline gap-2 mb-3">
            <div class="text-6xl font-bold bg-gradient-to-r bg-clip-text text-transparent" :class="ratingColorClass">{{ stats.average_rating }}</div>
            <div class="text-2xl font-semibold text-gray-400">/5</div>
          </div>
          <Rating 
            :modelValue="stats.average_rating" 
            readonly 
            :cancel="false" 
            class="mb-3" 
            :pt="{ 
              onIcon: scenario?.id === 'negative' ? 'text-red-500 text-xl' : scenario?.id === 'neutral' ? 'text-yellow-500 text-xl' : 'text-green-500 text-xl', 
              offIcon: 'text-gray-300 text-xl' 
            }" 
          />
          <div class="text-sm font-medium text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
            Na podstawie <span class="font-bold text-gray-800">{{ stats.total_reviews }}</span> opinii
          </div>
        </div>
      </template>
    </Card>

    <!-- Breakdown -->
    <Card class="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden relative">
      <div class="absolute top-0 right-0 w-28 h-28 bg-purple-200 rounded-full -mr-14 -mt-14 opacity-20"></div>
      <div class="absolute bottom-0 left-0 w-20 h-20 bg-pink-200 rounded-full -ml-10 -mb-10 opacity-20"></div>
      <template #title>
        <div class="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4 relative z-10">Źródła Opinii</div>
      </template>
      <template #content>
        <div class="space-y-5 relative z-10">
          <div v-for="source in stats.sources_breakdown" :key="source.label" class="flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <span class="flex items-center gap-2 text-sm font-medium text-gray-700">
                <i :class="source.icon" :style="{ color: source.color }" class="text-lg"></i>
                {{ source.label }}
              </span>
              <span class="font-bold text-gray-800 text-sm">{{ source.value }}</span>
            </div>
            <!-- Modern Progress Bar -->
            <div class="w-full bg-white/60 backdrop-blur-sm rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                class="h-full rounded-full transition-all duration-700 ease-out shadow-sm" 
                :style="{ 
                  width: (source.value / stats.total_reviews * 100) + '%', 
                  background: `linear-gradient(90deg, ${source.color}, ${source.color}dd)`
                }"
              ></div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- KPIs -->
    <Card class="border-0 shadow-lg overflow-hidden relative" :class="scenario?.id === 'negative' ? 'bg-gradient-to-br from-red-50 to-pink-50' : scenario?.id === 'neutral' ? 'bg-gradient-to-br from-yellow-50 to-amber-50' : 'bg-gradient-to-br from-green-50 to-emerald-50'">
      <div class="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-20" :class="scenario?.id === 'negative' ? 'bg-red-200' : scenario?.id === 'neutral' ? 'bg-yellow-200' : 'bg-green-200'"></div>
      <div class="absolute bottom-0 left-0 w-24 h-24 rounded-full -ml-12 -mb-12 opacity-20" :class="scenario?.id === 'negative' ? 'bg-pink-200' : scenario?.id === 'neutral' ? 'bg-amber-200' : 'bg-emerald-200'"></div>
      <template #title>
        <div class="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4 relative z-10">Jakość Obsługi</div>
      </template>
      <template #content>
        <div class="grid grid-rows-2 gap-4 relative z-10">
          <div class="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Wskaźnik Odpowiedzi</div>
              <div class="text-3xl font-bold text-gray-800">{{ stats.response_rate }}%</div>
            </div>
            <Knob 
              :modelValue="stats.response_rate" 
              :min="0" 
              :max="100" 
              :size="60"
              :strokeWidth="8"
              :valueColor="scenario?.knobColor || '#6366f1'"
              :rangeColor="'#e5e7eb'"
              :textColor="'#6b7280'"
              readonly
              :pt="{ value: 'text-sm', label: 'hidden' }"
            />
          </div>
          <div class="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow">
             <div>
              <div class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Pozytywne Opinie</div>
              <div class="text-3xl font-bold text-gray-800">{{ stats.positive_reviews_percentage }}%</div>
            </div>
            <Knob 
              :modelValue="stats.positive_reviews_percentage" 
              :min="0" 
              :max="100" 
              :size="60"
              :strokeWidth="8"
              :valueColor="scenario?.knobColor || '#6366f1'"
              :rangeColor="'#e5e7eb'"
              :textColor="'#6b7280'"
              readonly
              :pt="{ value: 'text-sm', label: 'hidden' }"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { computed, onMounted, nextTick } from 'vue';
import Card from 'primevue/card';
import Rating from 'primevue/rating';
import Knob from 'primevue/knob';
import Ripple from 'primevue/ripple';

const props = defineProps({
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
  },
  scenario: {
    type: Object,
    default: null
  }
});

const ratingColorClass = computed(() => {
  if (props.scenario?.ratingColor) {
    return `${props.scenario.ratingColor.from} ${props.scenario.ratingColor.to}`;
  }
  return 'from-green-600 to-emerald-600';
});

onMounted(() => {
  nextTick(() => {
    const cardBody = document.querySelector('.rating-card .p-card-body');
    if (cardBody && Ripple && Ripple.mounted) {
      // Apply ripple directive to card body
      Ripple.mounted(cardBody, { value: true });
    }
  });
});
</script>

<style scoped>
/* Ensure card body is positioned relatively for absolute ripple overlay */
:deep(.rating-card .p-card-body) {
  position: relative !important;
  overflow: hidden;
}
</style>

