<template>
  <div v-if="visible" class="fixed bottom-0 left-0 right-0 z-[9999] bg-gray-900 text-white shadow-2xl border-t border-gray-700">
    <div class="max-w-full overflow-auto max-h-[60vh]">
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div class="flex items-center gap-3">
          <i class="pi pi-bug text-yellow-400"></i>
          <h3 class="text-sm font-semibold">Feature Debug Bar</h3>
        </div>
        <div class="flex items-center gap-2">
          <Button 
            icon="pi pi-save" 
            text 
            size="small" 
            severity="success"
            @click="saveAllSettings"
            v-tooltip.top="'Zapisz wszystkie zmiany'"
            label="Zapisz"
          />
          <Button 
            icon="pi pi-undo" 
            text 
            size="small" 
            severity="warning"
            @click="resetToDefaults"
            v-tooltip.top="'Przywróć do ustawień domyślnych'"
            label="Reset"
          />
          <Button 
            icon="pi pi-refresh" 
            text 
            size="small" 
            severity="secondary"
            @click="refreshSettings"
            v-tooltip.top="'Odśwież'"
          />
          <Button 
            icon="pi pi-times" 
            text 
            size="small" 
            severity="secondary"
            @click="visible = false"
            v-tooltip.top="'Zamknij'"
          />
        </div>
      </div>

      <!-- Content -->
      <div class="p-4 space-y-6">
        <!-- Subscription Plan -->
        <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h4 class="text-sm font-semibold mb-3 flex items-center gap-2">
            <i class="pi pi-id-card text-blue-400"></i>
            Plan Subskrypcji
          </h4>
          <div class="flex items-center gap-3">
            <SelectButton 
              v-model="currentPlan" 
              :options="planOptions"
              optionLabel="label"
              optionValue="value"
              class="flex-1"
            />
            <Badge 
              :value="subscription.name" 
              :severity="getPlanSeverity(currentPlan)"
              class="text-xs"
            />
          </div>
        </div>

        <!-- Feature Hierarchy TreeTable -->
        <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h4 class="text-sm font-semibold mb-3 flex items-center gap-2">
            <i class="pi pi-sitemap text-purple-400"></i>
            Hierarchia Funkcji i Limitów
          </h4>
          <TreeTable 
            :key="`tree-${featurePlansTrigger}`"
            :value="featureTreeNodes" 
            v-model:expandedKeys="expandedKeys"
            tableStyle="min-width: 50rem"
            class="text-xs"
          >
            <Column field="label" header="Funkcja" expander style="min-width: 250px">
              <template #body="slotProps">
                <div class="flex items-center gap-2">
                  <i :class="[slotProps.node.data.icon, 'text-sm']"></i>
                  <span>{{ slotProps.node.data.label }}</span>
                  <Badge 
                    v-if="isNodeLocked(slotProps.node.data)"
                    :value="slotProps.node.data.planName" 
                    severity="warning"
                    class="text-[10px] px-1 py-0"
                  />
                </div>
              </template>
            </Column>
            <Column field="requiredPlan" header="Plan" style="min-width: 120px">
              <template #body="slotProps">
                <Select 
                  :key="`plan-${slotProps.node.data.key}-${featurePlansTrigger}`"
                  v-model="selectedPlans[slotProps.node.data.key]"
                  :options="planOptions"
                  optionLabel="label"
                  optionValue="value"
                  class="w-full text-xs"
                  @update:modelValue="(value) => updateNodePlan(slotProps.node.data.key, value)"
                />
              </template>
            </Column>
            <Column field="limits" header="Limity" style="min-width: 300px">
              <template #body="slotProps">
                <div v-if="Object.keys(slotProps.node.data.limits || {}).length > 0" class="space-y-2">
                  <div 
                    v-for="(limitValue, limitKey) in slotProps.node.data.limits" 
                    :key="limitKey"
                    class="flex flex-col gap-1 text-[10px]"
                  >
                    <span class="text-gray-400 font-semibold">{{ formatLimitKey(limitKey) }}:</span>
                    <div class="flex flex-wrap gap-2">
                      <div 
                        v-for="plan in planOptions" 
                        :key="plan.value"
                        class="flex items-center gap-1"
                      >
                        <InputNumber 
                          :modelValue="getLimitValue(slotProps.node.data.key, limitKey, plan.value)"
                          @update:modelValue="(val) => updateLimitValue(slotProps.node.data.key, limitKey, plan.value, val)"
                          :min="0"
                          size="small"
                          class="w-20 text-xs"
                          :pt="{
                            root: { class: 'h-6' },
                            input: { class: 'text-xs py-1 px-2' }
                          }"
                        />
                        <Badge :value="plan.label" severity="secondary" class="text-[9px] px-1" />
                      </div>
                    </div>
                  </div>
                </div>
                <span v-else class="text-gray-500 text-[10px]">Brak limitów</span>
              </template>
            </Column>
            <Column field="enabled" header="Włączone" style="min-width: 100px">
              <template #body="slotProps">
                <InputSwitch 
                  :modelValue="getNodeEnabled(slotProps.node.data.key)"
                  :disabled="isNodeLocked(slotProps.node.data)"
                  @update:modelValue="(value) => updateNodeEnabled(slotProps.node.data.key, value)"
                />
              </template>
            </Column>
          </TreeTable>
        </div>

        <!-- Feature Status Summary -->
        <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h4 class="text-sm font-semibold mb-3 flex items-center gap-2">
            <i class="pi pi-info-circle text-blue-400"></i>
            Status Funkcji
          </h4>
          <div class="space-y-2">
            <div 
              v-for="feature in featureList" 
              :key="feature.configKey"
              class="text-xs"
            >
              <div class="flex items-center justify-between mb-1">
                <span class="font-medium">{{ feature.feature.label }}:</span>
                <div class="flex items-center gap-2">
                  <Tag 
                    :value="getFeatureStatusLabel(feature)"
                    :severity="getFeatureStatusSeverity(feature)"
                    class="text-[10px]"
                  />
                </div>
              </div>
              <div class="text-gray-400 text-[10px] ml-2">
                <span>Klucz: <code class="bg-gray-700 px-1 rounded">{{ feature.configKey }}</code></span>
                <span class="ml-3">Plan: <code class="bg-gray-700 px-1 rounded">{{ feature.feature.planName || 'Basic' }}</code></span>
                <span class="ml-3">Włączone: <code class="bg-gray-700 px-1 rounded">{{ featureSettings.value && featureSettings.value[feature.configKey] ? 'Tak' : 'Nie' }}</code></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Raw Data -->
        <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h4 class="text-sm font-semibold mb-3 flex items-center gap-2">
            <i class="pi pi-code text-green-400"></i>
            Raw Data
          </h4>
          <div class="space-y-3">
            <div>
              <span class="text-xs text-gray-400 font-semibold">Feature Settings:</span>
              <pre class="text-[10px] bg-gray-900 p-2 rounded mt-1 overflow-auto max-h-32">{{ JSON.stringify(featureSettings.value, null, 2) }}</pre>
            </div>
            <div>
              <span class="text-xs text-gray-400 font-semibold">Subscription:</span>
              <pre class="text-[10px] bg-gray-900 p-2 rounded mt-1 overflow-auto max-h-24">{{ JSON.stringify(subscription.value, null, 2) }}</pre>
            </div>
            <div>
              <span class="text-xs text-gray-400 font-semibold">Feature Plans (requiredPlan):</span>
              <pre class="text-[10px] bg-gray-900 p-2 rounded mt-1 overflow-auto max-h-32">{{ JSON.stringify(featurePlansData, null, 2) }}</pre>
            </div>
            <div>
              <span class="text-xs text-gray-400 font-semibold">Feature Limits:</span>
              <pre class="text-[10px] bg-gray-900 p-2 rounded mt-1 overflow-auto max-h-32">{{ JSON.stringify(localFeatureLimits, null, 2) }}</pre>
            </div>
            <div>
              <span class="text-xs text-gray-400 font-semibold">Feature Hierarchy:</span>
              <pre class="text-[10px] bg-gray-900 p-2 rounded mt-1 overflow-auto max-h-40">{{ JSON.stringify(featureTreeNodes, null, 2) }}</pre>
            </div>
            <div>
              <span class="text-xs text-gray-400 font-semibold">Location Data:</span>
              <pre class="text-[10px] bg-gray-900 p-2 rounded mt-1 overflow-auto max-h-32">{{ JSON.stringify(locationData, null, 2) }}</pre>
            </div>
            <div>
              <span class="text-xs text-gray-400 font-semibold">Route Info:</span>
              <pre class="text-[10px] bg-gray-900 p-2 rounded mt-1 overflow-auto max-h-24">{{ JSON.stringify(routeInfo, null, 2) }}</pre>
            </div>
            <div>
              <span class="text-xs text-gray-400 font-semibold">LocalStorage:</span>
              <pre class="text-[10px] bg-gray-900 p-2 rounded mt-1 overflow-auto max-h-32">{{ JSON.stringify(localStorageData, null, 2) }}</pre>
            </div>
            <div>
              <span class="text-xs text-gray-400 font-semibold">Window Location:</span>
              <pre class="text-[10px] bg-gray-900 p-2 rounded mt-1 overflow-auto max-h-24">{{ JSON.stringify(windowLocationData, null, 2) }}</pre>
            </div>
            <div>
              <span class="text-xs text-gray-400 font-semibold">All Features Config:</span>
              <pre class="text-[10px] bg-gray-900 p-2 rounded mt-1 overflow-auto max-h-40">{{ JSON.stringify(allFeaturesConfig, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Toggle Button -->
  <Button 
    v-if="!visible"
    icon="pi pi-bug" 
    rounded
    severity="secondary"
    class="fixed bottom-4 right-4 z-[9998] shadow-lg"
    @click="toggleVisible"
    v-tooltip.top="'Debug Bar'"
  />
  
  <Toast />
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import Button from 'primevue/button';
import InputSwitch from 'primevue/inputswitch';
import InputNumber from 'primevue/inputnumber';
import SelectButton from 'primevue/selectbutton';
import Select from 'primevue/select';
import Badge from 'primevue/badge';
import Tag from 'primevue/tag';
import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useFeatureFlags, FEATURES } from '../../../composables/useFeatureFlags';
import { useFeatureSettings } from '../../../stores/featureSettings';
import { useLocationData } from '../../../composables/useLocationData';
import { FEATURE_HIERARCHY, convertHierarchyToTreeNodes, isFeatureAvailableInPlan } from '../../../composables/featureHierarchy';

const visible = ref(false);

const toggleVisible = () => {
  visible.value = !visible.value;
  console.log('Debug bar visibility toggled:', visible.value);
};

const route = useRoute();
const toast = useToast();
const { isFeatureLocked: isFeatureLockedOriginal, FEATURES: ORIGINAL_FEATURES } = useFeatureFlags();
const { featureSettings, subscription, updateFeature: updateGlobalFeature, updateSubscription } = useFeatureSettings();
const { location, keywords, gridConfig, trafficSummary, trafficSources } = useLocationData();

// Plan hierarchy
const PLAN_HIERARCHY = {
  basic: 1,
  professional: 2,
  enterprise: 3
};

// Local copy of feature plans (requiredPlan) for editing
const loadFeaturePlans = () => {
  const saved = localStorage.getItem('featurePlans');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load feature plans', e);
    }
  }
  // Default plans from FEATURES
  const defaultPlans = {};
  Object.values(FEATURES).forEach(feature => {
    defaultPlans[feature.key] = feature.requiredPlan;
  });
  return defaultPlans;
};

