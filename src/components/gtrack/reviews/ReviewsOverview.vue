<template>
  <div class="flex flex-col gap-0">
    <ReviewsStats v-if="localStats" :stats="localStats" :scenario="currentScenario" />
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Skeleton height="150px" class="rounded-lg"></Skeleton>
        <Skeleton height="150px" class="rounded-lg"></Skeleton>
        <Skeleton height="150px" class="rounded-lg"></Skeleton>
    </div>

    <AIAnalysis :scenario="currentScenario" />
    
    <DeveloperMenu @scenario-changed="handleScenarioChange" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Skeleton from 'primevue/skeleton';
import ReviewsStats from './ReviewsStats.vue';
import AIAnalysis from './AIAnalysis.vue';
import DeveloperMenu from './DeveloperMenu.vue';
import { ReviewsService } from '../../../services/ReviewsService';

const props = defineProps({
  stats: {
    type: Object,
    default: null
  }
});

const router = useRouter();
const currentScenario = ref(null);
const localStats = ref(props.stats);

const handleScenarioChange = async (scenario) => {
  currentScenario.value = scenario;
  // Reload stats with new scenario
  try {
    const newStats = await ReviewsService.getStatsForScenario(scenario);
    localStats.value = newStats;
  } catch (e) {
    console.error('Failed to load scenario stats', e);
  }
};

watch(() => props.stats, (newStats) => {
  localStats.value = newStats;
}, { immediate: true });
</script>

