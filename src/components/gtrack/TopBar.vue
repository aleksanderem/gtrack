<template>
  <div class="bg-white px-6 py-4 border-b border-gray-200">
    <div class="flex flex-wrap items-center gap-4 md:gap-6">
      <!-- Report selector -->
      <div class="flex items-center gap-3 order-1 h-[52px]">
        <Select
          v-model="reportModel"
          :options="reportOptions"
          optionLabel="name"
          placeholder="Wybierz raport"
          class="w-60 md:w-72 h-full rounded-2xl"
          :disabled="isLoadingReport"
          :loading="isLoadingReport"
          :pt="selectPT"
        >
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center gap-2">
              <i class="pi pi-map-marker text-base leading-normal text-gray-500"></i>
              <span>{{ slotProps.value.name }}</span>
            </div>
            <span v-else class="flex items-center gap-2">
              <i class="pi pi-map-marker text-base leading-normal text-gray-500"></i>
              <span>{{ slotProps.placeholder }}</span>
            </span>
          </template>
          <template #option="slotProps">
            <div class="flex items-center gap-2">
              <i class="pi pi-map-marker text-base leading-normal text-gray-500"></i>
              <span>{{ slotProps.option.name }}</span>
            </div>
          </template>
        </Select>
      </div>

      <!-- Menubar -->
      <div class="flex-1 min-w-[240px] order-2 h-[52px] flex items-center">
        <Menubar :model="menuItems" class="border-none bg-transparent p-0 w-full" :pt="{ root: { class: 'bg-transparent border-none p-0' }, menu: { class: 'gap-1' } }">
            <template #item="{ item, props, hasSubmenu }">
                <a 
                  v-ripple 
                  class="flex items-center cursor-pointer px-4 py-2 rounded-lg transition-colors text-sm font-medium relative" 
                  :class="[
                    activeTab === item.id ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50',
                    item.featureKey && isLocked(item.featureKey) ? 'opacity-60' : ''
                  ]"
                  v-bind="props.action"
                >
                    <span :class="[item.icon, 'text-base leading-normal mr-2']" />
                    <span>{{ item.label }}</span>
                    <i v-if="hasSubmenu" class="pi pi-angle-down ml-2 text-xs"></i>
                    <span 
                      v-if="item.featureKey && isLocked(item.featureKey)" 
                      class="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700 border border-purple-200"
                      title="Wymaga wyższej licencji"
                    >
                      <i class="pi pi-lock text-[8px]"></i>
                      <span>{{ getPlanName(item.featureKey) }}</span>
                    </span>
                </a>
            </template>
            <template #submenu="{ item }">
              <div class="bg-white border border-gray-200 rounded-xl shadow-xl py-1 min-w-[200px]">
                <a
                  v-for="subItem in item.items"
                  :key="subItem.id"
                  v-ripple
                  class="flex items-center justify-between px-4 py-2.5 text-sm transition-colors relative"
                  :class="[
                    activeTab === subItem.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50',
                    subItem.featureKey && isLocked(subItem.featureKey) ? 'opacity-60' : ''
                  ]"
                >
                  <div class="flex items-center gap-2">
                    <i :class="[subItem.icon, 'text-base']"></i>
                    <span>{{ subItem.label }}</span>
                  </div>
                  <span 
                    v-if="subItem.featureKey && isLocked(subItem.featureKey)" 
                    class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700 border border-purple-200"
                    title="Wymaga wyższej licencji"
                  >
                    <i class="pi pi-lock text-[8px]"></i>
                    <span>{{ getPlanName(subItem.featureKey) }}</span>
                  </span>
                </a>
              </div>
            </template>
        </Menubar>
      </div>

      <!-- Generate menu -->
      <div class="relative order-3 ml-auto h-[52px]">
        <button
          class="flex h-full items-center gap-2 px-4 rounded-xl border border-gray-200 bg-white text-sm font-semibold transition-colors hover:bg-gray-100"
          @click="toggleGenerateMenu"
        >
          <i class="pi pi-file"></i>
          <span>Generuj</span>
          <i class="pi pi-chevron-down text-xs text-gray-500 transition-transform" :class="{ 'rotate-180': showGenerateMenu }"></i>
        </button>

        <div
          v-if="showGenerateMenu"
          class="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
        >
          <button
            class="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-600 transition-colors hover:bg-gray-50"
            @click="generatePDF"
          >
            <i class="pi pi-file-pdf text-sm"></i>
            <span>Raport PDF</span>
          </button>
          <button
            class="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-600 transition-colors hover:bg-gray-50"
            @click="generateCSV"
          >
            <i class="pi pi-file-excel text-sm"></i>
            <span>Raport CSV</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import Select from 'primevue/select'
import Menubar from 'primevue/menubar'
import { useRouter } from 'vue-router'
import { useFeatures } from '../../composables/useFeatures'
import { useFeatureSettings } from '../../stores/featureSettings'
import { PLAN_NAMES } from '../../config/features'