const localFeaturePlans = ref(loadFeaturePlans());

// Load feature limits from localStorage
const loadFeatureLimits = () => {
  const saved = localStorage.getItem('featureLimits');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load feature limits', e);
    }
  }
  return {};
};

const localFeatureLimits = ref(loadFeatureLimits());

// Save feature plans to localStorage
const saveFeaturePlans = () => {
  localStorage.setItem('featurePlans', JSON.stringify(localFeaturePlans.value));
};

// Save feature limits to localStorage
const saveFeatureLimits = () => {
  localStorage.setItem('featureLimits', JSON.stringify(localFeatureLimits.value));
};

// Custom isFeatureLocked that uses local plans
const isFeatureLocked = (feature) => {
  const savedPlan = localFeaturePlans.value[feature.key];
  const requiredPlan = savedPlan || feature.requiredPlan;
  if (!requiredPlan) return false;
  const requiredLevel = PLAN_HIERARCHY[requiredPlan] || 0;
  const currentLevel = PLAN_HIERARCHY[subscription.value.plan] || 0;
  return currentLevel < requiredLevel;
};

const planOptions = [
  { label: 'Basic', value: 'basic' },
  { label: 'Professional', value: 'professional' },
  { label: 'Enterprise', value: 'enterprise' }
];

const currentPlan = ref(subscription.value.plan);

