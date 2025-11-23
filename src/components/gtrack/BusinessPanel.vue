<template>
  <div class="business-panel">
    <!-- Header -->
    <div class="close-panel-btn">
      <div class="flex-1">
        <h3 class="text-sm font-semibold text-gray-900 m-0 mb-1">Twoja widoczność</h3>
        <p class="text-xs font-semibold text-gray-900 m-0">Słowa kluczowe ({{ keywordsCount }})</p>
      </div>
      <i class="pi pi-eye text-gray-500" style="font-size: 1.25rem;"></i>
    </div>

    <div class="business-panel-content">
      <!-- User's Business Card (Your Position) -->
      <div class="user-business-card">
        <div class="flex justify-between items-start mb-3">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="user-position-badge" :style="{ background: getRankingBadgeColor(userPosition) }">
                Poz. {{ userPosition }}
              </span>
              <h4 class="text-base font-bold text-gray-900 m-0">Twoja Firma</h4>
            </div>
            <p class="text-sm text-gray-600 m-0">
              Widoczność firmy <i class="pi pi-info-circle"></i>
            </p>
          </div>
        </div>

        <div class="visibility-metrics">
          <div class="metric-item">
            <div class="metric-bar">
              <div class="metric-fill" :style="{ width: `${visibilityPercent}%`, background: '#ef4444' }"></div>
            </div>
            <span class="metric-label">{{ visibilityPercent }}%</span>
          </div>
        </div>

        <div class="text-sm text-gray-600 mt-2">
          Trudność obszaru <i class="pi pi-info-circle"></i>
        </div>
        <div class="difficulty-badge">{{ difficulty }}</div>

        <a href="#" class="view-google-link" @click.prevent="openInGoogle">
          <span>Otwórz w Google</span>
          <i class="pi pi-external-link"></i>
        </a>
      </div>

      <!-- Competitors Section Header -->
      <div class="competitors-header">
        <h5 class="text-sm font-semibold text-gray-600 m-0">
          Konkurenci ({{ competitors.length }})
          <i class="pi pi-eye ml-2"></i>
        </h5>
      </div>

      <!-- Loading Skeleton (shown while fetching data) -->
      <div v-if="isLoading" class="p-3">
        <div v-for="n in 4" :key="`skeleton-${n}`" class="mb-4">
          <div class="flex gap-3">
            <!-- Skeleton for photo (120x120px like business-photo) -->
            <div class="flex flex-col items-center gap-2 flex-shrink-0">
              <Skeleton width="56px" height="56px" borderRadius="8px" />
              <Skeleton width="60px" height="24px" borderRadius="4px" />
            </div>
            <div class="flex-1">
              <Skeleton width="100%" height="1.5rem" class="mb-2" />
              <Skeleton width="75%" height="1rem" class="mb-3" />
              <Skeleton width="100%" height="3rem" class="mb-2" />
              <Skeleton width="60%" height="0.875rem" />
            </div>
          </div>
        </div>
      </div>

      <!-- Competitor Listings (shown when data is loaded) -->
      <div v-if="!isLoading" v-for="(business, index) in competitors" :key="index" class="business-item">
        <div class="flex gap-3">
          <!-- Photo and Position Badge Column -->
          <div class="flex flex-col items-center gap-2 flex-shrink-0">
            <div class="business-photo">
              <img
                :src="business.photoUrl || `https://picsum.photos/seed/${business.name}/120/120`"
                :alt="business.name"
                @error="handleImageError"
              />
              <!-- Fallback avatar when no photo -->
              <div class="photo-fallback">
                {{ business.initials }}
              </div>
            </div>

            <!-- Position Badge (dynamic color based on position, like map markers) -->
            <div
              class="position-badge"
              :style="{
                background: getRankingBadgeColor(business.position),
                boxShadow: `0 1px 4px ${getRankingBadgeColor(business.position)}40`
              }"
            >
              Poz. {{ business.position > 20 ? '20+' : business.position }}
            </div>
          </div>

          <!-- Business Details -->
          <div class="flex-1">
            <div class="mb-2">
              <h4 class="text-base font-bold text-gray-900 m-0 mb-2">{{ business.name }}</h4>
              <div class="business-rating mb-2">
                <i v-for="n in Math.floor(business.rating)" :key="n" class="pi pi-star-fill"></i>
                <i v-if="business.rating % 1 !== 0" class="pi pi-star-half-fill"></i>
                <span class="text-sm font-semibold text-gray-900 ml-1">{{ business.rating.toFixed(1) }}</span>
                <span class="text-sm text-gray-500 ml-1">({{ business.reviewCount }})</span>
              </div>
            </div>

            <p class="business-description mb-2">{{ business.description }}</p>

            <div class="flex flex-col gap-2 text-sm text-gray-600">
              <div class="flex items-center gap-1">
                <i class="pi pi-map-marker"></i>
                <span>{{ business.address }}</span>
              </div>
              <div v-if="business.phone" class="flex items-center gap-1">
                <i class="pi pi-phone"></i>
                <span>{{ business.phone }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import Skeleton from 'primevue/skeleton'

const props = defineProps({
  userPosition: {
    type: Number,
    default: 9
  },
  visibilityPercent: {
    type: Number,
    default: 6
  },
  difficulty: {
    type: String,
    default: 'ŚREDNIA'
  },
  keywordsCount: {
    type: Number,
    default: 0
  },
  competitors: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['open-in-google'])

// Color logic matching map markers
const getRankingBadgeColor = (position) => {
  if (position <= 3) {
    return '#22c55e' // bright green for top 3
  } else if (position <= 7) {
    return '#84cc16' // lime green for good
  } else if (position <= 12) {
    return '#eab308' // yellow for medium
  } else if (position <= 18) {
    return '#f97316' // orange for poor
  } else {
    return '#ef4444' // red for very poor/20+
  }
}

const openInGoogle = () => {
  emit('open-in-google')
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
  event.target.nextElementSibling.style.display = 'flex'
}
</script>

<style scoped>
/* Business Listings Panel */
.business-panel {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow-y: auto;
  width: 450px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

@media (max-width: 768px) {
  .business-panel {
    width: calc(100% - 2rem);
    max-width: none;
    min-width: auto;
  }
}

.business-item {
  padding: 1.75rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.business-item:hover {
  background: var(--surface-50);
  cursor: pointer;
}

.business-item:last-child {
  border-bottom: none;
}

/* Business Photo (from Google Business Profile) */
.business-photo {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  background: var(--surface-100);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.business-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.photo-fallback {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: none;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.5rem;
  color: white;
}

/* User Business Card */
.user-business-card {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  margin: 1rem 1.5rem;
}

.user-position-badge {
  /* Background color is dynamic based on ranking - set via :style */
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
}

.visibility-metrics {
  margin: 0.75rem 0;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.metric-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.metric-label {
  font-weight: 600;
  font-size: 0.875rem;
  color: #ef4444;
  min-width: 40px;
  text-align: right;
}

.difficulty-badge {
  display: inline-block;
  background: #f59e0b;
  color: white;
  padding: 0.375rem 0.875rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-top: 0.5rem;
}

.view-google-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.625rem;
  background: white;
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.view-google-link:hover {
  background: #eff6ff;
  border-color: #3b82f6;
}

.competitors-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--surface-border);
  background: var(--surface-50);
}

/* Position Badge - dynamic color based on position (like map markers) */
.position-badge {
  color: white;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
  white-space: nowrap;
}

.business-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.business-rating i {
  color: #22c55e;
  font-size: 0.875rem;
}

.business-description {
  color: var(--text-color-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.close-panel-btn {
  position: sticky;
  top: 0;
  background: white;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  z-index: 10;
  flex-shrink: 0;
}

.close-panel-btn h3 {
  font-size: 0.9375rem;
  line-height: 1.4;
  font-weight: 600;
}

.close-panel-btn p {
  color: var(--text-color-secondary);
  font-size: 0.75rem;
  line-height: 1.3;
}

.business-panel-content {
  flex: 1;
  overflow-y: auto;
}
</style>
