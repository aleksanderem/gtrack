<template>
  <div class="flex flex-col h-full">
    <!-- Navigation Toolbar (Fixed Top) -->
    <div class="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 shadow-sm sticky top-0" :style="{ zIndex: 0 }">
       <div v-for="tab in tabs" :key="tab.id" class="relative flex items-center">
         <div class="flex items-center gap-2" :class="{ 'opacity-50': isTabLocked(tab) }">
           <Button 
             :label="tab.label" 
             :icon="isTabLocked(tab) ? 'pi pi-lock' : tab.icon"
             :severity="isTabActive(tab.id) ? 'primary' : 'secondary'" 
             :text="!isTabActive(tab.id)"
             @click="navigateToTab(tab.id)"
             size="small"
             :disabled="isTabLocked(tab)"
             v-tooltip.top="isTabLocked(tab) ? getTabLockReason(tab) : ''"
           />
         </div>
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
    </div>

    <!-- Scrollable Content Area -->
    <div class="flex-1 overflow-auto bg-gray-50">
      <div class="p-6 mx-auto" :class="{ 'max-w-7xl': route.name !== 'reviews-intercepted' && route.name !== 'reviews-templates' && route.name !== 'reviews-auto-reply' && route.name !== 'reviews-auto-reply-history', 'w-full': route.name === 'reviews-intercepted' || route.name === 'reviews-templates' || route.name === 'reviews-auto-reply' || route.name === 'reviews-auto-reply-history' }">
        
        <!-- Common Header for all tabs or just specific ones -->
        <div v-if="route.name !== 'reviews-auto-reply-history'" class="mb-4">
           <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
           <p class="text-gray-500">{{ pageDescription }}</p>
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
import { useFeatures } from '../../../composables/useFeatures';

const stats = ref(null);
const unreadReviewsCount = ref(0);
const unreadInterceptedCount = ref(0);
const route = useRoute();
const router = useRouter();

const { can, isLocked, features } = useFeatures();

const tabs = [
  { id: 'overview', label: 'Przegląd', icon: 'pi pi-home', routeName: 'reviews-overview', featureKey: null },
  { id: 'reviews', label: 'Opinie', icon: 'pi pi-comments', routeName: 'reviews-list', featureKey: 'viewReviews' },
  { id: 'acquisition', label: 'Pozyskiwanie Opinii', icon: 'pi pi-megaphone', routeName: 'reviews-acquisition', featureKey: 'acquisition' },
  { id: 'intercepted', label: 'Przechwycone Opinie', icon: 'pi pi-inbox', routeName: 'reviews-intercepted', featureKey: 'interceptedReviews' },
  { id: 'templates', label: 'Szablony Odpowiedzi', icon: 'pi pi-list', routeName: 'reviews-templates', featureKey: 'templates' },
  { id: 'auto-reply', label: 'Auto-Odpowiedzi', icon: 'pi pi-sparkles', routeName: 'reviews-auto-reply', featureKey: 'autoReply' }
];

// Check if tab is locked
const isTabLocked = (tab) => {
  if (!tab.featureKey) return false;
  return isLocked(tab.featureKey);
};

// Get lock reason for tab
const getTabLockReason = (tab) => {
  if (!isTabLocked(tab)) return '';
  const feature = features[tab.featureKey];
  if (!feature) return '';
  // We can get the required plan name from the feature definition
  // For now, hardcoding based on plan levels or just generic message
  return `${feature.label} wymaga wyższego planu. Kliknij, aby zobaczyć szczegóły.`;
};

const pageTitle = computed(() => {
  const titles = {
    'reviews-overview': 'Przegląd Opinii',
    'reviews-list': 'Opinie',
    'reviews-acquisition': 'Pozyskiwanie Opinii',
    'reviews-intercepted': 'Przechwycone Opinie',
    'reviews-templates': 'Szablony Odpowiedzi',
    'reviews-auto-reply': 'Auto-Odpowiedzi'
  };
  return titles[route.name] || 'Opinie Klientów';
});

const pageDescription = computed(() => {
  const descriptions = {
    'reviews-overview': 'Przeglądaj statystyki i analizy dotyczące opinii klientów.',
    'reviews-list': 'Zarządzaj opiniami klientów z różnych źródeł.',
    'reviews-acquisition': 'Pozyskuj nowe opinie od klientów.',
    'reviews-intercepted': 'Przeglądaj i odpowiadaj na przechwycone opinie.',
    'reviews-templates': 'Zarządzaj szablonami odpowiedzi na opinie.',
    'reviews-auto-reply': 'Skonfiguruj automatyczne odpowiadanie na opinie.'
  };
  return descriptions[route.name] || 'Zarządzaj reputacją swojej firmy w jednym miejscu.';
});

const isTabActive = (tabId) => {
    // Simple check based on route name mapping
    const mapping = tabs.find(t => t.id === tabId);
    if (!mapping) return false;
    
    // Special handling for auto-reply tab (both settings and history)
    if (tabId === 'auto-reply') {
      return route.name === 'reviews-auto-reply' || route.name === 'reviews-auto-reply-history';
    }
    
    return route.name === mapping.routeName;
};

const navigateToTab = (tabId) => {
    const mapping = tabs.find(t => t.id === tabId);
    if (mapping) {
        // Don't navigate if tab is locked
        if (isTabLocked(mapping)) {
            router.push({ 
                name: 'settings',
                query: { 
                    tab: 'business',
                    highlight: mapping.featureKey 
                }
            });
            return;
        }
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

<style scoped>
/* Ensure PrimeVue Menubar submenu appears below the navigation toolbar */
:deep(.p-menubar-submenu) {
  z-index: 1000 !important;
}
</style>