// Watch for subscription changes
watch(() => subscription.value.plan, (newPlan) => {
  currentPlan.value = newPlan;
});

// Watch for plan changes and update subscription
watch(currentPlan, async (newPlan) => {
  if (newPlan !== subscription.value.plan) {
    await updateSubscription(newPlan);
  }
});

// Local copy of feature settings for editing
const localFeatureSettings = ref({ ...featureSettings.value });

// Watch global settings and sync local
watch(() => featureSettings.value, (newSettings) => {
  localFeatureSettings.value = { ...newSettings };
}, { deep: true });

// Force reactivity trigger
const featurePlansTrigger = ref(0);

// Create feature tree nodes from hierarchy
const featureTreeNodes = computed(() => {
  // Access trigger to force reactivity
  featurePlansTrigger.value;
  
  const nodes = convertHierarchyToTreeNodes(FEATURE_HIERARCHY, subscription.value.plan);
  
  // Apply overrides from localStorage
  const applyOverrides = (nodeList) => {
    return nodeList.map(node => {
      const savedPlan = localFeaturePlans.value[node.data.key];
      const savedLimits = localFeatureLimits.value[node.data.key] || {};
      
      // Create a new object to ensure reactivity
      const newNode = { ...node };
      newNode.data = { ...node.data };
      
      // Override plan
      if (savedPlan) {
        newNode.data.requiredPlan = savedPlan;
        newNode.data.planName = savedPlan === 'basic' ? 'Basic' : savedPlan === 'professional' ? 'Professional' : 'Enterprise';
      }
      
      // Override limits
      if (Object.keys(savedLimits).length > 0) {
        const mergedLimits = { ...newNode.data.limits };
        Object.keys(savedLimits).forEach(limitKey => {
          mergedLimits[limitKey] = { ...mergedLimits[limitKey], ...savedLimits[limitKey] };
        });
        newNode.data.limits = mergedLimits;
      }
      
      // Recursively apply to children
      if (newNode.children && newNode.children.length > 0) {
        newNode.children = applyOverrides(newNode.children);
      }
      
      return newNode;
    });
  };
  
  return applyOverrides(nodes);
});

