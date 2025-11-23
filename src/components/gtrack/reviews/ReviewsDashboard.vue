<template>
  <div class="flex flex-col h-full">
    <!-- Navigation Toolbar (Fixed Top) -->
    <div class="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 shadow-sm z-10">
       <Button 
         v-for="tab in tabs" 
         :key="tab.id"
         :label="tab.label" 
         :icon="tab.icon"
         :severity="activeTab === tab.id ? 'primary' : 'secondary'" 
         :text="activeTab !== tab.id"
         @click="activeTab = tab.id"
         size="small"
       />
       
       <div class="ml-auto flex gap-2">
         <Button 
            v-if="activeTab === 'overview'"
            label="Pozyskaj Opinie" 
            icon="pi pi-share-alt" 
            size="small"
            outlined
            @click="activeTab = 'acquisition'"
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

        <!-- Tab Content -->
        <div v-if="activeTab === 'overview'">
            <!-- Stats Dashboard -->
            <ReviewsStats v-if="stats" :stats="stats" />
            <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Skeleton height="150px" class="rounded-lg"></Skeleton>
                <Skeleton height="150px" class="rounded-lg"></Skeleton>
                <Skeleton height="150px" class="rounded-lg"></Skeleton>
            </div>

            <!-- Main Feed -->
            <ReviewsList />
        </div>

        <div v-else-if="activeTab === 'acquisition'">
            <AcquisitionPanel />
        </div>

        <div v-else-if="activeTab === 'intercepted'">
            <InterceptedReviews />
        </div>

        <div v-else-if="activeTab === 'templates'">
            <ResponseTemplates />
        </div>

      </div>
    </div>

    <Toast />
    <DynamicDialog />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import Toast from 'primevue/toast';
import DynamicDialog from 'primevue/dynamicdialog';
import ConfirmDialog from 'primevue/confirmdialog';

import ReviewsStats from './ReviewsStats.vue';
import ReviewsList from './ReviewsList.vue';
import ResponseTemplates from './ResponseTemplates.vue';
import AcquisitionPanel from './AcquisitionPanel.vue';
import InterceptedReviews from './InterceptedReviews.vue';
import { ReviewsService } from '../../../services/ReviewsService';

const stats = ref(null);
const activeTab = ref('overview');

const tabs = [
  { id: 'overview', label: 'Przegląd', icon: 'pi pi-home' },
  { id: 'acquisition', label: 'Pozyskiwanie Opinii', icon: 'pi pi-megaphone' },
  { id: 'intercepted', label: 'Przechwycone Opinie', icon: 'pi pi-inbox' },
  { id: 'templates', label: 'Szablony Odpowiedzi', icon: 'pi pi-list' }
];

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
