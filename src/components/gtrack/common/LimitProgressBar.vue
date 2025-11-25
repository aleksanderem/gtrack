<template>
  <div v-if="hasLimit" class="flex items-center gap-3">
    <div class="flex flex-col items-end" v-if="showLabel">
        <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600 font-medium">{{ label }}:</span>
        </div>
    </div>
    
    <!-- Modern Progress Bar Container -->
    <div class="w-32 bg-gray-100 rounded-full h-2.5 overflow-hidden shadow-inner relative flex-shrink-0">
        <!-- Gradient Bar -->
        <div 
            class="h-full rounded-full transition-all duration-700 ease-out shadow-sm absolute top-0 left-0"
            :class="gradientClass"
            :style="{ width: `${clampedPercentage}%` }"
        ></div>
    </div>
    
    <!-- Counter Text -->
    <span class="text-sm font-semibold whitespace-nowrap" :class="textClass">
        {{ currentCount }}/{{ limit }}
    </span>
    
    <!-- Exceeded Icon -->
    <i v-if="isExceeded" class="pi pi-exclamation-circle text-red-500 text-sm" v-tooltip.top="'Limit osiągnięty'"></i>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: 'Limit'
  },
  currentCount: {
    type: Number,
    required: true
  },
  limit: {
    type: Number,
    required: true
  },
  showLabel: {
    type: Boolean,
    default: true
  }
});

const hasLimit = computed(() => {
  return props.limit !== null && props.limit !== Infinity && props.limit < 999;
});

const percentage = computed(() => {
  if (!hasLimit.value || props.limit === 0) return props.currentCount > 0 ? 100 : 0;
  return Math.round((props.currentCount / props.limit) * 100);
});

const clampedPercentage = computed(() => {
  return Math.min(100, Math.max(0, percentage.value));
});

const isExceeded = computed(() => {
  return props.currentCount >= props.limit;
});

const isWarning = computed(() => {
  return !isExceeded.value && percentage.value >= 75;
});

const gradientClass = computed(() => {
  if (props.limit === 0) return 'bg-gradient-to-r from-red-500 to-red-600'; // Limit 0 always red if any usage (or just empty)
  
  if (isExceeded.value) {
    return 'bg-gradient-to-r from-red-500 to-red-600';
  }
  if (isWarning.value) {
    return 'bg-gradient-to-r from-amber-400 to-amber-500';
  }
  return 'bg-gradient-to-r from-emerald-400 to-emerald-500';
});

const textClass = computed(() => {
  if (isExceeded.value) {
    return 'text-red-600';
  }
  if (isWarning.value) {
    return 'text-amber-600';
  }
  return 'text-gray-700';
});
</script>

