<template>
  <div class="gtrack-app h-screen flex relative lg:static bg-gray-100 overflow-hidden">
    <FarLeftNavbar />

    <LeftSidebar
      :location="location"
      :keywords="keywords"
      :editMode="editMode"
      :sidebarView="sidebarView"
      :traffic-summary="trafficSummary"
      :traffic-sources="trafficSources"
      :traffic-loading="trafficLoading"
      @update:sidebarView="sidebarView = $event"
      @update:keywords="keywords = $event"
      @toggle-edit="editMode = !editMode"
    />

    <div class="flex-1 flex flex-col overflow-hidden">
      <TopBar
        :activeTab="activeTab"
        :reportOptions="reportOptions"
        :selectedReport="selectedReport"
        :isLoadingReport="isLoadingReport"
        @update:activeTab="handleTabChange"
        @update:selectedReport="handleReportChange"
        @generate-pdf="generatePDF"
        @generate-csv="generateCSV"
      />

      <HorizontalCalendar 
        v-if="showCalendar" 
        @date-selected="onDateSelected" 
      />

      <div class="flex-1 overflow-hidden h-full relative">
        <router-view v-slot="{ Component }">
            <component :is="Component" />
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FarLeftNavbar from '../components/gtrack/FarLeftNavbar.vue';
import LeftSidebar from '../components/gtrack/LeftSidebar.vue';
import TopBar from '../components/gtrack/TopBar.vue';
import HorizontalCalendar from '../components/gtrack/HorizontalCalendar.vue';
import { useLocationData } from '../composables/useLocationData';

const route = useRoute();
const router = useRouter();
const { location, keywords, trafficSummary, trafficSources, fetchLocationData } = useLocationData();

const editMode = ref(false);
const sidebarView = ref('stats');
const trafficLoading = ref(false);

// Report options (Mock)
const reportOptions = ref([
  { code: 'keyword1', name: 'restaurant dublin' },
  { code: 'keyword2', name: 'best food dublin' },
  { code: 'keyword3', name: 'italian restaurant' }
]);
const selectedReport = ref(reportOptions.value[0]);
const isLoadingReport = ref(false);

// Compute active tab based on current route
const activeTab = computed(() => {
  if (route.path.includes('/reviews')) return 'reviews';
  if (route.name === 'settings') return 'settings';
  if (route.name === 'posts') return 'posts';
  if (route.name === 'content') return 'content';
  if (route.name === 'keywords-report') return 'keywords';
  if (route.name === 'comparison') return 'comparison';
  return 'map'; // Default
});

const showCalendar = computed(() => {
    return activeTab.value !== 'settings' && activeTab.value !== 'reviews';
});

const handleTabChange = (tabId) => {
  // Map tab IDs to route names or paths
  const locationId = route.params.locationId || 'demo';
  
  switch (tabId) {
    case 'map':
      router.push({ name: 'map', params: { locationId } });
      break;
    case 'reviews':
      router.push({ name: 'reviews-overview', params: { locationId } });
      break;
    case 'settings':
      router.push({ name: 'settings', params: { locationId } });
      break;
    case 'posts':
      router.push({ name: 'posts', params: { locationId } });
      break;
    case 'content':
      router.push({ name: 'content', params: { locationId } });
      break;
    case 'keywords': // Report
        router.push({ name: 'keywords-report', params: { locationId } });
        break;
    case 'comparison': // Report
        router.push({ name: 'comparison', params: { locationId } });
        break;
    default:
      router.push({ name: 'map', params: { locationId } });
  }
};

const handleReportChange = (option) => {
    if (!option || option.code === selectedReport.value?.code) return;
    selectedReport.value = option;
    isLoadingReport.value = true;
    setTimeout(() => { isLoadingReport.value = false; }, 1000);
};

const onDateSelected = (date) => {
    console.log('Date selected:', date);
    // In a real app, we'd push this to a store or query param
};

const generatePDF = () => { console.log('Generate PDF'); };
const generateCSV = () => { console.log('Generate CSV'); };

// Fetch data when locationId changes
watch(() => route.params.locationId, (newId) => {
    if (newId) {
        fetchLocationData(newId);
    }
}, { immediate: true });

// Mock stats loading
onMounted(() => {
    trafficLoading.value = true;
    setTimeout(() => { trafficLoading.value = false; }, 900);
});

</script>


