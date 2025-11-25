<template>
  <div class="flex-1 overflow-auto bg-surface-50 h-full">
    <div class="bg-white border-b border-gray-200">
      <div class="mx-auto flex items-center justify-between gap-4 px-6 py-5 lg:px-12" style="max-width: 1200px;">
        <h1 class="text-gray-900 font-semibold text-xl lg:text-2xl m-0">Ustawienia projektu</h1>
        <div class="flex items-center gap-2">
          <Button label="Anuluj" severity="secondary" outlined @click="cancelSettings" class="text-sm"/>
          <Button label="Zapisz ustawienia" icon="pi pi-check" @click="saveSettings" class="text-sm" :loading="isSaving" />
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
          key="business-settings"
          v-model="businessConfig"
        />
        <GridConfiguration
          v-else-if="settingsTab === 'scanning'"
          key="grid-settings"
          v-model:gridSize="gridConfig.maxSize"
          v-model:stepKm="gridConfig.stepKm"
          v-model:centerName="gridConfig.centerName"
          @search-location="handleLocationSearch"
        />
        <KeywordsSettings 
          v-else-if="settingsTab === 'keywords'" 
          key="keywords-settings"
          v-model:keywords="keywords"
          :website="businessConfig.website"
        />
        <FrequencySettings 
          v-else-if="settingsTab === 'frequency'" 
          key="frequency-settings"
        />
        <NotificationSettings 
          v-else 
          key="notification-settings"
        />
      </SettingsLayout>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import SettingsLayout from '../components/gtrack/settings/SettingsLayout.vue';
import BusinessSettings from '../components/gtrack/settings/BusinessSettings.vue';
import GridConfiguration from '../components/gtrack/sidebar/GridConfiguration.vue';
import KeywordsSettings from '../components/gtrack/settings/KeywordsSettings.vue';
import FrequencySettings from '../components/gtrack/settings/FrequencySettings.vue';
import NotificationSettings from '../components/gtrack/settings/NotificationSettings.vue';
import { useLocationData } from '../composables/useLocationData';
import { useFeatureSettings } from '../stores/featureSettings';
import { convex } from '../convex';
import { api } from '../../convex/_generated/api';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const { location, keywords, gridConfig } = useLocationData();
const { featureSettings } = useFeatureSettings();

// Convex Data
const orgData = ref(null);
let unsubscribeOrg = null;

onMounted(() => {
    unsubscribeOrg = convex.onUpdate(api.organizations.getCurrent, {}, (org) => {
        orgData.value = org;
    });
});

onUnmounted(() => {
    if (unsubscribeOrg) unsubscribeOrg();
});

const settingsTab = ref('business');
const isSaving = ref(false);

const businessConfig = ref({
  placeId: '',
  cid: '',
  isConnected: false,
  website: '',
  // Feature settings will be synced from global store
  autoReply: false,
  photoMonitoring: true,
  postPublishing: false,
  dataProtection: true,
  qaMonitoring: false,
  hoursSync: false
});

// Sync from backend when loaded
watch(orgData, (org) => {
    if (org) {
        if (org.website) businessConfig.value.website = org.website;
        
        if (org.businessProfile) {
            businessConfig.value.placeId = org.businessProfile.placeId || '';
            businessConfig.value.cid = org.businessProfile.cid || '';
            businessConfig.value.isConnected = org.businessProfile.isConnected || false;
        }

        if (org.gridSettings) {
            gridConfig.value.maxSize = org.gridSettings.maxSize;
            gridConfig.value.stepKm = org.gridSettings.stepKm;
            gridConfig.value.centerName = org.gridSettings.centerName;
            if (org.gridSettings.centerLat) gridConfig.value.centerLat = org.gridSettings.centerLat;
            if (org.gridSettings.centerLng) gridConfig.value.centerLng = org.gridSettings.centerLng;
        }

        if (org.featureFlags) {
            // Update local config AND global store
            Object.keys(org.featureFlags).forEach(key => {
                businessConfig.value[key] = org.featureFlags[key];
                featureSettings.value[key] = org.featureFlags[key];
            });
        }
    }
});

// Sync businessConfig with global feature settings (two-way)
watch(() => featureSettings.value, (newSettings) => {
  Object.keys(newSettings).forEach(key => {
    if (businessConfig.value.hasOwnProperty(key)) {
      businessConfig.value[key] = newSettings[key];
    }
  });
}, { deep: true });

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

const saveSettings = async () => {
  if (!orgData.value) return;
  
  isSaving.value = true;
  try {
      await convex.mutation(api.organizations.updateSettings, {
          orgId: orgData.value._id,
          businessProfile: {
              placeId: businessConfig.value.placeId,
              cid: businessConfig.value.cid,
              isConnected: businessConfig.value.isConnected
          },
          gridSettings: {
              maxSize: gridConfig.value.maxSize,
              stepKm: gridConfig.value.stepKm,
              centerName: gridConfig.value.centerName,
              centerLat: gridConfig.value.centerLat,
              centerLng: gridConfig.value.centerLng
          },
          featureFlags: {
              autoReply: businessConfig.value.autoReply,
              photoMonitoring: businessConfig.value.photoMonitoring,
              postPublishing: businessConfig.value.postPublishing,
              dataProtection: businessConfig.value.dataProtection,
              qaMonitoring: businessConfig.value.qaMonitoring,
              hoursSync: businessConfig.value.hoursSync
          }
      });
      
      toast.add({ severity: 'success', summary: 'Zapisano', detail: 'Ustawienia zostały zaktualizowane', life: 3000 });
      
      // Optional: Navigate away after short delay or stay
      // router.push({ name: 'map' }); 
  } catch (e) {
      console.error(e);
      toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zapisać ustawień', life: 3000 });
  } finally {
      isSaving.value = false;
  }
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