// Expanded keys for TreeTable
const expandedKeys = ref({});

// Selected plans for each node (reactive object)
const selectedPlans = ref({});

// Find feature in hierarchy (including children)
const findFeatureInHierarchy = (key) => {
  for (const feature of Object.values(FEATURE_HIERARCHY)) {
    if (feature.key === key) {
      return feature;
    }
    if (feature.children) {
      for (const child of Object.values(feature.children)) {
        if (child.key === key) {
          return child;
        }
      }
    }
  }
  return null;
};

// Get node plan (with override) - make it reactive
const getNodePlan = (key) => {
  // Access trigger to force reactivity
  featurePlansTrigger.value;
  
  // Check localStorage override first
  if (localFeaturePlans.value && localFeaturePlans.value[key]) {
    return localFeaturePlans.value[key];
  }
  
  // Find in hierarchy
  const feature = findFeatureInHierarchy(key);
  if (feature) {
    return feature.requiredPlan || 'basic';
  }
  
  return 'basic';
};

// Initialize selectedPlans from getNodePlan
const initializeSelectedPlans = () => {
  const plans = {};
  const traverseNodes = (nodes) => {
    nodes.forEach(node => {
      plans[node.data.key] = getNodePlan(node.data.key);
      if (node.children && node.children.length > 0) {
        traverseNodes(node.children);
      }
    });
  };
  traverseNodes(featureTreeNodes.value);
  selectedPlans.value = plans;
};

