<template>
  <div class="flex flex-col h-full">
    <div class="p-4 flex gap-3 flex-1 overflow-hidden h-full">
      <BusinessPanel
        :userPosition="userPosition"
        :visibilityPercent="visibilityPercent"
        :difficulty="difficulty"
        :keywordsCount="keywords.length"
        :competitors="competitors"
        :isLoading="isLoadingBusinessData"
        @open-in-google="openInGoogle"
      />

      <div class="bg-white rounded p-3 flex-1 border border-gray-200 relative">
        <GoogleMapView
          :gridConfig="gridConfig"
          :refreshKey="mapRefreshKey"
          @marker-selected="onMarkerSelected"
          @business-panel-open="onBusinessPanelOpen"
          @grid-size-change="onGridSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import BusinessPanel from '../components/gtrack/BusinessPanel.vue';
import GoogleMapView from '../components/gtrack/map/GoogleMapView.vue';
import { useLocationData } from '../composables/useLocationData';

// Use shared location data
const { location, keywords, gridConfig } = useLocationData();

const userPosition = ref(9);
const visibilityPercent = ref(60);
const difficulty = ref('ŚREDNIA');
const isLoadingBusinessData = ref(false);
const competitors = ref([]);
const mapRefreshKey = ref(0);
const selectedRanking = ref(null);

let businessLoadTimer = null;
let statsTimer = null;

// Mock Data & Methods from App.vue
const businessNames = [
  'Dublin House Painters', 'Pro Paint Solutions', 'Emerald Painting Services',
  'Premier Decorators Dublin', 'Colorful Homes Ireland', 'Expert Paint & Decor',
  'Dublin Interior Design', 'Quality Painters Ltd', 'Perfect Finish Painting',
  'Dublin Exterior Experts'
];

const descriptions = [
  'Profesjonalne malowanie mieszkań i biur z gwarancją jakości.',
  'Kompleksowe usługi malarskie i dekoratorskie w całym Dublinie.',
  'Specjaliści od metamorfoz wnętrz, szybkie terminy realizacji.',
  '15 lat doświadczenia w pracy dla firm i klientów indywidualnych.',
  'Kompleksowa obsługa projektów – od wyceny po sprzątanie.',
  'Dostępne ekipy weekendowe, darmowa wycena na miejscu.'
];

const streetNames = [
  'O\'Connell Street', 'Grafton Street', 'Dame Street', 'Parnell Street',
  'Abbey Street', 'Henry Street', 'Talbot Street', 'Capel Street'
];

const generateBusinessListings = (ranking) => {
  const listings = [];
  const count = 6 + Math.floor(Math.random() * 4);

  for (let i = 0; i < count; i++) {
    const name = businessNames[i % businessNames.length];
    const initials = name.split(' ').map(word => word[0]).slice(0, 2).join('');
    const rating = +(4 + Math.random()).toFixed(1);
    const reviewCount = 80 + Math.floor(Math.random() * 400);
    const streetNum = Math.floor(1 + Math.random() * 200);
    const street = streetNames[Math.floor(Math.random() * streetNames.length)];

    listings.push({
      name,
      initials,
      position: i + 1,
      rating,
      reviewCount,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      address: `${streetNum} ${street}, Dublin`,
      phone: Math.random() > 0.4 ? `+353 ${Math.floor(1 + Math.random() * 9)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}` : null,
      photoUrl: null
    });
  }
  return listings;
};

const updateVisibilityMetrics = (ranking) => {
  selectedRanking.value = ranking;
  userPosition.value = ranking > 20 ? 20 : ranking;

  const normalized = Math.min(Math.max(ranking, 1), 20);
  visibilityPercent.value = Math.max(10, Math.min(100, Math.round((21 - normalized) * 5)));

  if (normalized <= 5) {
    difficulty.value = 'NISKA';
  } else if (normalized <= 10) {
    difficulty.value = 'ŚREDNIA';
  } else if (normalized <= 15) {
    difficulty.value = 'WYSOKA';
  } else {
    difficulty.value = 'BARDZO WYSOKA';
  }
};

const triggerStatisticsRefresh = () => {
  // Just a placeholder for map logic that might need this
};

const loadBusinessListings = (ranking, delay = 900) => {
  updateVisibilityMetrics(ranking);
  isLoadingBusinessData.value = true;
  competitors.value = [];
  triggerStatisticsRefresh();

  if (businessLoadTimer) {
    clearTimeout(businessLoadTimer);
  }

  businessLoadTimer = setTimeout(() => {
    competitors.value = generateBusinessListings(ranking);
    isLoadingBusinessData.value = false;
  }, delay);
};

const onMarkerSelected = (ranking) => {
  loadBusinessListings(ranking);
};

const onBusinessPanelOpen = (ranking) => {
  selectedRanking.value = ranking;
};

const openInGoogle = () => {
  window.open('https://www.google.com/maps', '_blank');
};

const onGridSizeChange = (newSize) => {
  if (gridConfig.value.currentSize !== newSize) {
    gridConfig.value.currentSize = newSize;
  }
};

onMounted(() => {
  triggerStatisticsRefresh();
});

onBeforeUnmount(() => {
  if (businessLoadTimer) clearTimeout(businessLoadTimer);
  if (statsTimer) clearTimeout(statsTimer);
});

watch(
  () => [gridConfig.value.currentSize, gridConfig.value.stepKm],
  triggerStatisticsRefresh
);
</script>

