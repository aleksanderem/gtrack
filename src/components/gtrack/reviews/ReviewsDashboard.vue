<template>
  <div class="flex flex-col h-full">
    <!-- Navigation Toolbar (Fixed Top) -->
    <div class="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 shadow-sm z-10">
       <Button 
         v-for="tab in tabs" 
         :key="tab.id"
         :label="tab.label" 
         :icon="tab.icon"
         :severity="isTabActive(tab.id) ? 'primary' : 'secondary'" 
         :text="!isTabActive(tab.id)"
         @click="navigateToTab(tab.id)"
         size="small"
       />
       
       <div class="ml-auto flex gap-2">
         <Button 
            v-if="isTabActive('overview')"
            label="Pozyskaj Opinie" 
            icon="pi pi-share-alt" 
            size="small"
            outlined
            @click="navigateToTab('acquisition')"
          />
       </div>
    </div>

    <!-- Scrollable Content Area -->
    <div class="flex-1 overflow-auto bg-gray-50">
      <div class="p-6 max-w-7xl mx-auto">
        
        <!-- Common Header for all tabs or just specific ones -->
        <div class="mb-8">
           <h1 class="text-2xl font-bold text-gray-900">Opinie Klientów</h1>
           <p class="text-gray-500">Zarządzaj reputacją swojej firmy w jednym miejscu.</p>
        </div>

        <!-- Router View for Sub-tabs -->
        <router-view :stats="stats" />

      </div>
    </div>

    <Toast />
    <DynamicDialog />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import DynamicDialog from 'primevue/dynamicdialog';
import ConfirmDialog from 'primevue/confirmdialog';
import { ReviewsService } from '../../../services/ReviewsService';

const stats = ref(null);
const route = useRoute();
const router = useRouter();

const tabs = [
  { id: 'overview', label: 'Przegląd', icon: 'pi pi-home', routeName: 'reviews-overview' },
  { id: 'acquisition', label: 'Pozyskiwanie Opinii', icon: 'pi pi-megaphone', routeName: 'reviews-acquisition' },
  { id: 'intercepted', label: 'Przechwycone Opinie', icon: 'pi pi-inbox', routeName: 'reviews-intercepted' },
  { id: 'templates', label: 'Szablony Odpowiedzi', icon: 'pi pi-list', routeName: 'reviews-templates' }
];

const isTabActive = (tabId) => {
    // Simple check based on route name mapping
    const mapping = tabs.find(t => t.id === tabId);
    return mapping && route.name === mapping.routeName;
};

const navigateToTab = (tabId) => {
    const mapping = tabs.find(t => t.id === tabId);
    if (mapping) {
        router.push({ name: mapping.routeName, params: { locationId: route.params.locationId } });
    }
};

const loadStats = async () => {
  try {
    const data = await ReviewsService.getStats();
    stats.value = data;
  } catch (e) {
    console.error('Failed to load stats', e);
  }
};

onMounted(() => {
  loadStats();
});
</script>