// Watch featureTreeNodes and update selectedPlans
watch(featureTreeNodes, () => {
  if (featureTreeNodes.value && featureTreeNodes.value.length > 0) {
    initializeSelectedPlans();
  }
}, { deep: true, immediate: false });

// Initialize selectedPlans on mount
onMounted(() => {
  if (featureTreeNodes.value && featureTreeNodes.value.length > 0) {
    initializeSelectedPlans();
  }
});

// Update node plan
const updateNodePlan = async (key, plan) => {
  console.log('updateNodePlan called:', key, plan);
  if (!localFeaturePlans.value) {
    localFeaturePlans.value = {};
  }
  localFeaturePlans.value[key] = plan;
  selectedPlans.value[key] = plan; // Update selectedPlans immediately
  saveFeaturePlans();
  
  // Force reactivity update
  featurePlansTrigger.value++;
  
  // Wait for next tick to ensure TreeTable updates
  await nextTick();
  
  console.log('Updated localFeaturePlans:', localFeaturePlans.value);
  console.log('Trigger value:', featurePlansTrigger.value);
};

// Check if node is locked
const isNodeLocked = (nodeData) => {
  const savedPlan = localFeaturePlans.value[nodeData.key];
  const requiredPlan = savedPlan || nodeData.requiredPlan;
  if (!requiredPlan) return false;
  const PLAN_HIERARCHY = { basic: 1, professional: 2, enterprise: 3 };
  const requiredLevel = PLAN_HIERARCHY[requiredPlan] || 0;
  const currentLevel = PLAN_HIERARCHY[subscription.value.plan] || 0;
  return currentLevel < requiredLevel;
};

// Get node enabled state
const getNodeEnabled = (key) => {
  return featureSettings.value && featureSettings.value[key] || false;
};

// Update node enabled state
const updateNodeEnabled = async (key, value) => {
  await updateGlobalFeature(key, value);
};

// Get limit value
const getLimitValue = (featureKey, limitKey, plan) => {
  const feature = findFeatureInHierarchy(featureKey);
  
  // Check for override first
  if (localFeatureLimits.value[featureKey] && 
      localFeatureLimits.value[featureKey][limitKey] && 
      localFeatureLimits.value[featureKey][limitKey][plan] !== undefined) {
    return localFeatureLimits.value[featureKey][limitKey][plan];
  }
  
  // Then check original limits
  if (feature && feature.limits && feature.limits[limitKey]) {
    return feature.limits[limitKey][plan] || null;
  }
  
  return null;
};

// Update limit value
const updateLimitValue = (featureKey, limitKey, plan, value) => {
  if (!localFeatureLimits.value[featureKey]) {
    localFeatureLimits.value[featureKey] = {};
  }
  if (!localFeatureLimits.value[featureKey][limitKey]) {
    localFeatureLimits.value[featureKey][limitKey] = {};
  }
  localFeatureLimits.value[featureKey][limitKey][plan] = value;
  saveFeatureLimits();
};

// Format limit key for display
const formatLimitKey = (key) => {
  const keyMap = {
    maxReviewsPerPage: 'Max opinii na stronę',
    maxTemplates: 'Max szablonów',
    maxAnalysisPerMonth: 'Max analiz/miesiąc',
    maxAutoRepliesPerMonth: 'Max auto-odpowiedzi/miesiąc',
    maxRules: 'Max reguł',
    maxInterceptedPerMonth: 'Max przechwyconych/miesiąc',
    maxCampaigns: 'Max kampanii',
    maxScheduledPosts: 'Max zaplanowanych postów',
    maxPhotosPerMonth: 'Max zdjęć/miesiąc',
    maxQuestionsPerMonth: 'Max pytań/miesiąc'
  };
  return keyMap[key] || key;
};

