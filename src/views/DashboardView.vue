<template>
  <div class="p-6 overflow-y-auto h-full bg-gray-50">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p class="text-sm text-gray-500 mt-1">Przegląd stanu Twojej wizytówki</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-400">Ostatnia aktualizacja: {{ lastUpdate }}</span>
          <Button
            icon="pi pi-refresh"
            severity="secondary"
            text
            rounded
            @click="refreshData"
            :loading="isLoading"
          />
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card v-for="kpi in kpiCards" :key="kpi.key" class="border-0 shadow-sm">
          <template #content>
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ kpi.label }}</p>
                <p class="text-2xl font-bold text-gray-900 mt-1">{{ kpi.value }}</p>
                <div v-if="kpi.change" class="flex items-center gap-1 mt-1">
                  <i
                    :class="[
                      'pi text-xs',
                      kpi.change > 0 ? 'pi-arrow-up text-green-600' : 'pi-arrow-down text-red-600'
                    ]"
                  />
                  <span
                    :class="[
                      'text-xs font-medium',
                      kpi.change > 0 ? 'text-green-600' : 'text-red-600'
                    ]"
                  >
                    {{ Math.abs(kpi.change) }}{{ kpi.changeUnit || '' }} (7d)
                  </span>
                </div>
              </div>
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :class="kpi.bgColor"
              >
                <i :class="['pi', kpi.icon, kpi.iconColor]" />
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Alerts Feed -->
        <Card class="border-0 shadow-sm lg:col-span-1">
          <template #title>
            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-gray-600 uppercase tracking-wider">Alerty</span>
              <Badge v-if="alerts.length" :value="alerts.length" severity="danger" />
            </div>
          </template>
          <template #content>
            <div v-if="alerts.length" class="space-y-3 max-h-64 overflow-y-auto">
              <div
                v-for="alert in alerts"
                :key="alert.id"
                class="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                :class="getAlertBgClass(alert.type)"
                @click="navigateToAlert(alert)"
              >
                <i :class="['pi text-sm mt-0.5', getAlertIconClass(alert.type)]" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-800">{{ alert.message }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ formatDate(alert.created_at) }}</p>
                </div>
                <i class="pi pi-chevron-right text-gray-400 text-xs" />
              </div>
            </div>
            <div v-else class="text-center py-8">
              <i class="pi pi-check-circle text-4xl text-green-300 mb-2" />
              <p class="text-sm text-gray-500">Brak alertów</p>
            </div>
          </template>
        </Card>

        <!-- Activity Stream -->
        <Card class="border-0 shadow-sm lg:col-span-2">
          <template #title>
            <span class="text-sm font-bold text-gray-600 uppercase tracking-wider">Ostatnia aktywność</span>
          </template>
          <template #content>
            <div v-if="activityStream.length" class="space-y-4 max-h-64 overflow-y-auto">
              <div
                v-for="activity in activityStream"
                :key="activity.id"
                class="flex items-start gap-3"
              >
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  :class="getActivityBgClass(activity.type)"
                >
                  <i :class="['pi text-xs', getActivityIconClass(activity.type)]" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-gray-800">{{ activity.summary }}</p>
                  <p class="text-xs text-gray-400 mt-1">{{ formatDate(activity.timestamp) }}</p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <i class="pi pi-history text-4xl text-gray-300 mb-2" />
              <p class="text-sm text-gray-500">Brak aktywności</p>
            </div>
          </template>
        </Card>
      </div>

      <!-- Trends Charts -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Reviews Trend -->
        <Card class="border-0 shadow-sm">
          <template #title>
            <span class="text-sm font-bold text-gray-600 uppercase tracking-wider">Opinie w czasie</span>
          </template>
          <template #content>
            <Chart type="line" :data="reviewsChartData" :options="chartOptions" class="h-48" />
          </template>
        </Card>

        <!-- Rating Trend -->
        <Card class="border-0 shadow-sm">
          <template #title>
            <span class="text-sm font-bold text-gray-600 uppercase tracking-wider">Średnia ocena</span>
          </template>
          <template #content>
            <Chart type="line" :data="ratingChartData" :options="ratingChartOptions" class="h-48" />
          </template>
        </Card>
      </div>

      <!-- Quick Actions -->
      <Card class="border-0 shadow-sm">
        <template #title>
          <span class="text-sm font-bold text-gray-600 uppercase tracking-wider">Szybkie akcje</span>
        </template>
        <template #content>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              v-for="action in quickActions"
              :key="action.id"
              :label="action.label"
              :icon="action.icon"
              :severity="action.severity || 'secondary'"
              outlined
              class="justify-start"
              @click="handleQuickAction(action)"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import Chart from 'primevue/chart';

