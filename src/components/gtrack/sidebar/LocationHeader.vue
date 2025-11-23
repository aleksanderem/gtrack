<template>
  <div class="px-2 py-4 lg:px-4 space-y-6">
    <!-- Location Name (Editable) -->
    <h2 v-if="!editMode" class="text-2xl font-bold text-gray-900 mb-2">
      {{ location.name }}
    </h2>
    <InputText
      v-else
      v-model="location.name"
      class="w-full text-2xl font-bold"
    />

    <!-- View Toggle Pills -->
    <div class="sidebar-pills mt-3">
      <button
        @click="handleStatsClick"
        class="sidebar-pill"
        :class="{ 'active': sidebarView === 'stats' }"
      >
        Statystyki
      </button>
      <button
        @click="handleInfoClick"
        class="sidebar-pill"
        :class="{ 'active': sidebarView === 'info' }"
      >
        Informacje
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import InputText from 'primevue/inputtext'

const props = defineProps({
  location: {
    type: Object,
    required: true
  },
  editMode: {
    type: Boolean,
    default: false
  },
  sidebarView: {
    type: String,
    default: 'stats'
  }
})

const emit = defineEmits(['update:sidebarView', 'toggle-edit'])

const handleStatsClick = () => {
  emit('update:sidebarView', 'stats')
  if (props.editMode && props.sidebarView === 'stats') {
    emit('toggle-edit')
  }
}

const handleInfoClick = () => {
  emit('update:sidebarView', 'info')
  if (props.editMode && props.sidebarView === 'info') {
    emit('toggle-edit')
  }
}
</script>

<style scoped>
.sidebar-pills {
  display: flex;
  gap: 0.5rem;
}

.sidebar-pill {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  background: white;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.sidebar-pill:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.sidebar-pill.active {
  background: var(--p-primary-500);
  border-color: var(--p-primary-500);
  color: white;
}
</style>    