// Create feature list with dynamic requiredPlan from localStorage (for backward compatibility)
const featureList = computed(() => {
  return [
    { feature: FEATURES.AUTO_REPLY, configKey: 'autoReply' },
    { feature: FEATURES.PHOTO_MONITORING, configKey: 'syncPhotos' },
    { feature: FEATURES.POST_PUBLISHING, configKey: 'autoPost' },
    { feature: FEATURES.DATA_PROTECTION, configKey: 'protectData' },
    { feature: FEATURES.QA_MONITORING, configKey: 'monitorQA' },
    { feature: FEATURES.HOURS_SYNC, configKey: 'syncHours' }
  ].map(item => {
    // Override requiredPlan from localStorage if available
    const savedPlan = localFeaturePlans.value[item.configKey];
    if (savedPlan) {
      return {
        ...item,
        feature: {
          ...item.feature,
          requiredPlan: savedPlan,
          planName: savedPlan === 'basic' ? 'Basic' : savedPlan === 'professional' ? 'Professional' : 'Enterprise'
        }
      };
    }
    return item;
  });
});

const updateFeatureHandler = async (key, value) => {
  await updateGlobalFeature(key, value);
};

const updateFeaturePlan = (key, plan) => {
  localFeaturePlans.value[key] = plan;
  saveFeaturePlans();
};

const refreshSettings = () => {
  localFeatureSettings.value = { ...featureSettings.value };
  currentPlan.value = subscription.value.plan;
  localFeaturePlans.value = loadFeaturePlans();
  localFeatureLimits.value = loadFeatureLimits();
};

// Save all settings
const saveAllSettings = () => {
  // Plans are already saved automatically, but we can add confirmation
  saveFeaturePlans();
  saveFeatureLimits();
  
  toast.add({
    severity: 'success',
    summary: 'Zapisano',
    detail: 'Wszystkie ustawienia zostały zapisane',
    life: 3000
  });
};

// Reset to default settings
const resetToDefaults = () => {
  // Reset feature plans to defaults from FEATURE_HIERARCHY
  const defaultPlans = {};
  const defaultLimits = {};
  
  // Collect defaults from hierarchy
  const collectDefaults = (hierarchy) => {
    Object.values(hierarchy).forEach(feature => {
      if (feature.requiredPlan) {
        defaultPlans[feature.key] = feature.requiredPlan;
      }
      if (feature.limits) {
        defaultLimits[feature.key] = { ...feature.limits };
      }
      
      if (feature.children) {
        Object.values(feature.children).forEach(child => {
          if (child.requiredPlan) {
            defaultPlans[child.key] = child.requiredPlan;
          }
          if (child.limits) {
            defaultLimits[child.key] = { ...child.limits };
          }
        });
      }
    });
  };
  
  collectDefaults(FEATURE_HIERARCHY);
  
  // Reset to defaults
  localFeaturePlans.value = defaultPlans;
  localFeatureLimits.value = defaultLimits;
  
  // Save to localStorage
  saveFeaturePlans();
  saveFeatureLimits();
  
  // Also reset feature settings to defaults
  const defaultFeatureSettings = {
    autoReply: false,
    syncPhotos: true,
    autoPost: false,
    protectData: true,
    monitorQA: false,
    syncHours: false
  };
  localFeatureSettings.value = { ...defaultFeatureSettings };
  
  // Reset subscription plan
  currentPlan.value = 'basic';
  
  toast.add({
    severity: 'info',
    summary: 'Przywrócono',
    detail: 'Ustawienia zostały przywrócone do wartości domyślnych',
    life: 3000
  });
};

const getPlanSeverity = (plan) => {
  switch (plan) {
    case 'basic': return 'secondary';
    case 'professional': return 'info';
    case 'enterprise': return 'success';
    default: return 'secondary';
  }
};

const getFeatureStatusLabel = (item) => {
  if (isFeatureLocked(item.feature)) {
    return 'Zablokowane';
  }
  return featureSettings.value && featureSettings.value[item.configKey] ? 'Włączone' : 'Wyłączone';
};

const getFeatureStatusSeverity = (item) => {
  if (isFeatureLocked(item.feature)) {
    return 'danger';
  }
  return featureSettings.value && featureSettings.value[item.configKey] ? 'success' : 'warning';
};

