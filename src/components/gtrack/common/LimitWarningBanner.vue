<template>
  <div 
    v-if="status.hasLimit && (status.isExceeded || status.percentage >= 75)"
    class="limit-warning-banner"
    :class="`limit-warning-${status.severity}`"
  >
    <div class="limit-warning-content">
      <i :class="getIcon(status.severity)" class="limit-warning-icon"></i>
      <div class="limit-warning-text">
        <div class="limit-warning-message">
          <strong>{{ status.message }}</strong>
        </div>
        <div v-if="status.upgradeMessage" class="limit-warning-upgrade">
          {{ status.upgradeMessage }}
        </div>
      </div>
      <button 
        v-if="showUpgradeButton && status.isExceeded"
        class="limit-warning-button"
        @click="$emit('upgrade')"
      >
        Zwiększ pakiet
      </button>
    </div>
    
    <!-- Progress bar -->
    <div v-if="!status.isExceeded && status.limit < 999" class="limit-warning-progress">
      <div 
        class="limit-warning-progress-bar" 
        :style="{ width: `${Math.min(100, status.percentage)}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: Object,
    required: true
  },
  showUpgradeButton: {
    type: Boolean,
    default: true
  }
});

defineEmits(['upgrade']);

const getIcon = (severity) => {
  switch (severity) {
    case 'danger': return 'pi pi-exclamation-circle';
    case 'warning': return 'pi pi-exclamation-triangle';
    case 'warn': return 'pi pi-info-circle';
    default: return 'pi pi-info-circle';
  }
};
</script>

<style scoped>
.limit-warning-banner {
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid;
}

.limit-warning-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.limit-warning-icon {
  font-size: 1.25rem;
  margin-top: 0.125rem;
}

.limit-warning-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.limit-warning-message {
  font-size: 0.875rem;
  line-height: 1.5;
}

.limit-warning-upgrade {
  font-size: 0.8125rem;
  opacity: 0.9;
}

.limit-warning-button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  white-space: nowrap;
}

.limit-warning-progress {
  margin-top: 0.75rem;
  height: 0.5rem;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
  overflow: hidden;
}

.limit-warning-progress-bar {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 0.25rem;
}

/* Danger - exceeded */
.limit-warning-danger {
  background-color: #fef2f2;
  border-color: #fca5a5;
  color: #991b1b;
}

.limit-warning-danger .limit-warning-icon {
  color: #dc2626;
}

.limit-warning-danger .limit-warning-button {
  background-color: #dc2626;
  color: white;
}

.limit-warning-danger .limit-warning-button:hover {
  background-color: #b91c1c;
}

/* Warning - 90%+ */
.limit-warning-warning {
  background-color: #fef3c7;
  border-color: #fbbf24;
  color: #92400e;
}

.limit-warning-warning .limit-warning-icon {
  color: #f59e0b;
}

.limit-warning-warning .limit-warning-progress-bar {
  background-color: #f59e0b;
}

/* Warn - 75%+ */
.limit-warning-warn {
  background-color: #dbeafe;
  border-color: #93c5fd;
  color: #1e40af;
}

.limit-warning-warn .limit-warning-icon {
  color: #3b82f6;
}

.limit-warning-warn .limit-warning-progress-bar {
  background-color: #3b82f6;
}

/* Info - general */
.limit-warning-info {
  background-color: #f0f9ff;
  border-color: #bfdbfe;
  color: #1e3a8a;
}

.limit-warning-info .limit-warning-icon {
  color: #2563eb;
}

.limit-warning-info .limit-warning-progress-bar {
  background-color: #2563eb;
}
</style>