const router = useRouter();
const isLoading = ref(false);

// Mock data matching PRD structure
const dashboardData = ref({
  kpi: {
    total_reviews: 124,
    avg_rating: 4.7,
    new_reviews_7d: 5,
    removed_reviews_7d: 1,
    active_tasks: 3,
    scheduled_posts: 2,
    recent_posts: 5,
    profile_status: 'ok'
  },
  alerts: [
    { id: 'a1', type: 'review_deleted', message: 'Usunięto 1 opinię', created_at: '2025-11-26T10:15:00Z', link: '/reviews' },
    { id: 'a2', type: 'post_failed', message: 'Błąd publikacji posta', created_at: '2025-11-25T16:00:00Z', link: '/posts' },
    { id: 'a3', type: 'profile_changed', message: 'Google zaktualizował godziny otwarcia', created_at: '2025-11-24T09:30:00Z', link: '/settings' }
  ],
  activity_stream: [
    { id: 'e1', type: 'new_review', summary: 'Nowa recenzja od "Jan Kowalski" - 5 gwiazdek', timestamp: '2025-11-26T08:30:00Z', related_object_id: 'r789' },
    { id: 'e2', type: 'post_published', summary: 'Opublikowano post "Promocja Zima"', timestamp: '2025-11-25T12:00:00Z', related_object_id: 'p101' },
    { id: 'e3', type: 'reply_sent', summary: 'Odpowiedziano na recenzję od "Anna Nowak"', timestamp: '2025-11-25T10:45:00Z', related_object_id: 'r788' },
    { id: 'e4', type: 'task_completed', summary: 'Zakończono zadanie "Dodaj zdjęcia wnętrza"', timestamp: '2025-11-24T15:20:00Z', related_object_id: 't45' },
    { id: 'e5', type: 'new_review', summary: 'Nowa recenzja od "Piotr Wiśniewski" - 4 gwiazdki', timestamp: '2025-11-24T11:00:00Z', related_object_id: 'r787' }
  ],
  trend_data: {
    reviews_history: [
      { date: '2025-10-01', count: 8 },
      { date: '2025-10-15', count: 12 },
      { date: '2025-11-01', count: 15 },
      { date: '2025-11-15', count: 18 },
      { date: '2025-11-26', count: 22 }
    ],
    rating_history: [
      { date: '2025-10-01', avg: 4.5 },
      { date: '2025-10-15', avg: 4.6 },
      { date: '2025-11-01', avg: 4.6 },
      { date: '2025-11-15', avg: 4.7 },
      { date: '2025-11-26', avg: 4.7 }
    ]
  }
});

const lastUpdate = computed(() => {
  return new Date().toLocaleString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit'
  });
});

const kpiCards = computed(() => [
  {
    key: 'reviews',
    label: 'Wszystkie opinie',
    value: dashboardData.value.kpi.total_reviews,
    change: dashboardData.value.kpi.new_reviews_7d,
    changeUnit: '',
    icon: 'pi-comments',
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    key: 'rating',
    label: 'Średnia ocena',
    value: dashboardData.value.kpi.avg_rating.toFixed(1),
    change: 0.1,
    changeUnit: '',
    icon: 'pi-star-fill',
    iconColor: 'text-yellow-500',
    bgColor: 'bg-yellow-50'
  },
  {
    key: 'tasks',
    label: 'Aktywne zadania',
    value: dashboardData.value.kpi.active_tasks,
    icon: 'pi-check-square',
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    key: 'posts',
    label: 'Zaplanowane posty',
    value: dashboardData.value.kpi.scheduled_posts,
    icon: 'pi-calendar',
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50'
  }
]);

