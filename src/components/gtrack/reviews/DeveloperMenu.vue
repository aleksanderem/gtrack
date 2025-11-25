<template>
  <div v-if="shouldShow()" class="fixed bottom-4 right-4 z-50">
    <Button 
      icon="pi pi-code" 
      severity="secondary"
      rounded
      @click="toggleMenu"
      :pt="{ root: { class: 'shadow-lg' } }"
      aria-label="Developer Menu"
    />
    
    <div v-if="isOpen" class="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 min-w-[280px]">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm font-semibold text-gray-700">Developer Menu</span>
        <Button 
          icon="pi pi-times" 
          text 
          rounded 
          size="small"
          @click="isOpen = false"
          aria-label="Close"
        />
      </div>
      
      <div class="space-y-2">
        <div class="text-sm font-medium text-gray-500 uppercase mb-2">Scenariusz ocen</div>
        
        <div 
          v-for="scenario in scenarios" 
          :key="scenario.id"
          class="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors"
          :class="activeScenario === scenario.id ? 'bg-primary/10 border border-primary' : 'hover:bg-gray-50 border border-transparent'"
          @click="selectScenario(scenario.id)"
        >
          <div class="text-2xl">{{ scenario.emoji }}</div>
          <div class="flex-1">
            <div class="text-sm font-medium text-gray-700">{{ scenario.label }}</div>
            <div class="text-sm text-gray-500">{{ scenario.description }}</div>
          </div>
          <i v-if="activeScenario === scenario.id" class="pi pi-check text-primary"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Button from 'primevue/button';
import { useRoute } from 'vue-router';

const emit = defineEmits(['scenario-changed']);

const route = useRoute();
const isOpen = ref(false);
const activeScenario = ref('positive');

const scenarios = [
  {
    id: 'positive',
    label: 'Pozytywne (4-5⭐)',
    description: 'Wysokie oceny',
    emoji: '🎉',
    minRating: 4,
    maxRating: 5
  },
  {
    id: 'neutral',
    label: 'Neutralne (3-4⭐)',
    description: 'Ostrzeżenie',
    emoji: '⚠️',
    minRating: 3,
    maxRating: 4
  },
  {
    id: 'negative',
    label: 'Negatywne (<3⭐)',
    description: 'Krytyczne',
    emoji: '🚨',
    minRating: 1,
    maxRating: 3
  }
];

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const selectScenario = (scenarioId) => {
  activeScenario.value = scenarioId;
  const scenario = scenarios.find(s => s.id === scenarioId);
  emit('scenario-changed', scenario);
  isOpen.value = false;
};

// Only show on overview page
const shouldShow = () => {
  return route.name === 'reviews-overview';
};

onMounted(() => {
  // Set default scenario
  const defaultScenario = scenarios.find(s => s.id === activeScenario.value);
  emit('scenario-changed', defaultScenario);
});
</script>

<style scoped>
/* Click outside to close */
</style>

