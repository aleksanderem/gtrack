<template>
  <div class="bg-surface-0 flex-shrink-0 border-r border-surface-200 overflow-y-auto h-screen sidebar-container">
    <div class="">
      <!-- Back Button -->
      <div class="flex items-center justify-between px-6 space-y-6">
        <router-link
          to="/"
          class="flex items-center gap-2 py-2 text-sm font-medium text-surface-600 hover:text-surface-900 no-underline"
        >
          <i class="pi pi-arrow-left text-base"></i>
          <span>Powrót do harmonogramów</span>
        </router-link>
      
      </div>

      <!-- Location Header with Info/Settings Toggle -->
      <LocationHeader
        :location="location"
        :editMode="editMode"
        :sidebarView="sidebarView"
        @update:sidebarView="$emit('update:sidebarView', $event)"
        @toggle-edit="$emit('toggle-edit')"
      />

      <!-- Contextual panels -->
      <template v-if="sidebarView === 'stats'">
        <MapTrafficStats
          :summary="trafficSummary"
          :sources="trafficSources"
          :loading="trafficLoading"
        />
      </template>
      <template v-else>
        <LocationInfoPanel
          :location="location"
          :editMode="editMode"
          :keywords="keywords"
          @toggle-edit="$emit('toggle-edit')"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import LocationHeader from './sidebar/LocationHeader.vue'
import MapTrafficStats from './sidebar/MapTrafficStats.vue'
import LocationInfoPanel from './sidebar/LocationInfoPanel.vue'

const props = defineProps({
  location: {
    type: Object,
    required: true
  },
  keywords: {
    type: Array,
    default: () => []
  },
  editMode: {
    type: Boolean,
    default: false
  },
  sidebarView: {
    type: String,
    default: 'stats'
  },
  trafficSummary: {
    type: Object,
    default: () => ({})
  },
  trafficSources: {
    type: Array,
    default: () => []
  },
  trafficLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:sidebarView', 'update:keywords', 'toggle-edit'])
</script>

<style scoped>
.sidebar-container {
  width: 320px;
}

.sidebar-container::-webkit-scrollbar {
  width: 8px;
}

.sidebar-container::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-container::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 10px;
  transition: background 0.3s;
}

.sidebar-container:hover::-webkit-scrollbar-thumb {
  background: #cbd5e1;
}

.sidebar-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
