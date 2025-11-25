<template>
  <div class="flex-1 overflow-auto bg-surface-50 h-full">
    <div class="bg-white border-b border-gray-200">
      <div class="mx-auto flex items-center justify-between gap-4 px-6 py-5 lg:px-12" style="max-width: 1200px;">
        <h1 class="text-gray-900 font-semibold text-xl lg:text-2xl m-0">Ustawienia projektu</h1>
        <div class="flex items-center gap-2">
          <Button label="Anuluj" severity="secondary" outlined @click="cancelSettings" />
          <Button label="Zapisz ustawienia" icon="pi pi-check" @click="saveSettings" />
        </div>
      </div>
    </div>

    <div class="mx-auto w-full px-6 pt-6 pb-10 lg:px-12" style="max-width: 1200px;">
      <SettingsLayout
        v-model="settingsTab"
        :items="settingsNavItems"
        nav-title="Sekcje"
      >
        <BusinessSettings
          v-if="settingsTab === 'business'"
          v-model="businessConfig"
        />
        <GridConfiguration
          v-else-if="settingsTab === 'scanning'"
          v-model:gridSize="gridConfig.maxSize"
          v-model:stepKm="gridConfig.stepKm"
          v-model:centerName="gridConfig.centerName"
          @search-location="handleLocationSearch"
        />
        <KeywordsSettings 
          v-else-if="settingsTab === 'keywords'" 
          v-model:keywords="keywords"
        />
        <FrequencySettings v-else-if="settingsTab === 'frequency'" />
        <NotificationSettings v-else />
      </SettingsLayout>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Button from 'primevue/button';
import SettingsLayout from '../components/gtrack/settings/SettingsLayout.vue';
import BusinessSettings from '../components/gtrack/settings/BusinessSettings.vue';
import GridConfiguration from '../components/gtrack/sidebar/GridConfiguration.vue';
import KeywordsSettings from '../components/gtrack/settings/KeywordsSettings.vue';
import FrequencySettings from '../components/gtrack/settings/FrequencySettings.vue';
import NotificationSettings from '../components/gtrack/settings/NotificationSettings.vue';
import { useLocationData } from '../composables/useLocationData';
import { useFeatureSettings } from '../stores/featureSettings';

const router = useRouter();
const route = useRoute();
const { location, keywords, gridConfig } = useLocationData();
const { featureSettings } = useFeatureSettings();

const settingsTab = ref('business');

const businessConfig = ref({
  placeId: 'ChIJ...',
  cid: '',
  isConnected: false,
  website: 'https://dublinpainters.ie',
  // Feature settings will be synced from global store
  autoReply: false,
  photoMonitoring: true,
  postPublishing: false,
  dataProtection: true,
  qaMonitoring: false,
  hoursSync: false
});

// Sync businessConfig with global feature settings
watch(() => featureSettings.value, (newSettings) => {
  Object.keys(newSettings).forEach(key => {
    if (businessConfig.value.hasOwnProperty(key)) {
      businessConfig.value[key] = newSettings[key];
    }
  });
}, { immediate: true, deep: true });

const settingsNavItems = [
  {
    id: 'business',
    label: 'Ustawienia wizytówki',
    description: 'Identyfikacja i integracja Google',
    icon: 'pi pi-briefcase'
  },
  {
    id: 'scanning',
    label: 'Ustawienia skanowania',
    description: 'Siatka, odstępy i punkt centralny',
    icon: 'pi pi-th-large'
  },
  {
    id: 'keywords',
    label: 'Słowa kluczowe',
    description: 'Zarządzanie frazami do monitorowania',
    icon: 'pi pi-tags'
  },
  {
    id: 'frequency',
    label: 'Harmonogram',
    description: 'Częstotliwość i automatyzacja skanów',
    icon: 'pi pi-clock'
  },
  {
    id: 'notifications',
    label: 'Powiadomienia',
    description: 'Alerty e-mail i push',
    icon: 'pi pi-bell'
  }
];

const cancelSettings = () => {
  router.push({ name: 'map' });
};

const saveSettings = () => {
  // In real app, save to backend here
  router.push({ name: 'map' });
};

const handleLocationSearch = (query) => {
  // Mock geocoding logic from App.vue
  if (query.toLowerCase().includes('warszawa') || query.toLowerCase().includes('warsaw')) {
    gridConfig.value.centerLat = 52.2297;
    gridConfig.value.centerLng = 21.0122;
    gridConfig.value.centerName = 'Warszawa, Polska';
  } else if (query.toLowerCase().includes('london')) {
    gridConfig.value.centerLat = 51.5074;
    gridConfig.value.centerLng = -0.1278;
    gridConfig.value.centerName = 'London, UK';
  } else {
    gridConfig.value.centerName = query;
  }
};

// Handle highlight query param for scrolling to feature
watch(() => route.query.highlight, async (highlight) => {
  if (highlight) {
    settingsTab.value = 'business';
    await nextTick();
    // Scroll to the feature card - BusinessSettings will handle highlighting
    setTimeout(() => {
      const element = document.querySelector(`[data-feature-key="${highlight}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Remove highlight from URL
        router.replace({ query: { ...route.query, highlight: undefined } });
      }
    }, 300);
  }
}, { immediate: true });

// Handle tab query param
watch(() => route.query.tab, (tab) => {
  if (tab && settingsNavItems.find(item => item.id === tab)) {
    settingsTab.value = tab;
  }
}, { immediate: true });
</script>