const alerts = computed(() => dashboardData.value.alerts);
const activityStream = computed(() => dashboardData.value.activity_stream);

const quickActions = [
  { id: 'ask-review', label: 'Poproś o opinię', icon: 'pi pi-envelope', route: '/reviews/acquisition', severity: 'primary' },
  { id: 'add-post', label: 'Dodaj post', icon: 'pi pi-plus', route: '/posts' },
  { id: 'run-audit', label: 'Uruchom audyt', icon: 'pi pi-search', route: '/reports/audit' },
  { id: 'check-competition', label: 'Sprawdź konkurencję', icon: 'pi pi-users', route: '/reports/competition' }
];

// Chart data
const reviewsChartData = computed(() => ({
  labels: dashboardData.value.trend_data.reviews_history.map(d => formatChartDate(d.date)),
  datasets: [
    {
      label: 'Nowe opinie',
      data: dashboardData.value.trend_data.reviews_history.map(d => d.count),
      fill: true,
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    }
  ]
}));

const ratingChartData = computed(() => ({
  labels: dashboardData.value.trend_data.rating_history.map(d => formatChartDate(d.date)),
  datasets: [
    {
      label: 'Średnia ocena',
      data: dashboardData.value.trend_data.rating_history.map(d => d.avg),
      fill: true,
      borderColor: '#F59E0B',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      tension: 0.4
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 10 } }
    },
    y: {
      beginAtZero: true,
      ticks: { font: { size: 10 } }
    }
  }
};

const ratingChartOptions = {
  ...chartOptions,
  scales: {
    ...chartOptions.scales,
    y: {
      min: 4.0,
      max: 5.0,
      ticks: { font: { size: 10 } }
    }
  }
};

// Helper functions
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatChartDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pl-PL', { day: '2-digit', month: 'short' });
}

function getAlertBgClass(type) {
  const classes = {
    review_deleted: 'bg-red-50 hover:bg-red-100',
    post_failed: 'bg-orange-50 hover:bg-orange-100',
    profile_changed: 'bg-yellow-50 hover:bg-yellow-100'
  };
  return classes[type] || 'bg-gray-50 hover:bg-gray-100';
}

function getAlertIconClass(type) {
  const classes = {
    review_deleted: 'pi-trash text-red-600',
    post_failed: 'pi-exclamation-triangle text-orange-600',
    profile_changed: 'pi-info-circle text-yellow-600'
  };
  return classes[type] || 'pi-bell text-gray-600';
}

function getActivityBgClass(type) {
  const classes = {
    new_review: 'bg-blue-100',
    post_published: 'bg-green-100',
    reply_sent: 'bg-purple-100',
    task_completed: 'bg-emerald-100'
  };
  return classes[type] || 'bg-gray-100';
}

function getActivityIconClass(type) {
  const classes = {
    new_review: 'pi-star text-blue-600',
    post_published: 'pi-megaphone text-green-600',
    reply_sent: 'pi-reply text-purple-600',
    task_completed: 'pi-check text-emerald-600'
  };
  return classes[type] || 'pi-circle text-gray-600';
}

function navigateToAlert(alert) {
  const locationId = router.currentRoute.value.params.locationId || 'demo-location';
  router.push(`/${locationId}${alert.link}`);
}

function handleQuickAction(action) {
  const locationId = router.currentRoute.value.params.locationId || 'demo-location';
  router.push(`/${locationId}${action.route}`);
}

function refreshData() {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
}

onMounted(() => {
  // In real app, fetch dashboard data here
});
</script>