const props = defineProps({
  activeTab: {
    type: String,
    default: 'map'
  },
  reportOptions: {
    type: Array,
    default: () => []
  },
  selectedReport: {
    type: Object,
    default: null
  },
  isLoadingReport: {
    type: Boolean,
    default: false
  },
  businessConfig: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:activeTab', 'update:selectedReport', 'generate-pdf', 'generate-csv'])
const router = useRouter()
const { isLocked, features } = useFeatures()
const { featureSettings } = useFeatureSettings()

const navigateToFeatureSettings = (featureKey) => {
  // Logic to navigate to settings or show upgrade modal
  // For now, we can just emit an event or log
  console.log('Navigate to settings for feature:', featureKey)
  emit('update:activeTab', 'settings')
}

const createCommand = (item, featureKey) => {
  return () => {
    if (featureKey && isLocked(featureKey)) {
      // Navigate to settings instead
      navigateToFeatureSettings(featureKey)
    } else {
      // Normal navigation
      emit('update:activeTab', item.id)
    }
  }
}

const getPlanName = (featureKey) => {
    const plan = features[featureKey]?.requiredPlan;
    return PLAN_NAMES[plan] || 'Professional';
}

// Helper to check if feature should be visible in menu
const isFeatureVisible = (featureKey) => {
  if (!featureKey) return true; // Always show if no feature key
  // Check if feature is enabled in featureSettings
  const isEnabled = featureSettings.value && featureSettings.value[featureKey] !== false;
  // Also check if feature is not locked by plan
  const notLocked = !isLocked(featureKey);
  return isEnabled && notLocked;
};

const menuItems = computed(() => {
  const allItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'pi pi-th-large',
      command: () => emit('update:activeTab', 'dashboard')
    },
    {
      id: 'map',
      label: 'Mapa',
      icon: 'pi pi-map',
      command: () => emit('update:activeTab', 'map'),
      featureKey: 'map'
    },
    {
      label: 'Zarządzanie',
      icon: 'pi pi-briefcase',
      items: [
        { 
          id: 'reviews', 
          label: 'Opinie', 
          icon: 'pi pi-star',
          command: () => emit('update:activeTab', 'reviews'),
          featureKey: 'reviews'
        },
        { 
          id: 'posts', 
          label: 'Posty', 
          icon: 'pi pi-pencil',
          command: createCommand({ id: 'posts' }, 'postPublishing'),
          featureKey: 'postPublishing'
        },
        {
          id: 'content',
          label: 'Wizytówka',
          icon: 'pi pi-id-card',
          command: () => emit('update:activeTab', 'content'),
          featureKey: 'content'
        },
        {
          id: 'media',
          label: 'Media',
          icon: 'pi pi-images',
          command: () => emit('update:activeTab', 'media'),
          featureKey: 'media'
        },
        {
          id: 'tasks',
          label: 'Smart Tasks',
          icon: 'pi pi-check-square',
          command: () => emit('update:activeTab', 'tasks'),
          featureKey: 'tasks'
        },
        {
          id: 'monitoring',
          label: 'Monitoring',
          icon: 'pi pi-shield',
          command: () => emit('update:activeTab', 'monitoring'),
          featureKey: 'monitoring'
        }
      ].filter(item => isFeatureVisible(item.featureKey))
    },
    {
      id: 'raporty',
      label: 'Raporty',
      icon: 'pi pi-chart-bar',
      command: () => emit('update:activeTab', 'raporty'),
      featureKey: 'raporty'
    },
    { 
      id: 'settings', 
      label: 'Ustawienia', 
      icon: 'pi pi-cog',
      command: () => emit('update:activeTab', 'settings'),
      featureKey: 'settings'
    }
  ];
  
  // Filter out parent items that have no visible children
  return allItems.filter(item => {
    if (item.items) {
      // If it's a parent with submenu, only show if it has visible children
      return item.items.length > 0;
    }
    // Otherwise, check if the feature itself is visible
    return isFeatureVisible(item.featureKey);
  });
})

const showGenerateMenu = ref(false)

const toggleGenerateMenu = () => {
  showGenerateMenu.value = !showGenerateMenu.value
}

const generatePDF = () => {
  emit('generate-pdf')
  showGenerateMenu.value = false
}

const generateCSV = () => {
  emit('generate-csv')
  showGenerateMenu.value = false
}

const reportModel = computed({
  get: () => props.selectedReport,
  set: (value) => emit('update:selectedReport', value)
})

const selectPT = {
  root: {
    class: 'rounded-2xl border border-gray-200 hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-0 shadow-none transition-colors'
  },
  control: {
    class: 'h-full rounded-2xl px-4 text-sm font-medium text-gray-700'
  },
  trigger: {
    class: 'px-3 text-gray-500'
  },
  dropdownIcon: {
    class: 'text-gray-500'
  },
  overlay: {
    class: 'rounded-2xl border border-gray-200 shadow-xl mt-2'
  },
  list: {
    class: 'py-1'
  },
  option: {
    class: 'px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors rounded-2xl mx-1'
  },
  optionSelected: {
    class: 'bg-gray-100 text-gray-900 font-medium rounded-2xl'
  },
  emptyMessage: {
    class: 'px-4 py-2 text-sm text-gray-500'
  }
}
</script>

<style scoped>
:deep(.p-select.p-focus) {
  border-color: #2563eb;
  box-shadow: none;
}

:deep(.p-select) {
  border-radius: 1rem;
}

:deep(.p-select-dropdown) {
  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;
}

:deep(.p-select-label:focus-visible) {
  outline: none;
}
</style>