// Raw data computed properties
const featurePlansData = computed(() => {
  const plans = {};
  featureList.value.forEach(item => {
    plans[item.configKey] = {
      requiredPlan: item.feature.requiredPlan,
      planName: item.feature.planName
    };
  });
  return plans;
});

const locationData = computed(() => ({
  location: location.value,
  keywords: keywords.value,
  gridConfig: gridConfig.value,
  trafficSummary: {
    title: trafficSummary.value.title,
    primary: {
      id: trafficSummary.value.primary.id,
      label: trafficSummary.value.primary.label,
      value: trafficSummary.value.primary.value
    }
  },
  trafficSources: trafficSources.value.map(s => ({
    id: s.id,
    label: s.label,
    value: s.value
  }))
}));

const routeInfo = computed(() => ({
  name: route.name,
  path: route.path,
  params: route.params,
  query: route.query,
  meta: route.meta
}));

const localStorageData = computed(() => {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    try {
      data[key] = JSON.parse(localStorage.getItem(key));
    } catch (e) {
      data[key] = localStorage.getItem(key);
    }
  }
  return data;
});

const windowLocationData = computed(() => ({
  href: typeof window !== 'undefined' ? window.location.href : null,
  origin: typeof window !== 'undefined' ? window.location.origin : null,
  pathname: typeof window !== 'undefined' ? window.location.pathname : null,
  search: typeof window !== 'undefined' ? window.location.search : null,
  hash: typeof window !== 'undefined' ? window.location.hash : null
}));

const allFeaturesConfig = computed(() => {
  const config = {};
  featureList.value.forEach(item => {
    config[item.configKey] = {
      ...item.feature,
      enabled: featureSettings.value && featureSettings.value[item.configKey] || false,
      locked: isFeatureLocked(item.feature)
    };
  });
  return config;
});

// Toggle visibility with keyboard shortcut (Ctrl+Shift+D)
const handleKeyPress = (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'D') {
    e.preventDefault();
    visible.value = !visible.value;
  }
};

// Add keyboard listener
onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyPress);
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeyPress);
  }
});
</script>

<style scoped>
:deep(.p-selectbutton) {
  display: flex;
  gap: 0.25rem;
}

:deep(.p-selectbutton .p-button) {
  flex: 1;
  padding: 0.5rem;
  font-size: 0.75rem;
}

:deep(.p-inputswitch) {
  width: 2rem;
  height: 1rem;
}

:deep(.p-inputswitch-slider) {
  width: 2rem;
  height: 1rem;
}

:deep(.p-inputswitch-slider:before) {
  width: 0.875rem;
  height: 0.875rem;
}

code {
  font-family: 'Courier New', monospace;
  font-size: 0.625rem;
}

:deep(.p-treetable) {
  font-size: 0.75rem;
}

:deep(.p-treetable .p-treetable-thead > tr > th) {
  background: #374151;
  border-color: #4b5563;
  color: #e5e7eb;
  padding: 0.5rem;
  font-size: 0.75rem;
}

:deep(.p-treetable .p-treetable-tbody > tr > td) {
  background: #1f2937;
  border-color: #4b5563;
  color: #e5e7eb;
  padding: 0.5rem;
}

:deep(.p-treetable .p-treetable-tbody > tr:hover > td) {
  background: #374151;
}

:deep(.p-treetable .p-treetable-tbody > tr.p-highlight > td) {
  background: #4b5563;
}

:deep(.p-treetable .p-treetable-tbody > tr > td .p-select) {
  background: #374151;
  border-color: #4b5563;
}

:deep(.p-treetable .p-treetable-tbody > tr > td .p-select-label) {
  color: #FFF !important;
}

:deep(.p-treetable .p-treetable-tbody > tr > td .p-inputnumber) {
  background: #374151;
  border-color: #4b5563;
}

:deep(.p-treetable .p-treetable-tbody > tr > td .p-inputnumber input) {
  background: #374151;
  color: #e5e7eb;
  border-color: #4b5563;
}
</style>

