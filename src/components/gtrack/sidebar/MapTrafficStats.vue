<template>
  <div class="stats-card-wrapper">
    <div
      v-if="loading"
      class="shadow bg-surface-0 rounded-2xl border border-surface-200 p-6 space-y-6"
    >
      <div class="flex items-center justify-between">
        <Skeleton height="24px" width="55%" borderRadius="0.75rem" />
      </div>
      <Skeleton height="120px" class="rounded-xl" />
      <div class="grid grid-cols-1 gap-4">
        <Skeleton v-for="n in 3" :key="n" height="70px" class="rounded-xl" />
      </div>
    </div>

    <div v-else class="space-y-4">
      <!-- Period Info -->
      <div class="period-info">
        <i class="pi pi-calendar text-xs"></i>
        <span class="text-xs text-gray-500">Z ostatnich 7 dni</span>
      </div>

      <!-- Hero Metric Card -->
      <div v-if="heroMetric" class="hero-card">
        <div class="hero-header">
          <div class="hero-chip">
            <i class="pi pi-chart-line text-lg"></i>
          </div>
          <div class="hero-meta">
            <span class="hero-label">{{ heroMetric.label }}</span>
            <span class="hero-value">{{ heroMetric.value }}</span>
            <div class="hero-trend">
              <span v-if="heroChangeLabel" :class="getTrendClass(heroMetric.trend)">
                <i :class="getTrendIcon(heroMetric.trend)"></i>
                {{ heroChangeLabel }}
              </span>
            </div>
          </div>
        </div>
        <div class="hero-chart">
          <svg viewBox="0 0 320 110" preserveAspectRatio="none">
            <defs>
              <linearGradient id="hero-line" x1="0" x2="320" y1="0" y2="0">
                <stop offset="0%" stop-color="#3b82f6" />
                <stop offset="100%" stop-color="#1d4ed8" />
              </linearGradient>
              <linearGradient id="hero-fill" x1="0" x2="0" y1="0" y2="110">
                <stop offset="0%" stop-color="#bfdbfe" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#bfdbfe" stop-opacity="0" />
              </linearGradient>
            </defs>
            <path :d="heroFillPath" fill="url(#hero-fill)" />
            <path :d="heroLinePath" stroke="url(#hero-line)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>

      <!-- Additional Metrics -->
      <div class="additional-metrics">
        <div class="metric-item">
          <div class="metric-header">
            <div class="metric-icon">
              <i class="pi pi-star"></i>
            </div>
            <div class="metric-info">
              <span class="metric-title">Średnia pozycja</span>
              <div class="metric-value-row">
                <span class="metric-value">{{ additionalMetrics.averagePosition }}</span>
                <span :class="getTrendClass(additionalMetrics.positionTrend)" class="metric-trend">
                  <i :class="getTrendIcon(additionalMetrics.positionTrend)"></i>
                  {{ additionalMetrics.positionChange }}
                </span>
              </div>
              <span class="metric-period">względem słów kluczowych</span>
            </div>
          </div>
          <div class="metric-chart">
            <svg viewBox="0 0 200 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="metric-position" x1="0" x2="200" y1="0" y2="0">
                  <stop offset="0%" stop-color="#6366f1" stop-opacity="0.8" />
                  <stop offset="100%" stop-color="#6366f1" stop-opacity="0.4" />
                </linearGradient>
                <clipPath id="clip-position">
                  <rect x="0" y="0" width="200" height="40" rx="12" ry="12" />
                </clipPath>
              </defs>
              <path
                :d="getMetricFillPath(additionalMetrics.positionBars)"
                fill="#6366f1"
                fill-opacity="0.15"
                clip-path="url(#clip-position)"
              />
              <path
                :d="getSourcePath(additionalMetrics.positionBars)"
                stroke="url(#metric-position)"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>

        <div class="metric-item">
          <div class="metric-header">
            <div class="metric-icon">
              <i class="pi pi-phone"></i>
            </div>
            <div class="metric-info">
              <span class="metric-title">Kliknięcia w telefon</span>
              <div class="metric-value-row">
                <span class="metric-value">{{ additionalMetrics.phoneClicks }}</span>
                <span :class="getTrendClass(additionalMetrics.phoneTrend)" class="metric-trend">
                  <i :class="getTrendIcon(additionalMetrics.phoneTrend)"></i>
                  {{ additionalMetrics.phoneChange }}
                </span>
              </div>
            </div>
          </div>
          <div class="metric-chart">
            <svg viewBox="0 0 200 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="metric-phone" x1="0" x2="200" y1="0" y2="0">
                  <stop offset="0%" stop-color="#10b981" stop-opacity="0.8" />
                  <stop offset="100%" stop-color="#10b981" stop-opacity="0.4" />
                </linearGradient>
                <clipPath id="clip-phone">
                  <rect x="0" y="0" width="200" height="40" rx="12" ry="12" />
                </clipPath>
              </defs>
              <path
                :d="getMetricFillPath(additionalMetrics.phoneBars)"
                fill="#10b981"
                fill-opacity="0.15"
                clip-path="url(#clip-phone)"
              />
              <path
                :d="getSourcePath(additionalMetrics.phoneBars)"
                stroke="url(#metric-phone)"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>

        <div class="metric-item">
          <div class="metric-header">
            <div class="metric-icon">
              <i class="pi pi-directions"></i>
            </div>
            <div class="metric-info">
              <span class="metric-title">Wskazówki dojazdu</span>
              <div class="metric-value-row">
                <span class="metric-value">{{ additionalMetrics.directionsClicks }}</span>
                <span :class="getTrendClass(additionalMetrics.directionsTrend)" class="metric-trend">
                  <i :class="getTrendIcon(additionalMetrics.directionsTrend)"></i>
                  {{ additionalMetrics.directionsChange }}
                </span>
              </div>
            </div>
          </div>
          <div class="metric-chart">
            <svg viewBox="0 0 200 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="metric-directions" x1="0" x2="200" y1="0" y2="0">
                  <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.8" />
                  <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.4" />
                </linearGradient>
                <clipPath id="clip-directions">
                  <rect x="0" y="0" width="200" height="40" rx="12" ry="12" />
                </clipPath>
              </defs>
              <path
                :d="getMetricFillPath(additionalMetrics.directionsBars)"
                fill="#f59e0b"
                fill-opacity="0.15"
                clip-path="url(#clip-directions)"
              />
              <path
                :d="getSourcePath(additionalMetrics.directionsBars)"
                stroke="url(#metric-directions)"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>

        <div class="metric-item">
          <div class="metric-header">
            <div class="metric-icon">
              <i class="pi pi-comment"></i>
            </div>
            <div class="metric-info">
              <span class="metric-title">Nowe opinie</span>
              <div class="metric-value-row">
                <span class="metric-value">{{ additionalMetrics.newReviews }}</span>
                <span class="metric-period">w tym tygodniu</span>
              </div>
            </div>
          </div>
          <div class="metric-chart">
            <svg viewBox="0 0 200 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="metric-reviews" x1="0" x2="200" y1="0" y2="0">
                  <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.8" />
                  <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.4" />
                </linearGradient>
                <clipPath id="clip-reviews">
                  <rect x="0" y="0" width="200" height="40" rx="12" ry="12" />
                </clipPath>
              </defs>
              <path
                :d="getMetricFillPath(additionalMetrics.reviewsBars)"
                fill="#8b5cf6"
                fill-opacity="0.15"
                clip-path="url(#clip-reviews)"
              />
              <path
                :d="getSourcePath(additionalMetrics.reviewsBars)"
                stroke="url(#metric-reviews)"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Skeleton from 'primevue/skeleton'
