<template>
  <div class="flex flex-col h-full">
    <!-- Navigation Toolbar (Fixed Top) -->
    <div class="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 shadow-sm z-10">
       <div v-for="tab in tabs" :key="tab.id" class="relative flex items-center">
         <Button 
           :label="tab.label" 
           :icon="tab.icon"
           :severity="isTabActive(tab.id) ? 'primary' : 'secondary'" 
           :text="!isTabActive(tab.id)"
           @click="navigateToTab(tab.id)"
           size="small"
         />
         <Badge 
           v-if="(tab.id === 'reviews' && unreadReviewsCount > 0) || (tab.id === 'intercepted' && unreadInterceptedCount > 0)"
           :value="tab.id === 'reviews' ? unreadReviewsCount : unreadInterceptedCount"
           severity="danger"
           class="ml-2"
           :pt="{
             root: { class: 'text-xs min-w-[1rem] h-4 px-1' }
           }"
         />
       </div>
       
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
      <div class="p-6 mx-auto" :class="{ 'max-w-7xl': route.name !== 'reviews-intercepted' && route.name !== 'reviews-templates', 'w-full': route.name === 'reviews-intercepted' || route.name === 'reviews-templates' }">
        
        <!-- Common Header for all tabs or just specific ones -->
        <div class="mb-4">
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
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import Toast from 'primevue/toast';
import DynamicDialog from 'primevue/dynamicdialog';
import ConfirmDialog from 'primevue/confirmdialog';
import { ReviewsService } from '../../../services/ReviewsService';

const stats = ref(null);
const unreadReviewsCount = ref(0);
const unreadInterceptedCount = ref(0);
const route = useRoute();
const router = useRouter();

const tabs = [
  { id: 'overview', label: 'Przegląd', icon: 'pi pi-home', routeName: 'reviews-overview' },
  { id: 'reviews', label: 'Opinie', icon: 'pi pi-comments', routeName: 'reviews-list' },
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

const loadUnreadCounts = async () => {
  try {
    // Load unread reviews count (status: 'unanswered')
    const reviews = await ReviewsService.getReviews();
    unreadReviewsCount.value = reviews.filter(r => r.status === 'unanswered').length;
    
    // Load unread intercepted feedbacks count (status: 'new')
    const allFeedbacks = await ReviewsService.getInternalFeedbacks();
    unreadInterceptedCount.value = allFeedbacks.filter(f => f.status === 'new').length;
  } catch (e) {
    console.error('Failed to load unread counts', e);
  }
};

onMounted(() => {
  loadStats();
  loadUnreadCounts();
  
  // Refresh counts periodically (every 30 seconds)
  setInterval(() => {
    loadUnreadCounts();
  }, 30000);
});

// Refresh counts when route changes (user navigates between tabs)
watch(() => route.name, () => {
  loadUnreadCounts();
});
</script>
