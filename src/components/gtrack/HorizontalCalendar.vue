<template>
  <div class="bg-white border-b border-gray-200 p-3">
    <div class="flex items-center gap-3">
      <!-- Date Carousel -->
      <div class="flex-1 flex items-center gap-2">
        <button
          @click="scrollDates(-1)"
          class="p-button p-button-icon-only p-button-rounded p-button-text"
          :disabled="selectedDateIndex <= 0"
        >
          <i class="pi pi-chevron-left"></i>
        </button>

        <div class="date-carousel flex-1">
          <div
            v-for="(date, index) in visibleDates"
            :key="date.index"
            @click="selectDate(date.index)"
            class="date-item"
            :class="{ active: selectedDateIndex === date.index }"
          >
            <div class="text-xs font-medium" style="opacity: 0.8;">{{ date.month }}</div>
            <div class="text-2xl font-bold">{{ date.day }}</div>
            <div class="text-xs" style="opacity: 0.8;">{{ date.weekday }}</div>
          </div>
        </div>

        <button
          @click="scrollDates(1)"
          class="p-button p-button-icon-only p-button-rounded p-button-text"
          :disabled="selectedDateIndex >= dates.length - 1"
        >
          <i class="pi pi-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineEmits } from 'vue'

const emit = defineEmits(['date-selected'])

const dates = ref([])
const selectedDateIndex = ref(15) // Today is at index 15

// Generate 30 dates (15 before, today, 14 after)
const generateDates = () => {
  const today = new Date()
  const datesList = []

  for (let i = -15; i <= 14; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    const weekdayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    datesList.push({
      day: date.getDate(),
      month: monthNames[date.getMonth()],
      weekday: weekdayNames[date.getDay()],
      date: date
    })
  }

  dates.value = datesList
}

// Show 15 dates centered around selected date
const visibleDates = computed(() => {
  const visibleCount = 15
  const halfVisible = Math.floor(visibleCount / 2)

  let startIndex = Math.max(0, selectedDateIndex.value - halfVisible)
  let endIndex = Math.min(dates.value.length, startIndex + visibleCount)

  // Adjust if we're near the end
  if (endIndex - startIndex < visibleCount) {
    startIndex = Math.max(0, endIndex - visibleCount)
  }

  return dates.value.slice(startIndex, endIndex).map((date, idx) => ({
    ...date,
    index: startIndex + idx
  }))
})

const selectDate = (index) => {
  selectedDateIndex.value = index
  emit('date-selected', dates.value[index])
}

const scrollDates = (direction) => {
  const newIndex = selectedDateIndex.value + direction
  if (newIndex >= 0 && newIndex < dates.value.length) {
    selectDate(newIndex)
  }
}

onMounted(() => {
  generateDates()
})
</script>

<style scoped>
.date-carousel {
  display: flex;
  gap: 0.5rem;
  overflow: hidden;
  flex: 1;
}

.date-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s;
  flex: 1 1 0;
  min-width: 0;
}

.date-item:hover {
  background: var(--surface-100);
}

.date-item.active {
  background: #2563eb;
  color: white;
}

.p-button {
  color: var(--text-color-secondary);
}

.p-button:hover {
  background: var(--surface-100);
}

.p-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
