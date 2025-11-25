<template>
  <Card :id="id" :class="['w-full scroll-mt-4 relative', cardClass]" :pt="cardPt">
    <template #title>
      <slot name="title"></slot>
    </template>
    <template #content>
      <!-- Blur overlay when feature is locked -->
      <div v-if="!isFeatureAvailable && !showDemo" class="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
        <div class="text-center p-8 max-w-md">
          <i class="pi pi-lock text-4xl text-gray-400 mb-4"></i>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Funkcja niedostępna</h3>
          <p class="text-sm text-gray-600 mb-4">
            {{ featureDescription || `${featureLabel} jest dostępna w planie ${featurePlanName}. Zwiększ pakiet, aby korzystać z tej funkcji.` }}
          </p>
          <div class="flex flex-col gap-2">
            <Button 
              label="Zobacz demo" 
              icon="pi pi-eye"
              size="small"
              outlined
              @click="toggleDemo"
            />
            <Button 
              label="Zwiększ pakiet" 
              icon="pi pi-arrow-right"
              size="small"
              @click="navigateToSettings"
            />
          </div>
        </div>
      </div>
      
      <!-- Demo mode indicator -->
      <div v-if="!isFeatureAvailable && showDemo" class="absolute top-2 right-2 z-20">
        <Tag value="Tryb demo" severity="info" class="text-xs">
          <template #value>
            <div class="flex items-center gap-1">
              <i class="pi pi-eye text-xs"></i>
              <span>Tryb demo</span>
              <Button 
                icon="pi pi-times" 
                text 
                rounded 
                size="small"
                class="ml-1 h-4 w-4 p-0"
                @click="toggleDemo"
                v-tooltip.top="'Zamknij demo'"
              />
            </div>
          </template>
        </Tag>
      </div>
      
      <div :class="{ 'blur-sm pointer-events-none': !isFeatureAvailable && !showDemo }">
        <slot name="content"></slot>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import { useFeatureFlags, FEATURES } from '../../../composables/useFeatureFlags';

const props = defineProps({
  id: {
    type: String,
    required: false
  },
  featureKey: {
    type: String,
    required: false,
    default: null
  },
  featureDescription: {
    type: String,
    required: false
  },
  cardClass: {
    type: String,
    default: ''
  },
  cardPt: {
    type: Object,
    default: () => ({})
  },
  // If featureKey is not provided, feature is always available
  alwaysAvailable: {
    type: Boolean,
    default: false
  }
});

const router = useRouter();
const { isFeatureAvailable: checkFeatureAvailable, isFeatureLocked } = useFeatureFlags();

// Find feature in FEATURES object
const feature = computed(() => {
  return Object.values(FEATURES).find(f => f.key === props.featureKey) || null;
});

const isFeatureAvailable = computed(() => {
  if (props.alwaysAvailable || !props.featureKey) return true; // Always available if flag set or no feature key
  if (!feature.value) return true; // If feature not found, assume available
  return checkFeatureAvailable(feature.value);
});

const featureLabel = computed(() => feature.value?.label || 'Funkcja');
const featurePlanName = computed(() => feature.value?.planName || 'Professional');

// Demo mode state - shared across all FeatureCard instances
const demoStates = ref({});

// Use id or featureKey as unique identifier for demo state
const demoKey = computed(() => props.id || props.featureKey || 'default');

const showDemo = computed({
  get() {
    return demoStates.value[demoKey.value] || false;
  },
  set(value) {
    demoStates.value[demoKey.value] = value;
  }
});

const toggleDemo = () => {
  showDemo.value = !showDemo.value;
};

const navigateToSettings = () => {
  const locationId = router.currentRoute.value.params.locationId;
  router.push({ 
    name: 'settings',
    params: { locationId },
    query: { 
      tab: 'business',
      highlight: props.featureKey
    }
  });
};

// Expose computed property for parent components
defineExpose({
  isFeatureAvailable,
  showDemo,
  toggleDemo
});
</script>

<style scoped>
:deep(.p-card-body) {
  position: relative;
}
</style>

