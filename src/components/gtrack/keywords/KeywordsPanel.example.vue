<template>
  <div class="keywords-panel">
    <!-- Limit Warning Banner -->
    <LimitWarningBanner 
      v-if="keywordLimitStatus.hasLimit"
      :status="keywordLimitStatus"
      @upgrade="handleUpgrade"
    />

    <!-- Keywords List -->
    <div class="keywords-list">
      <div 
        v-for="(keyword, index) in keywords" 
        :key="keyword.id"
        class="keyword-item"
        :class="{ 'keyword-item-disabled': isKeywordDisabled(index) }"
      >
        <div class="keyword-info">
          <span class="keyword-text">{{ keyword.text }}</span>
          <Tag 
            v-if="isKeywordDisabled(index)" 
            value="Nieaktywne" 
            severity="warning"
            class="keyword-tag"
          />
        </div>
        <div class="keyword-position">
          <span v-if="!isKeywordDisabled(index)">Pozycja: {{ keyword.position }}</span>
          <span v-else class="text-muted">Wymaga wyższego pakietu</span>
        </div>
      </div>
    </div>

    <!-- Add Keyword Button -->
    <Button 
      label="Dodaj słowo kluczowe" 
      icon="pi pi-plus"
      :disabled="!canAddKeyword"
      @click="addKeyword"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import LimitWarningBanner from '../common/LimitWarningBanner.vue';
import { useFeatures } from '../../../composables/useFeatures';

const router = useRouter();
const { getLimit, getLimitStatus } = useFeatures();

// Mock keywords data
const keywords = ref([
  { id: 1, text: 'salon kosmetyczny warszawa', position: 3 },
  { id: 2, text: 'depilacja laserowa', position: 5 },
  { id: 3, text: 'manicure hybrydowy', position: 8 },
  { id: 4, text: 'przedłużanie rzęs', position: 12 },
  { id: 5, text: 'masaż relaksacyjny', position: 15 },
  { id: 6, text: 'mikrodermabrazja', position: 20 },
  { id: 7, text: 'pedicure medyczny', position: 25 },
  { id: 8, text: 'lifting twarzy', position: 30 },
  { id: 9, text: 'peeling chemiczny', position: 35 },
  { id: 10, text: 'oczyszczanie wodorowe', position: 40 },
  { id: 11, text: 'mezoterapia igłowa', position: 45 },
  { id: 12, text: 'osocze bogatopłytkowe', position: 50 }
]);

// Get keyword limit status
const keywordLimitStatus = computed(() => {
  return getLimitStatus('keywords', 'maxKeywords', keywords.value.length);
});

// Check if keyword is disabled due to limit
const isKeywordDisabled = (index) => {
  const limit = getLimit('keywords', 'maxKeywords');
  return limit !== null && index >= limit;
};

// Check if can add more keywords
const canAddKeyword = computed(() => {
  const limit = getLimit('keywords', 'maxKeywords');
  return limit === null || keywords.value.length < limit;
});

// Add keyword handler
const addKeyword = () => {
  if (canAddKeyword.value) {
    keywords.value.push({
      id: Date.now(),
      text: 'Nowe słowo kluczowe',
      position: 0
    });
  }
};

// Upgrade handler
const handleUpgrade = () => {
  router.push({ name: 'settings', query: { tab: 'subscription' } });
};
</script>

<style scoped>
.keywords-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.keywords-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.keyword-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: white;
  transition: all 0.2s;
}

.keyword-item:hover {
  border-color: #3b82f6;
}

.keyword-item-disabled {
  background-color: #f9fafb;
  opacity: 0.6;
  pointer-events: none;
}

.keyword-item-disabled:hover {
  border-color: #e5e7eb;
}

.keyword-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.keyword-text {
  font-weight: 500;
  font-size: 0.875rem;
}

.keyword-tag {
  font-size: 0.75rem;
}

.keyword-position {
  font-size: 0.875rem;
  color: #6b7280;
}

.text-muted {
  color: #9ca3af;
  font-style: italic;
}
</style>