import Button from 'primevue/button'

const props = defineProps({
  summary: {
    type: Object,
    default: () => ({})
  },
  sources: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const heroMetric = computed(() => {
  if (props.summary && props.summary.primary) {
    return {
      label: props.summary.primary.label || 'All Traffic',
      value: props.summary.primary.value || '0 Visits',
      trend: props.summary.primary.trend || 'up'
    }
  }
  return null
})

const heroChangeLabel = computed(() => {
  // Mock change label - can be calculated from summary data
  return '+12.5%'
})

// Additional metrics data
const additionalMetrics = computed(() => ({
  averagePosition: '4.2',
  positionChange: '+0.8',
  positionTrend: 'up', // 'up', 'down', 'stable'
  positionBars: [4.5, 4.3, 4.1, 4.0, 4.2, 4.2],
  phoneClicks: '342',
  phoneChange: '+15.2%',
  phoneTrend: 'up',
  phoneBars: [18, 22, 20, 25, 28, 30],
  directionsClicks: '189',
  directionsChange: '+8.4%',
  directionsTrend: 'up',
  directionsBars: [12, 14, 16, 15, 17, 18],
  newReviews: '12',
  reviewsBars: [2, 1, 3, 2, 1, 3]
}))

const heroFillPath = computed(() => {
  // Generate smooth area path for hero chart
  const bars = props.summary?.primary?.bars || [22, 14, 19, 19, 17, 24]
  const width = 320
  const height = 110
  const barWidth = width / (bars.length - 1)
  const maxBar = Math.max(...bars)
  
  // Calculate points
  const points = bars.map((bar, index) => ({
    x: index * barWidth,
    y: height - (bar / maxBar) * height
  }))
  
  // Create smooth curve using cubic bezier for top line
  let topPath = `M ${points[0].x} ${points[0].y} `
  
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i]
    const next = points[i + 1]
    const controlPointOffset = barWidth * 0.3
    
    const cp1x = current.x + controlPointOffset
    const cp1y = current.y
    const cp2x = next.x - controlPointOffset
    const cp2y = next.y
    
    topPath += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y} `
  }
  
  // Close path with bottom line
  return `${topPath} L ${width} ${height} L 0 ${height} Z`
})

const heroLinePath = computed(() => {
  // Generate smooth curved line path for hero chart using cubic bezier
  const bars = props.summary?.primary?.bars || [22, 14, 19, 19, 17, 24]
  const width = 320
  const height = 110
  const barWidth = width / (bars.length - 1)
  const maxBar = Math.max(...bars)
  
  // Calculate points
  const points = bars.map((bar, index) => ({
    x: index * barWidth,
    y: height - (bar / maxBar) * height
  }))
  
  // Create smooth curve using cubic bezier
  let path = `M ${points[0].x} ${points[0].y} `
  
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i]
    const next = points[i + 1]
    const controlPointOffset = barWidth * 0.3
    
    const cp1x = current.x + controlPointOffset
    const cp1y = current.y
    const cp2x = next.x - controlPointOffset
    const cp2y = next.y
    
    path += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y} `
  }
  
  return path
})

