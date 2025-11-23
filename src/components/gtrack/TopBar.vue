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
                <a v-ripple class="flex items-center cursor-pointer px-4 py-2 rounded-lg transition-colors text-sm font-medium" 
                   :class="activeTab === item.id ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'"
                   v-bind="props.action">
                    <span :class="[item.icon, 'text-base leading-normal mr-2']" />
                    <span>{{ item.label }}</span>
                    <i v-if="hasSubmenu" class="pi pi-angle-down ml-2 text-xs"></i>
                </a>
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
  }
})

const emit = defineEmits(['update:activeTab', 'update:selectedReport', 'generate-pdf', 'generate-csv'])

const menuItems = ref([
  { 
    id: 'map', 
    label: 'Mapa', 
    icon: 'pi pi-map',
    command: () => emit('update:activeTab', 'map')
  },
  {
    label: 'Zarządzanie',
    icon: 'pi pi-briefcase',
    items: [
      { 
        id: 'reviews', 
        label: 'Opinie', 
        icon: 'pi pi-star',
        command: () => emit('update:activeTab', 'reviews')
      },
      { 
        id: 'posts', 
        label: 'Posty', 
        icon: 'pi pi-pencil',
        command: () => emit('update:activeTab', 'posts')
      },
      { 
        id: 'content', 
        label: 'Wizytówka', 
        icon: 'pi pi-id-card',
        command: () => emit('update:activeTab', 'content')
      }
    ]
  },
  {
    label: 'Raporty',
    icon: 'pi pi-chart-bar',
    items: [
      { 
        id: 'keywords', 
        label: 'Pozycje', 
        icon: 'pi pi-list',
        command: () => emit('update:activeTab', 'keywords')
      },
      { 
        id: 'comparison', 
        label: 'Konkurencja', 
        icon: 'pi pi-users',
        command: () => emit('update:activeTab', 'comparison')
      }
    ]
  },
  { 
    id: 'settings', 
    label: 'Ustawienia', 
    icon: 'pi pi-cog',
    command: () => emit('update:activeTab', 'settings')
  }
])

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