const getSourcePath = (bars) => {
  if (!bars || bars.length === 0) return ''
  
  const width = 200
  const height = 40
  const barWidth = width / (bars.length - 1)
  const maxBar = Math.max(...bars)
  
  // Calculate points
  const points = bars.map((bar, index) => ({
    x: index * barWidth,
    y: height - (bar / maxBar) * height
  }))
  
  // Create smooth curve using cubic bezier
  let path = `M ${points[0].x} ${points[0].y} `
  
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i]
    const next = points[i + 1]
    const controlPointOffset = barWidth * 0.3
    
    const cp1x = current.x + controlPointOffset
    const cp1y = current.y
    const cp2x = next.x - controlPointOffset
    const cp2y = next.y
    
    path += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y} `
  }
  
  return path
}

const getMetricFillPath = (bars) => {
  if (!bars || bars.length === 0) return ''
  
  const width = 200
  const height = 40
  const barWidth = width / (bars.length - 1)
  const maxBar = Math.max(...bars)
  
  // Calculate points
  const points = bars.map((bar, index) => ({
    x: index * barWidth,
    y: height - (bar / maxBar) * height
  }))
  
  // Create smooth curve using cubic bezier for top line
  let topPath = `M ${points[0].x} ${points[0].y} `
  
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i]
    const next = points[i + 1]
    const controlPointOffset = barWidth * 0.3
    
    const cp1x = current.x + controlPointOffset
    const cp1y = current.y
    const cp2x = next.x - controlPointOffset
    const cp2y = next.y
    
    topPath += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y} `
  }
  
  // Close path with bottom line
  return `${topPath} L ${width} ${height} L 0 ${height} Z`
}

const getSourceColor = (sourceId) => {
  const colors = {
    instagram: '#E4405F',
    linkedin: '#0077B5',
    google: '#4285F4',
    x: '#000000',
    twitter: '#1DA1F2'
  }
  return colors[sourceId] || '#3b82f6'
}

const getTrendIcon = (trend) => {
  switch (trend) {
    case 'up':
      return 'pi pi-arrow-up'
    case 'down':
      return 'pi pi-arrow-down'
    case 'stable':
      return 'pi pi-minus'
    default:
      return 'pi pi-minus'
  }
}

const getTrendClass = (trend) => {
  switch (trend) {
    case 'up':
      return 'trend-up'
    case 'down':
      return 'trend-down'
    case 'stable':
      return 'trend-stable'
    default:
      return 'trend-stable'
  }
}
</script>

<style scoped>
.stats-card-wrapper {
  padding: 1.5rem;
}

.hero-card {
  background: white;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.hero-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.hero-chip {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.6rem;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.hero-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.hero-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.hero-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.hero-change {
  font-size: 0.875rem;
  color: #10b981;
  font-weight: 600;
}

.hero-action {
  margin-left: auto;
}

.hero-chart {
  width: 100%;
  height: 110px;
}

.hero-chart svg {
  width: 100%;
  height: 100%;
}

.source-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.source-card {
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  padding: 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.source-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.source-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 1rem;
}

.source-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.source-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.source-value {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.source-chart {
  width: 100%;
  height: 40px;
}

.source-chart svg {
  width: 100%;
  height: 100%;
}

.period-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  color: #6b7280;
}

.hero-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.125rem;
}

.hero-period {
  margin-left: 0.5rem;
}

.trend-up {
  color: #10b981;
  font-weight: 600;
  font-size: 0.875rem;
}

.trend-down {
  color: #ef4444;
  font-weight: 600;
  font-size: 0.875rem;
}

.trend-stable {
  color: #6b7280;
  font-weight: 600;
  font-size: 0.875rem;
}

.source-value-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.source-trend {
  font-size: 0.75rem;
}

.additional-metrics {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.metric-item {
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  padding: 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.metric-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.metric-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 1rem;
  flex-shrink: 0;
}

.metric-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric-title {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.metric-value-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.125rem;
}

.metric-value {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.metric-trend {
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.metric-period {
  font-size: 0.75rem;
  color: #9ca3af;
}

.metric-chart {
  width: 100%;
  height: 40px;
}

.metric-chart svg {
  width: 100%;
  height: 100%;
}
</style>
